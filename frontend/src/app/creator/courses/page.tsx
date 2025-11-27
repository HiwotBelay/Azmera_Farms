"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CreatorDashboardLayout from "@/components/layout/CreatorDashboardLayout";
import MyCoursesManagement from "@/modules/creator/components/MyCoursesManagement";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function CreatorCoursesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (!authLoading && user && user.role !== 'CREATOR' && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <CreatorDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading...</div>
        </div>
      </CreatorDashboardLayout>
    );
  }

  if (!user || (user.role !== 'CREATOR' && user.role !== 'ADMIN')) {
    return null;
  }

  return (
    <CreatorDashboardLayout>
      <MyCoursesManagement />
    </CreatorDashboardLayout>
  );
}

