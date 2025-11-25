"use client";

import { useState, useEffect } from "react";
import CreatorDashboardLayout from "@/components/layout/CreatorDashboardLayout";
import { coursesApi, Course } from "@/modules/courses/api/courses.api";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Video,
  FileText,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

export default function CreatorCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesApi.getMyCourses();
      setCourses(data);
    } catch (error: any) {
      console.error("Failed to load courses:", error);
      alert("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || course.status === filterStatus.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const styles = {
      published: "bg-green-100 text-green-700",
      draft: "bg-yellow-100 text-yellow-700",
      pending: "bg-blue-100 text-blue-700",
      rejected: "bg-red-100 text-red-700",
    };
    return styles[statusLower as keyof typeof styles] || styles.draft;
  };

  if (loading) {
    return (
      <CreatorDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#01BC63] border-t-transparent rounded-full animate-spin" />
        </div>
      </CreatorDashboardLayout>
    );
  }

  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Courses
            </h1>
            <p className="text-gray-600">
              Manage your courses and add content to existing courses
            </p>
          </div>
          <Link
            href="/creator/courses/create"
            className="flex items-center gap-2 px-6 py-3 bg-[#01BC63] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create New Course
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#01BC63] focus:border-[#01BC63] outline-none transition-all"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No courses found</p>
            <p className="text-sm text-gray-500 mb-6">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first course to get started"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Link
                href="/creator/courses/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#01BC63] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Your First Course
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Course Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-[#01BC63] to-[#059669] flex items-center justify-center">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText className="w-16 h-16 text-white opacity-50" />
                  )}
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600">{course.category}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                        course.status
                      )}`}
                    >
                      {course.status}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Students</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {course.totalEnrollments}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Revenue</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ETB {course.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Sections</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {course.sections?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Rating</p>
                      <p className="text-sm font-medium text-gray-900">
                        {course.averageRating > 0
                          ? course.averageRating.toFixed(1)
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/creator/courses/${course.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#01BC63] text-white rounded-lg font-medium hover:bg-[#059669] transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Manage
                    </Link>
                    <Link
                      href={`/creator/courses/${course.id}/add-content`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-[#01BC63] text-[#01BC63] rounded-lg font-medium hover:bg-[#01BC63]/10 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Content
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CreatorDashboardLayout>
  );
}
