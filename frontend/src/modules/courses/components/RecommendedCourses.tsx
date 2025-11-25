"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { coursesApi, Course } from "../api/courses.api";

export default function RecommendedCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendedCourses();
  }, []);

  const loadRecommendedCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesApi.getAll({ status: "PUBLISHED" });
      // Get top 3 courses by rating or enrollments
      const sorted = data
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, 3);
      setCourses(sorted);
    } catch (error: any) {
      console.error("Failed to load recommended courses:", error);
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

  if (courses.length === 0) {
    return null;
  }

  const recommendedCourses = courses.map((course) => ({
    id: course.id,
    title: course.title,
    instructor: `${course.creator.firstName} ${course.creator.lastName}`,
    rating: course.averageRating,
    reviews: course.totalReviews,
    price: course.price > 0 ? `ETB ${course.price}` : "Free",
    badges:
      course.price === 0
        ? ["Free"]
        : course.totalEnrollments > 100
        ? ["Popular"]
        : [],
    image: course.thumbnail || "/placeholder-course.jpg",
  }));
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Recommended for You
        </h2>
        <Link
          href="/courses"
          className="text-[#01BC63] hover:underline flex items-center gap-1"
        >
          Browse All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                {course.badges.map((badge, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      badge === "New"
                        ? "bg-yellow-400 text-gray-800"
                        : badge === "Free"
                        ? "bg-green-500 text-white"
                        : badge === "Popular"
                        ? "bg-blue-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-1">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold ml-1">
                    {course.rating}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({course.reviews} reviews)
                  </span>
                </div>
                <span className="text-primary font-bold">{course.price}</span>
              </div>
              <Link
                href={`/courses/${course.id}`}
                className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
