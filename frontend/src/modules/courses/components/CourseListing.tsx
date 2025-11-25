"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Star, Clock } from "lucide-react";
import CourseCard from "./CourseCard";

// Mock data
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
    category: "Crop Production",
    level: "Intermediate",
    language: "English",
    image: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=250&fit=crop",
  },
  // Add more mock courses as needed
];

export default function CourseListing() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Courses</h1>
        <p className="text-gray-600">Discover courses to enhance your agricultural skills</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

