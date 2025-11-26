"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { coursesApi, Course } from "../api/courses.api";

export default function RecommendedCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await coursesApi.getAll({
          limit: 3,
          sortBy: 'rating',
          sortOrder: 'DESC',
        });
        setCourses(response.courses);
      } catch (error) {
        console.error('Error fetching recommended courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  const formatPrice = (price: number, isFree: boolean): string => {
    if (isFree) return 'Free';
    return `ETB ${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="w-full h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recommended for You</h2>
        <Link
          href="/courses"
          className="text-primary hover:underline flex items-center gap-1"
        >
          Browse All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => {
          const instructorName = course.creator
            ? `${course.creator.firstName || ''} ${course.creator.lastName || ''}`.trim() || course.creator.email
            : 'Unknown Instructor';

          const badges = [];
          if (course.isFree) badges.push('Free');
          if (course.studentsCount > 100) badges.push('Popular');
          if (course.rating >= 4.5) badges.push('Top Rated');

          return (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop"}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                {badges.length > 0 && (
                  <div className="absolute top-3 left-3 flex gap-2">
                    {badges.map((badge, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          badge === "Free"
                            ? "bg-green-500 text-white"
                            : badge === "Popular"
                            ? "bg-blue-500 text-white"
                            : "bg-yellow-400 text-gray-800"
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{instructorName}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold ml-1">{course.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({course.reviewsCount} reviews)
                    </span>
                  </div>
                  <span className="text-primary font-bold">{formatPrice(course.price, course.isFree)}</span>
                </div>
                <Link
                  href={`/courses/${course.id}`}
                  className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
