"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreatorDashboardLayout from "@/components/layout/CreatorDashboardLayout";
import CreatorStatsCards from "@/modules/creator/components/CreatorStatsCards";
import MyCoursesManagement from "@/modules/creator/components/MyCoursesManagement";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function CreatorDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (!authLoading && user && user.role !== 'CREATOR') {
      // Redirect based on role
      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
      return;
    }
  }, [user, authLoading, router]);

  if (!mounted || authLoading) {
    return (
      <CreatorDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading...</div>
        </div>
      </CreatorDashboardLayout>
    );
  }

  if (!user || user.role !== 'CREATOR') {
    return null;
  }

  const userName = user.firstName || user.email.split('@')[0];

  return (
    <CreatorDashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600">
            Manage your courses and grow your teaching business
          </p>
        </div>

        {/* Stats Cards */}
        <CreatorStatsCards />

        {/* My Courses Management */}
        <MyCoursesManagement />
      </div>
    </CreatorDashboardLayout>
  );
}

