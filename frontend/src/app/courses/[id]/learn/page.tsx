"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseLearning from "@/modules/courses/components/CourseLearning";
import { useAuth } from "@/modules/auth/hooks/useAuth";

interface CourseLearnPageProps {
  params: {
    id: string;
  };
}

function CourseLearnContent({ courseId }: { courseId: string }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-500">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <CourseLearning courseId={courseId} />
      </main>
      <Footer />
    </div>
  );
}

export default function CourseLearnPage({ params }: CourseLearnPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-500">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <CourseLearnContent courseId={params.id} />
    </Suspense>
  );
}

