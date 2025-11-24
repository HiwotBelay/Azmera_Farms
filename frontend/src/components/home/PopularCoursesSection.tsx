"use client"

import Link from "next/link"
import { Star, Clock, Users } from "lucide-react"

const courses = [
  {
    id: 1,
    title: "Modern Greenhouse Farming",
    description: "Learn advanced greenhouse techniques for year-round production",
    instructor: "Dr. Alemayehu Tadesse",
    rating: 4.9,
    reviews: 234,
    price: 49,
    duration: "8 weeks",
    lessons: 32,
    image: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=250&fit=crop",
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
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=250&fit=crop",
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
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    students: 1450,
  },
]

export default function PopularCoursesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Popular Courses</h2>
          <p className="text-lg text-gray-600">Top-rated courses from expert instructors</p>
          <Link
            href="/courses"
            className="inline-flex mt-6 px-6 py-3 bg-[#01BC63] text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
          >
            View All Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group relative rounded-2xl overflow-hidden bg-white border-2 border-gray-200 hover:border-[#01BC63] transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gray-200">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur px-3 py-2 rounded-full">
                  <Star className="w-4 h-4 text-[#FFDE59] fill-[#FFDE59]" />
                  <span className="font-bold text-gray-900">{course.rating}</span>
                </div>

                <div className="absolute top-4 right-4 bg-[#FFDE59] text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  ${course.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 text-center">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 text-center">{course.description}</p>

                <div className="flex items-center gap-2 mb-4 justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#01BC63] to-[#FFDE59]"></div>
                  <p className="text-sm text-gray-700">{course.instructor}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200 justify-center">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students} students</span>
                  </div>
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="block w-full text-center px-4 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-[#01BC63] hover:shadow-lg transition-all duration-300"
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
            className="inline-flex px-8 py-3 bg-[#01BC63] text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  )
}
