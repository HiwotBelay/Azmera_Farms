"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { coursesApi } from "../api/courses.api";
import { Course } from "../api/courses.api";

export default function ContinueLearning() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const myCourses = await coursesApi.getMyCourses();
        // Get courses with progress
        const coursesWithProgress = await Promise.all(
          myCourses.slice(0, 4).map(async (course) => {
            try {
              const progress = await coursesApi.getCourseProgress(course.id);
              return {
                ...course,
                progress: progress.progress || 0,
                completedLessons: progress.completedLessons || 0,
                totalLessons: progress.totalLessons || 0,
              };
            } catch {
              return {
                ...course,
                progress: 0,
                completedLessons: 0,
                totalLessons: 0,
              };
            }
          })
        );
        setCourses(coursesWithProgress);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="w-full h-32 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded mb-3"></div>
                <div className="h-2 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
          <Link
            href="/courses"
            className="text-primary hover:underline flex items-center gap-1"
          >
            Browse Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
          <Link
            href="/courses"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
        <Link
          href="/courses/my-courses"
          className="text-primary hover:underline flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => {
          const instructorName = course.creator
            ? `${course.creator.firstName || ''} ${course.creator.lastName || ''}`.trim() || course.creator.email
            : 'Unknown Instructor';

          return (
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
                <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{instructorName}</p>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{course.completedLessons || 0}/{course.totalLessons || 0} lessons</span>
                    <span>{formatDuration(course.duration || 0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{Math.round(course.progress || 0)}% complete</p>
                </div>

                <Link
                  href={`/courses/${course.id}/learn`}
                  className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
