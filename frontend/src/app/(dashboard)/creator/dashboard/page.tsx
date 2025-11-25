"use client";

import { useState } from "react";
import CreatorDashboardLayout from "@/components/layout/CreatorDashboardLayout";
import {
  BookOpen,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Clock,
  Plus,
  FileText,
  BarChart3,
  Star,
  MessageSquare,
  Target,
  Award,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Calendar,
  TrendingDown,
  Percent,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function CreatorDashboardPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">(
    "30d"
  );

  // Enhanced KPI Stats
  const kpiStats = [
    {
      title: "Total Revenue",
      value: "ETB 156,800",
      change: "+18.5%",
      changeType: "increase" as const,
      period: "vs last month",
      icon: DollarSign,
      color: "bg-[#FFDE59]",
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Students",
      value: "2,456",
      change: "+234",
      changeType: "increase" as const,
      period: "new this month",
      icon: Users,
      color: "bg-blue-500",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Course Completion Rate",
      value: "68%",
      change: "+5.2%",
      changeType: "increase" as const,
      period: "vs last month",
      icon: Target,
      color: "bg-[#01BC63]",
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2",
      changeType: "increase" as const,
      period: "from 4.6",
      icon: Star,
      color: "bg-purple-500",
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  // Revenue Breakdown
  const revenueBreakdown = [
    {
      period: "This Month",
      amount: "ETB 45,600",
      change: "+12.3%",
      trend: "up",
    },
    {
      period: "Last Month",
      amount: "ETB 40,600",
      change: "+8.1%",
      trend: "up",
    },
    {
      period: "This Year",
      amount: "ETB 156,800",
      change: "+18.5%",
      trend: "up",
    },
    { period: "All Time", amount: "ETB 489,200", change: null, trend: null },
  ];

  // Top Performing Courses
  const topCourses = [
    {
      id: 1,
      title: "Modern Crop Production Techniques",
      students: 456,
      revenue: "ETB 28,900",
      rating: 4.9,
      completion: 72,
      trend: "up",
    },
    {
      id: 2,
      title: "Sustainable Farming Practices",
      students: 389,
      revenue: "ETB 24,500",
      rating: 4.8,
      completion: 68,
      trend: "up",
    },
    {
      id: 3,
      title: "Livestock Management Basics",
      students: 234,
      revenue: "ETB 15,200",
      rating: 4.7,
      completion: 65,
      trend: "down",
    },
  ];

  // Recent Reviews
  const recentReviews = [
    {
      id: 1,
      course: "Modern Crop Production Techniques",
      student: "Ahmed Mohammed",
      rating: 5,
      comment: "Excellent course! Very practical and well-structured.",
      date: "2 days ago",
    },
    {
      id: 2,
      course: "Sustainable Farming Practices",
      student: "Sara Bekele",
      rating: 5,
      comment: "Learned so much. The instructor explains everything clearly.",
      date: "5 days ago",
    },
    {
      id: 3,
      course: "Livestock Management Basics",
      student: "Michael Tesfaye",
      rating: 4,
      comment: "Good content, but could use more examples.",
      date: "1 week ago",
    },
  ];

  // Course Health Indicators
  const courseHealth = [
    {
      course: "Modern Crop Production Techniques",
      status: "healthy",
      students: 456,
      completion: 72,
      rating: 4.9,
      issues: [],
    },
    {
      course: "Sustainable Farming Practices",
      status: "healthy",
      students: 389,
      completion: 68,
      rating: 4.8,
      issues: [],
    },
    {
      course: "Livestock Management Basics",
      status: "needs_attention",
      students: 234,
      completion: 45,
      rating: 4.2,
      issues: ["Low completion rate", "Some negative feedback"],
    },
  ];

  // Quick Insights
  const insights = [
    {
      type: "success",
      message:
        "Your course 'Modern Crop Production' is trending! +23% enrollments this week.",
      icon: TrendingUp,
    },
    {
      type: "warning",
      message:
        "3 students need help with 'Livestock Management Basics'. Consider adding resources.",
      icon: AlertCircle,
    },
    {
      type: "info",
      message:
        "You're 85% complete on your new course. Finish it to start earning!",
      icon: Target,
    },
  ];

  // Student Engagement Metrics
  const engagementMetrics = [
    { label: "Active Students", value: "1,234", change: "+156", trend: "up" },
    { label: "Course Views", value: "8,923", change: "+1,234", trend: "up" },
    {
      label: "Avg. Watch Time",
      value: "42 min",
      change: "+5 min",
      trend: "up",
    },
    { label: "Discussion Posts", value: "234", change: "+45", trend: "up" },
  ];

  return (
    <CreatorDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header with Time Range Selector */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Instructor Dashboard
            </h1>
            <p className="text-gray-600">
              Track your performance and grow your teaching business
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
              {(["7d", "30d", "90d", "all"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? "bg-[#01BC63] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {range === "7d"
                    ? "7 Days"
                    : range === "30d"
                    ? "30 Days"
                    : range === "90d"
                    ? "90 Days"
                    : "All Time"}
                </button>
              ))}
            </div>
            <Link
              href="/creator/courses/create"
              className="flex items-center gap-2 px-6 py-3 bg-[#01BC63] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Course
            </Link>
          </div>
        </div>

        {/* Quick Insights Banner */}
        <div className="space-y-2">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-lg border ${
                  insight.type === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : insight.type === "warning"
                    ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                    : "bg-blue-50 border-blue-200 text-blue-800"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{insight.message}</p>
              </div>
            );
          })}
        </div>

        {/* Enhanced KPI Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  {stat.changeType === "increase" ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {stat.change}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <ArrowDownRight className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {stat.change}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.period}</p>
              </div>
            );
          })}
        </div>

        {/* Revenue Breakdown & Engagement Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Revenue Overview
              </h2>
              <Link
                href="/creator/revenue"
                className="text-[#01BC63] hover:underline text-sm font-medium"
              >
                View Details
              </Link>
            </div>
            <div className="space-y-4">
              {revenueBreakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{item.period}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {item.amount}
                    </p>
                  </div>
                  {item.change && (
                    <div
                      className={`flex items-center gap-1 ${
                        item.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span className="text-sm font-semibold">
                        {item.change}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Student Engagement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Student Engagement
              </h2>
              <Link
                href="/creator/analytics"
                className="text-[#01BC63] hover:underline text-sm font-medium"
              >
                View Analytics
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {engagementMetrics.map((metric, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </p>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUpRight className="w-3 h-3" />
                    <span className="text-xs font-medium">{metric.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Top Performing Courses
              </h2>
              <Link
                href="/creator/courses"
                className="text-[#01BC63] hover:underline font-medium text-sm"
              >
                View All Courses
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#01BC63] transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {course.rating}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Students</p>
                        <p className="font-semibold text-gray-900">
                          {course.students}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Revenue</p>
                        <p className="font-semibold text-gray-900">
                          {course.revenue}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Completion</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#01BC63] h-2 rounded-full"
                              style={{ width: `${course.completion}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            {course.completion}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {course.trend === "up" ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <TrendingDown className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Health & Recent Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Course Health</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {courseHealth.map((course, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {course.course}
                      </h3>
                      {course.status === "healthy" ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Healthy</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">
                            Needs Attention
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-gray-600">Students</p>
                        <p className="font-semibold text-gray-900">
                          {course.students}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Completion</p>
                        <p className="font-semibold text-gray-900">
                          {course.completion}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Rating</p>
                        <p className="font-semibold text-gray-900">
                          {course.rating}
                        </p>
                      </div>
                    </div>
                    {course.issues.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-yellow-600 font-medium mb-1">
                          Issues:
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {course.issues.map((issue, i) => (
                            <li key={i}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Reviews
                </h2>
                <Link
                  href="/creator/reviews"
                  className="text-[#01BC63] hover:underline font-medium text-sm"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {review.student}
                        </p>
                        <p className="text-xs text-gray-600">{review.course}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {review.comment}
                    </p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/creator/courses"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-[#01BC63] group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#01BC63]/10 p-4 rounded-lg mb-3 group-hover:bg-[#01BC63] transition-colors">
                <FileText className="w-6 h-6 text-[#01BC63] group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Manage Courses
              </h3>
              <p className="text-xs text-gray-600">Edit and organize</p>
            </div>
          </Link>

          <Link
            href="/creator/analytics"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-[#01BC63] group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-lg mb-3 group-hover:bg-blue-500 transition-colors">
                <BarChart3 className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
              <p className="text-xs text-gray-600">View insights</p>
            </div>
          </Link>

          <Link
            href="/creator/students"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-[#01BC63] group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-lg mb-3 group-hover:bg-purple-500 transition-colors">
                <Users className="w-6 h-6 text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">My Students</h3>
              <p className="text-xs text-gray-600">Engage learners</p>
            </div>
          </Link>

          <Link
            href="/creator/revenue"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-[#01BC63] group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-yellow-100 p-4 rounded-lg mb-3 group-hover:bg-yellow-500 transition-colors">
                <DollarSign className="w-6 h-6 text-yellow-600 group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Revenue</h3>
              <p className="text-xs text-gray-600">Track earnings</p>
            </div>
          </Link>
        </div>
      </div>
    </CreatorDashboardLayout>
  );
}
