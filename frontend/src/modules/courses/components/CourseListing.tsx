"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Star, Clock } from "lucide-react";
import CourseCard from "./CourseCard";
import { coursesApi, Course } from "../api/courses.api";

export default function CourseListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await coursesApi.getAll({
          search: searchQuery || undefined,
          limit: 20,
          page: 0,
        });
        setCourses(response.courses);
        setTotal(response.total);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCourses();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

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

      {/* Results Count */}
      {!loading && (
        <div className="mb-4 text-sm text-gray-600">
          {total} {total === 1 ? 'course' : 'courses'} found
        </div>
      )}

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-600 mb-4">No courses found.</p>
          {searchQuery && (
            <p className="text-sm text-gray-500">Try adjusting your search terms.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
