"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCards from "@/modules/profile/components/StatsCards";
import ContinueLearning from "@/modules/courses/components/ContinueLearning";
import WeeklyActivityChart from "@/modules/profile/components/WeeklyActivityChart";
import CourseCompletionChart from "@/modules/profile/components/CourseCompletionChart";
import RecommendedCourses from "@/modules/courses/components/RecommendedCourses";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    // Redirect creators to their dashboard
    if (!authLoading && user && (user.role === 'CREATOR' || user.role === 'ADMIN')) {
      router.push('/creator/dashboard');
      return;
    }
  }, [user, authLoading, router]);

  if (!mounted || authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.firstName || user.email.split('@')[0];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and achieve your goals
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Continue Learning */}
        <ContinueLearning />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyActivityChart />
          <CourseCompletionChart />
        </div>

        {/* Recommended Courses */}
        <RecommendedCourses />
      </div>
    </DashboardLayout>
  );
}



