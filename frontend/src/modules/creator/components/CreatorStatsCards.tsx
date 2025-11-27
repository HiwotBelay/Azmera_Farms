"use client";

import { useEffect, useState } from "react";
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react";
import { coursesApi } from "../../courses/api/courses.api";

export default function CreatorStatsCards() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const myCourses = await coursesApi.getMyCourses();
        
        const publishedCourses = myCourses.filter(c => c.status === 'PUBLISHED');
        const totalStudents = myCourses.reduce((sum, course) => sum + (course.studentsCount || 0), 0);
        // Calculate revenue (for now, estimate based on students * average price)
        const totalRevenue = publishedCourses.reduce((sum, course) => {
          return sum + ((course.studentsCount || 0) * (course.price || 0));
        }, 0);

        setStats({
          totalCourses: myCourses.length,
          publishedCourses: publishedCourses.length,
          totalStudents,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching creator stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      id: 1,
      label: "Total Courses",
      value: stats.totalCourses.toString(),
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      id: 2,
      label: "Published",
      value: stats.publishedCourses.toString(),
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      id: 3,
      label: "Total Students",
      value: stats.totalStudents.toString(),
      icon: Users,
      color: "bg-purple-500",
    },
    {
      id: 4,
      label: "Estimated Revenue",
      value: `ETB ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-yellow-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-xl p-6 animate-pulse">
            <div className="h-8 w-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 w-16 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <div
          key={stat.id}
          className={`${stat.color} rounded-xl p-6 text-white shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <stat.icon className="w-8 h-8" />
          </div>
          <p className="text-3xl font-bold mb-1">{stat.value}</p>
          <p className="text-white/90 text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

