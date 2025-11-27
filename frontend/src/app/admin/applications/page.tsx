"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import { useAuth } from "@/modules/auth/hooks/useAuth";
// Import the existing creator applications component or create a new admin one
// For now, we'll create a simple placeholder

export default function AdminApplicationsPage() {
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
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Creator Applications</h1>
          <p className="text-gray-600">Review and manage creator applications</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
          Creator applications management will be implemented here.
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

