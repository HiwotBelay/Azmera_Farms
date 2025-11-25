"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { coursesApi, Enrollment } from "../api/courses.api";

export default function ContinueLearning() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const data = await coursesApi.getEnrolled();
      // Filter only incomplete courses
      const incomplete = data.filter((e) => !e.completed).slice(0, 4);
      setEnrollments(incomplete);
    } catch (error: any) {
      console.error("Failed to load enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-6 h-6 border-4 border-[#01BC63] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Continue Learning
          </h2>
          <Link
            href="/courses"
            className="text-[#01BC63] hover:underline flex items-center gap-1"
          >
            Browse Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600 mb-4">
            You haven't enrolled in any courses yet
          </p>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-[#01BC63] text-white rounded-lg font-semibold hover:bg-[#059669] transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const courses = enrollments.map((enrollment) => ({
    id: enrollment.course.id,
    title: enrollment.course.title,
    instructor: `${enrollment.course.creator.firstName} ${enrollment.course.creator.lastName}`,
    progress: enrollment.progress,
    lessons: `${Math.floor(
      (enrollment.progress / 100) *
        (enrollment.course.sections?.reduce(
          (acc, s) => acc + (s.lessons?.length || 0),
          0
        ) || 0)
    )}/${
      enrollment.course.sections?.reduce(
        (acc, s) => acc + (s.lessons?.length || 0),
        0
      ) || 0
    }`,
    time: enrollment.course.estimatedDuration || "N/A",
    image: enrollment.course.thumbnail || "/placeholder-course.jpg",
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
        <Link
          href="/courses/my-courses"
          className="text-[#01BC63] hover:underline flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{course.lessons} lessons</span>
                  <span>{course.time}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#01BC63] h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {course.progress}% complete
                </p>
              </div>

              <Link
                href={`/courses/${course.id}/learn`}
                className="block w-full text-center px-4 py-2 bg-[#01BC63] text-white rounded-lg font-semibold hover:bg-[#059669] transition"
              >
                Continue Learning
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
