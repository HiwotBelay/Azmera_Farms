"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Edit, Eye, Send, MoreVertical, BookOpen } from "lucide-react";
import { coursesApi, Course } from "../../courses/api/courses.api";
import { useRouter } from "next/navigation";

export default function MyCoursesManagement() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'pending' | 'published' | 'rejected'>('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const myCourses = await coursesApi.getMyCourses();
        setCourses(myCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.status === filter.toUpperCase();
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

  const handleSubmitForReview = async (courseId: string) => {
    try {
      await coursesApi.submitForReview(courseId);
      // Refresh courses
      const myCourses = await coursesApi.getMyCourses();
      setCourses(myCourses);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit course for review');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
        <Link
          href="/creator/courses/create"
          className="flex items-center gap-2 px-4 py-2 bg-accent-yellow text-gray-800 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Course
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['all', 'draft', 'pending', 'published', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filter === status
                ? 'bg-accent-yellow text-gray-800'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-2 text-xs">
                ({courses.filter(c => c.status === status.toUpperCase()).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {filter === 'all'
              ? "You haven't created any courses yet."
              : `You don't have any ${filter} courses.`}
          </p>
          {filter === 'all' && (
            <Link
              href="/creator/courses/create"
              className="inline-block px-6 py-2 bg-accent-yellow text-gray-800 rounded-lg font-semibold hover:bg-yellow-400 transition"
            >
              Create Your First Course
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={course.thumbnail || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop"}
                alt={course.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800 line-clamp-1 flex-1">
                    {course.title}
                  </h3>
                  {getStatusBadge(course.status)}
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.shortDescription || course.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{course.lessonsCount} lessons</span>
                  <span>•</span>
                  <span>{course.studentsCount} students</span>
                  <span>•</span>
                  <span className="font-semibold text-primary">
                    {course.isFree ? 'Free' : `ETB ${course.price}`}
                  </span>
                </div>

                <div className="flex gap-2">
                  {course.status === 'DRAFT' && (
                    <>
                      <Link
                        href={`/creator/courses/${course.id}/edit`}
                        className="flex-1 text-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleSubmitForReview(course.id)}
                        className="flex-1 px-3 py-2 bg-accent-yellow text-gray-800 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition"
                      >
                        Submit
                      </button>
                    </>
                  )}
                  {course.status === 'PUBLISHED' && (
                    <Link
                      href={`/courses/${course.id}`}
                      className="w-full text-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition"
                    >
                      View Course
                    </Link>
                  )}
                  {course.status === 'PENDING' && (
                    <div className="w-full text-center px-4 py-2 bg-yellow-50 text-yellow-800 rounded-lg text-sm font-semibold">
                      Under Review
                    </div>
                  )}
                  {course.status === 'REJECTED' && (
                    <Link
                      href={`/creator/courses/${course.id}/edit`}
                      className="w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                    >
                      Edit & Resubmit
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

