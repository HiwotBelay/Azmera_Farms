"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import AdminUserManagement from "@/modules/admin/components/AdminUserManagement";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (!authLoading && user && user.role !== 'ADMIN') {
      if (user.role === 'CREATOR') {
        router.push('/creator/dashboard');
      } else {
        router.push('/dashboard');
      }
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
      <AdminUserManagement />
    </AdminDashboardLayout>
  );
}

