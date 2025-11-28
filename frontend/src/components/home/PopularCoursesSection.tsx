"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Users, ArrowRight } from "lucide-react";

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
    <section
      id="courses"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#f8fffe] to-white py-20 md:py-32"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#01BC63]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-[#FFDE59]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 md:px-10 max-w-7xl z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#01BC63]/10 to-[#FFDE59]/10 backdrop-blur-sm border border-[#01BC63]/20 rounded-full px-5 py-2.5 mb-6">
            <div className="w-2 h-2 bg-[#01BC63] rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-[#01BC63]">
              Popular Courses
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            <span className="text-gray-900">Popular</span>{" "}
            <span className="bg-gradient-to-r from-[#01BC63] to-[#FFDE59] bg-clip-text text-transparent">
              Courses
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Top-rated courses from expert instructors designed for real-world
            success
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:shadow-[#01BC63]/20 transition-all duration-500 hover:-translate-y-2 hover:border-[#01BC63]"
            >
              {/* Image Container */}
              <div className="relative h-48 md:h-56 overflow-hidden bg-gray-200">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Rating Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-4 h-4 text-[#FFDE59] fill-[#FFDE59]" />
                  <span className="font-bold text-gray-900 text-sm">
                    {course.rating}
                  </span>
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FFDE59] to-[#ffd633] text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  ${course.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#01BC63] transition-colors duration-300">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#01BC63] to-[#FFDE59] flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 font-medium">
                    {course.instructor}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#01BC63]" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#01BC63]" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                </div>

                {/* Enroll Button */}
                <Link
                  href={`/courses/${course.id}`}
                  className="group/btn block w-full text-center px-4 py-3 bg-gradient-to-r from-[#01BC63] to-[#00a855] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#01BC63]/30 transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    Enroll Now
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#01BC63] via-[#FFDE59] to-[#01BC63] opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10"></div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#01BC63] to-[#00a855] text-white rounded-xl font-semibold shadow-lg shadow-[#01BC63]/30 hover:shadow-xl hover:shadow-[#01BC63]/40 transition-all duration-300 hover:scale-105"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
