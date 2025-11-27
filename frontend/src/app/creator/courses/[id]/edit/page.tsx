"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CreatorDashboardLayout from "@/components/layout/CreatorDashboardLayout";
import EditCourseForm from "@/modules/creator/components/EditCourseForm";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { coursesApi } from "@/modules/courses/api/courses.api";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const courseId = params?.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (!authLoading && user && user.role !== 'CREATOR' && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const courseData = await coursesApi.getById(courseId);
        // Check if user owns this course
        if (courseData.creatorId !== user?.id && user?.role !== 'ADMIN') {
          router.push('/creator/courses');
          return;
        }
        setCourse(courseData);
      } catch (error: any) {
        if (error.response?.status === 404) {
          router.push('/creator/courses');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && courseId) {
      fetchCourse();
    }
  }, [user, authLoading, courseId, router]);

  if (authLoading || loading) {
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

  if (!course) {
    return (
      <CreatorDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Course not found</div>
        </div>
      </CreatorDashboardLayout>
    );
  }

  return (
    <CreatorDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Course</h1>
          <p className="text-gray-600">
            Update your course details and manage lessons
          </p>
        </div>
        <EditCourseForm course={course} />
      </div>
    </CreatorDashboardLayout>
  );
}

