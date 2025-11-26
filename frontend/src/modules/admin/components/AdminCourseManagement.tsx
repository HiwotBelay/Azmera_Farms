"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Eye, Search, Filter } from "lucide-react";
import { adminApi } from "../api/admin.api";
import { Course } from "../../courses/api/courses.api";

export default function AdminCourseManagement() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Read status from URL query parameter, default to 'pending'
  const statusFromUrl = searchParams.get('status')?.toLowerCase() || 'pending';
  const validStatuses: Array<'all' | 'pending' | 'published' | 'draft' | 'rejected'> = ['all', 'pending', 'published', 'draft', 'rejected'];
  const initialFilter = validStatuses.includes(statusFromUrl as any) ? statusFromUrl as any : 'pending';
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'published' | 'draft' | 'rejected'>(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<{ [key: string]: string }>({});
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  // Sync filter with URL when URL changes
  useEffect(() => {
    const statusFromUrl = searchParams.get('status')?.toLowerCase() || 'pending';
    if (validStatuses.includes(statusFromUrl as any)) {
      setFilter(statusFromUrl as any);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log('🔄 Filter changed, fetching courses with filter:', filter);
    fetchAllCourses();
  }, [filter]);

  const fetchAllCoursesWithFilter = async (statusFilter: typeof filter) => {
    try {
      setLoading(true);
      // Build filter object
      const filterParams: any = { 
        limit: 1000, // Increase limit to get all courses
      };
      
      // Add status filter if not 'all'
      if (statusFilter !== 'all') {
        filterParams.status = statusFilter.toUpperCase();
      }
      
      console.log('🔍 Frontend: Fetching courses with params:', filterParams);
      console.log('🔍 Frontend: Calling adminApi.getCourses() which should hit: /api/admin/courses');
      
      // Check if we have auth token
      const token = localStorage.getItem('accessToken');
      console.log('🔍 Frontend: Has auth token:', !!token);
      
      // Fetch all courses using admin-specific endpoint
      // This calls: GET http://localhost:3001/api/admin/courses?status=PENDING&limit=1000
      const response = await adminApi.getCourses(filterParams);
      console.log('🔍 Frontend: API call completed, endpoint used: /api/admin/courses');
      
      console.log(`✅ Frontend: Fetched ${response.courses.length} courses with filter: ${statusFilter}`, response.courses);
      console.log('📊 Frontend: Courses statuses:', response.courses.map(c => ({ id: c.id, title: c.title, status: c.status })));
      
      if (response.courses.length === 0 && statusFilter === 'pending') {
        console.error('❌ Frontend: No pending courses found! Check backend logs.');
      }
      
      setCourses(response.courses);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      console.error('Error details:', error.response?.data);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    await fetchAllCoursesWithFilter(filter);
  };

  const handlePublish = async (courseId: string) => {
    if (!confirm('Are you sure you want to publish this course? It will be visible to all users.')) {
      return;
    }

    try {
      setProcessingId(courseId);
      await adminApi.publishCourse(courseId);
      await fetchAllCourses();
      alert('Course published successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to publish course');
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

  const filteredCourses = courses.filter(course => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.creator?.email.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      PUBLISHED: { color: 'bg-green-100 text-green-800', label: 'Published' },
      REJECTED: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const pendingCount = courses.filter(c => c.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Course Management</h1>
          <p className="text-gray-600">Review and manage all courses</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Pending Review</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Published</div>
          <div className="text-2xl font-bold text-green-600">
            {courses.filter(c => c.status === 'PUBLISHED').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Draft</div>
          <div className="text-2xl font-bold text-gray-600">
            {courses.filter(c => c.status === 'DRAFT').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold text-primary">{courses.length}</div>
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
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['all', 'pending', 'published', 'draft', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={async () => {
                  console.log('🔘 Pending button clicked, status:', status);
                  setFilter(status);
                  // Update URL query parameter
                  const params = new URLSearchParams(searchParams.toString());
                  if (status === 'all') {
                    params.delete('status');
                  } else {
                    params.set('status', status.toUpperCase());
                  }
                  router.push(`/admin/courses?${params.toString()}`);
                  // Immediately fetch with the new filter to ensure it works
                  await fetchAllCoursesWithFilter(status);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500">Loading courses...</div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-2">No courses found with status: <strong>{filter.toUpperCase()}</strong></p>
          <p className="text-sm text-gray-500">Total courses fetched: {courses.length}</p>
          {courses.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              <p>Available statuses in database:</p>
              <ul className="list-disc list-inside mt-2">
                {Array.from(new Set(courses.map(c => c.status))).map(status => (
                  <li key={status}>{status}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
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
                    Lessons
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
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
                        <img
                          src={course.thumbnail || "https://via.placeholder.com/60x40"}
                          alt={course.title}
                          className="w-16 h-10 object-cover rounded mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {course.shortDescription || course.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {course.creator?.firstName} {course.creator?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{course.creator?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(course.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.lessonsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.isFree ? 'Free' : `ETB ${course.price}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/courses/${course.id}`}
                          className="text-primary hover:text-primary-dark"
                          target="_blank"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {course.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handlePublish(course.id)}
                              disabled={processingId === course.id}
                              className="text-green-600 hover:text-green-800 disabled:opacity-50"
                              title="Publish"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowRejectModal(course.id)}
                              disabled={processingId === course.id}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50"
                              title="Reject"
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

