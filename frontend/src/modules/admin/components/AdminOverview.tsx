"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, UserCheck, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { adminApi } from "../api/admin.api";
import { coursesApi } from "../../courses/api/courses.api";
import Link from "next/link";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCreators: 0,
    totalCourses: 0,
    pendingCourses: 0,
    publishedCourses: 0,
    totalEnrollments: 0,
    pendingApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch stats from admin API
        const platformStats = await adminApi.getStats();
        
        setStats({
          totalUsers: platformStats.users.total,
          totalCreators: platformStats.users.creators,
          totalCourses: platformStats.courses.total,
          pendingCourses: platformStats.courses.pending,
          publishedCourses: platformStats.courses.published,
          totalEnrollments: platformStats.enrollments.total,
          pendingApplications: platformStats.applications.pending,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        // Fallback to course-based stats if admin API fails
        try {
          const allCourses = await coursesApi.getAll({ limit: 1000 });
          const courses = allCourses.courses;
          const applications = await adminApi.getAllApplications();
          
          setStats({
            totalUsers: 0,
            totalCreators: 0,
            totalCourses: courses.length,
            pendingCourses: courses.filter(c => c.status === 'PENDING').length,
            publishedCourses: courses.filter(c => c.status === 'PUBLISHED').length,
            totalEnrollments: courses.reduce((sum, c) => sum + (c.studentsCount || 0), 0),
            pendingApplications: applications.filter(a => a.status === 'PENDING').length,
          });
        } catch (fallbackError) {
          console.error('Error fetching fallback stats:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      id: 1,
      label: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "bg-blue-500",
      href: "/admin/users",
    },
    {
      id: 2,
      label: "Total Creators",
      value: stats.totalCreators.toString(),
      icon: UserCheck,
      color: "bg-purple-500",
      href: "/admin/users?role=CREATOR",
    },
    {
      id: 3,
      label: "Total Courses",
      value: stats.totalCourses.toString(),
      icon: BookOpen,
      color: "bg-green-500",
      href: "/admin/courses",
    },
    {
      id: 4,
      label: "Pending Reviews",
      value: stats.pendingCourses.toString(),
      icon: Clock,
      color: "bg-yellow-500",
      href: "/admin/courses?status=PENDING",
    },
    {
      id: 5,
      label: "Published Courses",
      value: stats.publishedCourses.toString(),
      icon: CheckCircle,
      color: "bg-green-600",
      href: "/admin/courses?status=PUBLISHED",
    },
    {
      id: 6,
      label: "Total Enrollments",
      value: stats.totalEnrollments.toString(),
      icon: TrendingUp,
      color: "bg-indigo-500",
      href: "/admin/analytics",
    },
    {
      id: 7,
      label: "Pending Applications",
      value: stats.pendingApplications.toString(),
      icon: Clock,
      color: "bg-orange-500",
      href: "/admin/applications?status=PENDING",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Link
            key={stat.id}
            href={stat.href}
            className={`${stat.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-8 h-8" />
            </div>
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-white/90 text-sm">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/courses?status=PENDING"
            className="p-4 border-2 border-yellow-300 rounded-lg hover:bg-yellow-50 transition"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-gray-800">Review Pending Courses</p>
                <p className="text-sm text-gray-600">{stats.pendingCourses} courses waiting</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/applications?status=PENDING"
            className="p-4 border-2 border-orange-300 rounded-lg hover:bg-orange-50 transition"
          >
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-orange-600" />
              <div>
                <p className="font-semibold text-gray-800">Review Applications</p>
                <p className="text-sm text-gray-600">{stats.pendingApplications} applications waiting</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/users"
            className="p-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition"
          >
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">Manage Users</p>
                <p className="text-sm text-gray-600">View and edit all users</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

