"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CreatorDashboardLayout from "@/components/layout/CreatorDashboardLayout";
import CreateCourseForm from "@/modules/creator/components/CreateCourseForm";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function CreateCoursePage() {
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Course</h1>
          <p className="text-gray-600">
            Fill in the details below to create your course. You can add lessons after creating the course.
          </p>
        </div>
        <CreateCourseForm />
      </div>
    </CreatorDashboardLayout>
  );
}

