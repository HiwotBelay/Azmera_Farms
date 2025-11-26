"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import AdminCourseManagement from "@/modules/admin/components/AdminCourseManagement";
import { useAuth } from "@/modules/auth/hooks/useAuth";

function AdminCoursesContent() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (!authLoading && user && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading) {
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

  return (
    <AdminDashboardLayout>
      <AdminCourseManagement />
    </AdminDashboardLayout>
  );
}

export default function AdminCoursesPage() {
  return (
    <Suspense fallback={
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminDashboardLayout>
    }>
      <AdminCoursesContent />
    </Suspense>
  );
}

