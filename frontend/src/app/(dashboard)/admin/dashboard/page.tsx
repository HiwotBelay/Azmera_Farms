"use client";

import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import {
  Users,
  BookOpen,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  // Mock data - replace with API calls
  const stats = [
    {
      title: "Total Users",
      value: "12,456",
      change: "+234 this month",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Courses",
      value: "456",
      change: "+23 this month",
      icon: BookOpen,
      color: "bg-[#01BC63]",
    },
    {
      title: "Content Creators",
      value: "89",
      change: "+5 this month",
      icon: Shield,
      color: "bg-purple-500",
    },
    {
      title: "Platform Revenue",
      value: "ETB 1.2M",
      change: "+18% this month",
      icon: DollarSign,
      color: "bg-[#FFDE59]",
    },
  ];

  const pendingActions = [
    {
      id: 1,
      type: "Course Review",
      title: "Modern Crop Production Techniques",
      creator: "John Doe",
      date: "2 hours ago",
      priority: "high",
    },
    {
      id: 2,
      type: "Creator Verification",
      title: "New creator application",
      creator: "Jane Smith",
      date: "5 hours ago",
      priority: "medium",
    },
    {
      id: 3,
      type: "User Report",
      title: "Inappropriate content report",
      creator: "System",
      date: "1 day ago",
      priority: "high",
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Ahmed Mohammed",
      email: "ahmed@example.com",
      role: "LEARNER",
      status: "Active",
      joined: "2 days ago",
    },
    {
      id: 2,
      name: "Sara Bekele",
      email: "sara@example.com",
      role: "CREATOR",
      status: "Pending",
      joined: "3 days ago",
    },
    {
      id: 3,
      name: "Michael Tesfaye",
      email: "michael@example.com",
      role: "LEARNER",
      status: "Active",
      joined: "5 days ago",
    },
  ];

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage platform, users, and content moderation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xs text-[#01BC63] font-medium">
                  {stat.change}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link
            href="/admin/users"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-blue-500 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-lg mb-3 group-hover:bg-blue-500 transition-colors">
                <Users className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage all users</p>
            </div>
          </Link>

          <Link
            href="/admin/courses"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-[#01BC63] group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-lg mb-3 group-hover:bg-[#01BC63] transition-colors">
                <BookOpen className="w-6 h-6 text-green-600 group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Course Moderation
              </h3>
              <p className="text-sm text-gray-600">
                Review and approve courses
              </p>
            </div>
          </Link>

          <Link
            href="/admin/analytics"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-purple-500 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-lg mb-3 group-hover:bg-purple-500 transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Platform Analytics
              </h3>
              <p className="text-sm text-gray-600">View platform insights</p>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-gray-500 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 p-4 rounded-lg mb-3 group-hover:bg-gray-500 transition-colors">
                <Settings className="w-6 h-6 text-gray-600 group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                System Settings
              </h3>
              <p className="text-sm text-gray-600">Configure platform</p>
            </div>
          </Link>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Pending Actions
              </h2>
              <Link
                href="/admin/moderation"
                className="text-[#01BC63] hover:underline font-medium text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#01BC63] transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-3 rounded-lg ${
                        action.priority === "high"
                          ? "bg-red-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      <AlertCircle
                        className={`w-5 h-5 ${
                          action.priority === "high"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {action.type}
                        </span>
                        {action.priority === "high" && (
                          <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                            High Priority
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {action.creator} • {action.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#01BC63] rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {user.name}
                        </h3>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {user.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.joined}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/admin/users"
                className="block text-center mt-4 text-[#01BC63] hover:underline font-medium text-sm"
              >
                View All Users
              </Link>
            </div>
          </div>

          {/* Platform Overview Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Platform Overview
            </h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Chart visualization will be implemented here
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
