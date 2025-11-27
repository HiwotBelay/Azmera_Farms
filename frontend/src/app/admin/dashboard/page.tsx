"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import AdminOverview from "@/modules/admin/components/AdminOverview";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (!authLoading && user && user.role !== 'ADMIN') {
      // Redirect based on role
      if (user.role === 'CREATOR') {
        router.push('/creator/dashboard');
      } else {
        router.push('/dashboard');
      }
      return;
    }
  }, [user, authLoading, router]);

  if (!mounted || authLoading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  const userName = user.firstName || user.email.split('@')[0];

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {userName}!
          </h1>
          <p className="text-gray-600">
            Manage your platform, review courses, and oversee user activity
          </p>
        </div>

        {/* Overview/Statistics */}
        <AdminOverview />
      </div>
    </AdminDashboardLayout>
  );
}

