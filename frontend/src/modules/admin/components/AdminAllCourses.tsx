"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Search, Filter, BookOpen, User, Calendar, DollarSign, Grid3x3, List as ListIcon, RefreshCw, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { coursesApi } from "../../courses/api/courses.api";
import { Course } from "../../courses/api/courses.api";
import { adminApi } from "../api/admin.api";

export default function AdminAllCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<{ [key: string]: string }>({});
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  useEffect(() => {
    fetchAllCourses();
  }, [statusFilter]);

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // When statusFilter is "all", don't send any status filter to get ALL courses
      const filterParams: any = {
        limit: 1000, // Send as number to get all courses
      };

      if (statusFilter !== "all") {
        filterParams.status = statusFilter.toUpperCase();
      }

      console.log('🔍 AdminAllCourses: Fetching courses with params:', filterParams);
      console.log('🔍 AdminAllCourses: API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');
      console.log('🔍 AdminAllCourses: Status filter:', statusFilter);
      
      const response = await coursesApi.getAll(filterParams);
      
      console.log('✅ AdminAllCourses: Response received:', {
        coursesCount: response.courses?.length || 0,
        total: response.total || 0,
        courses: response.courses,
      });
      
      if (response && response.courses) {
        setCourses(response.courses);
        setError(null);
        console.log('✅ AdminAllCourses: Courses set successfully:', response.courses.length);
      } else {
        console.warn('⚠️ AdminAllCourses: Response structure unexpected:', response);
        setCourses([]);
        setError('Unexpected response structure from API');
      }
    } catch (error: any) {
      console.error("❌ AdminAllCourses: Error fetching courses:", error);
      console.error("❌ AdminAllCourses: Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      setCourses([]);
      setError(error.response?.data?.message || error.message || 'Failed to fetch courses. Please check the browser console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (courseId: string) => {
    if (!confirm('Are you sure you want to accept this course? It will be published and visible to all users.')) {
      return;
    }

    try {
      setProcessingId(courseId);
      await adminApi.acceptCourse(courseId);
      await fetchAllCourses();
      alert('Course accepted and published successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to accept course');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (courseId: string) => {
    const reason = rejectReason[courseId];
    if (!reason || reason.trim().length < 10) {
      alert('Please provide a rejection reason (at least 10 characters)');
      return;
    }

    if (!confirm('Are you sure you want to reject this course?')) {
      return;
    }

    try {
      setProcessingId(courseId);
      await adminApi.rejectCourse(courseId, reason);
      await fetchAllCourses();
      setShowRejectModal(null);
      setRejectReason({ ...rejectReason, [courseId]: '' });
      alert('Course rejected successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject course');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.creator?.email.toLowerCase().includes(query) ||
        course.category?.name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending Review" },
      PUBLISHED: { color: "bg-green-100 text-green-800", label: "Published" },
      REJECTED: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      BEGINNER: { color: "bg-blue-100 text-blue-800", label: "Beginner" },
      INTERMEDIATE: { color: "bg-purple-100 text-purple-800", label: "Intermediate" },
      ADVANCED: { color: "bg-orange-100 text-orange-800", label: "Advanced" },
    };
    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.BEGINNER;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const stats = {
    total: courses.length,
    published: courses.filter((c) => c.status === "PUBLISHED").length,
    pending: courses.filter((c) => c.status === "PENDING").length,
    draft: courses.filter((c) => c.status === "DRAFT").length,
    rejected: courses.filter((c) => c.status === "REJECTED").length,
  };

  // Debug logging
  useEffect(() => {
    console.log('📊 AdminAllCourses: Current state:', {
      coursesCount: courses.length,
      loading,
      statusFilter,
      searchQuery,
      stats,
      courses: courses.map(c => ({ id: c.id, title: c.title, status: c.status })),
    });
  }, [courses, loading, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">All Courses</h1>
          <p className="text-gray-600">View all courses with their details and status</p>
        </div>
        <button
          onClick={fetchAllCourses}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800 mb-1">Error Loading Courses</h3>
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchAllCourses}
              className="mt-2 text-sm text-red-800 underline hover:text-red-900"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Courses</div>
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Published</div>
          <div className="text-2xl font-bold text-green-600">{stats.published}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Draft</div>
          <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Rejected</div>
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses by title, description, creator, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded transition ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title="Grid View"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-2 rounded transition ${
                viewMode === "table"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title="Table View"
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(["all", "pending", "published", "draft", "rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === status
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Display */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500">Loading courses...</div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No courses found</p>
          <p className="text-sm text-gray-500 mt-2">Total courses in database: {courses.length}</p>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lessons
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-16 bg-gray-200 rounded flex items-center justify-center mr-3">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="h-12 w-16 object-cover rounded"
                            />
                          ) : (
                            <BookOpen className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {course.title}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {course.shortDescription || course.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {course.creator?.firstName} {course.creator?.lastName || ""}
                      </div>
                      <div className="text-xs text-gray-500">{course.creator?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(course.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getLevelBadge(course.level)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.lessonsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.studentsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.isFree ? (
                        <span className="text-green-600 font-semibold">Free</span>
                      ) : (
                        <span>ETB {typeof course.price === "string" ? parseFloat(course.price).toFixed(2) : course.price}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/courses/${course.id}`}
                          className="text-primary hover:text-primary-dark flex items-center"
                          target="_blank"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                        {course.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleAccept(course.id)}
                              disabled={processingId === course.id}
                              className="text-green-600 hover:text-green-800 disabled:opacity-50 flex items-center"
                              title="Accept Course"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowRejectModal(course.id)}
                              disabled={processingId === course.id}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center"
                              title="Reject Course"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Course Thumbnail */}
              <div className="relative h-48 bg-gray-200">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">{getStatusBadge(course.status)}</div>
              </div>

              {/* Course Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.shortDescription || course.description}
                </p>

                {/* Course Meta */}
                <div className="space-y-2 mb-4">
                  {/* Creator */}
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span className="truncate">
                      {course.creator?.firstName} {course.creator?.lastName || ""} (
                      {course.creator?.email})
                    </span>
                  </div>

                  {/* Category */}
                  {course.category && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Filter className="w-4 h-4 mr-2" />
                      <span>{course.category.name}</span>
                    </div>
                  )}

                  {/* Level */}
                  <div className="flex items-center">
                    {getLevelBadge(course.level)}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{course.lessonsCount} lessons</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{course.studentsCount} students</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center text-sm font-semibold">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>
                      {course.isFree ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        <span className="text-gray-800">
                          ETB {typeof course.price === "string" ? parseFloat(course.price).toFixed(2) : course.price}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Created Date */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/courses/${course.id}`}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                    target="_blank"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Course
                  </Link>
                  {course.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleAccept(course.id)}
                        disabled={processingId === course.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center"
                        title="Accept Course"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </button>
                      <button
                        onClick={() => setShowRejectModal(course.id)}
                        disabled={processingId === course.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
                        title="Reject Course"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Reject Course</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this course. This will be visible to the creator.
            </p>
            <textarea
              value={rejectReason[showRejectModal] || ''}
              onChange={(e) => setRejectReason({ ...rejectReason, [showRejectModal]: e.target.value })}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason({ ...rejectReason, [showRejectModal]: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectReason[showRejectModal] || rejectReason[showRejectModal].trim().length < 10}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

