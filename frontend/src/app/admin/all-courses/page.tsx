"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import AdminAllCourses from "@/modules/admin/components/AdminAllCourses";
import { useAuth } from "@/modules/auth/hooks/useAuth";

function AdminAllCoursesContent() {
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
      <AdminAllCourses />
    </AdminDashboardLayout>
  );
}

export default function AdminAllCoursesPage() {
  return (
    <Suspense fallback={
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminDashboardLayout>
    }>
      <AdminAllCoursesContent />
    </Suspense>
  );
}

