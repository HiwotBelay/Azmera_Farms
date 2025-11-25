"use client";

import Link from "next/link";
import { Star, Clock, Users } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Modern Greenhouse Farming",
    description:
      "Learn advanced greenhouse techniques for year-round production",
    instructor: "Dr. Alemayehu Tadesse",
    rating: 4.9,
    reviews: 234,
    price: 49,
    duration: "8 weeks",
    lessons: 32,
    image:
      "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=250&fit=crop",
    students: 1250,
  },
  {
    id: 2,
    title: "Dairy Cattle Management",
    description: "Comprehensive guide to raising healthy dairy cattle",
    instructor: "Dr. Meseret Hailu",
    rating: 4.8,
    reviews: 189,
    price: 39,
    duration: "6 weeks",
    lessons: 24,
    image:
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=250&fit=crop",
    students: 980,
  },
  {
    id: 3,
    title: "Agricultural Finance & Marketing",
    description: "Master financial planning and profitable business strategies",
    instructor: "Ato Bekele Molla",
    rating: 4.7,
    reviews: 312,
    price: 59,
    duration: "10 weeks",
    lessons: 40,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    students: 1450,
  },
];

export default function PopularCoursesSection() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Popular Courses
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Top-rated courses from expert instructors
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#01BC63] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            View All Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group relative rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-[#01BC63] hover:shadow-xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                  <Star className="w-4 h-4 text-[#FFDE59] fill-[#FFDE59]" />
                  <span className="font-semibold text-gray-900 text-sm">
                    {course.rating}
                  </span>
                </div>

                <div className="absolute top-4 right-4 bg-[#FFDE59] text-gray-900 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                  ${course.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#01BC63] to-[#FFDE59]"></div>
                  <p className="text-sm text-gray-700 font-medium">
                    {course.instructor}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{course.students} students</span>
                  </div>
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="block w-full text-center px-4 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-[#01BC63] transition-all duration-200"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center lg:hidden">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#01BC63] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
