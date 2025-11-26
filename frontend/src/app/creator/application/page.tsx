"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import CreatorApplicationForm from "@/modules/admin/components/CreatorApplicationForm";
import ApplicationStatus from "@/modules/admin/components/ApplicationStatus";
import Logo from "@/components/ui/Logo";
import { adminApi, CreatorApplication } from "@/modules/admin/api/admin.api";

export default function CreatorApplicationPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [application, setApplication] = useState<CreatorApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndApplication = async () => {
      if (!authLoading) {
        if (!isAuthenticated || !user) {
          router.push('/login');
          return;
        }

        if (user.role !== 'CREATOR') {
          router.push('/dashboard');
          return;
        }

        try {
          const existingApplication = await adminApi.getMyApplication();
          setApplication(existingApplication);
        } catch (error) {
          console.error('Error fetching application:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuthAndApplication();
  }, [authLoading, isAuthenticated, user, router]);

  const handleApplicationSubmitted = (newApplication: CreatorApplication) => {
    setApplication(newApplication);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'CREATOR') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Creator Application
            </h1>
            <p className="text-gray-600">
              {application
                ? "Your application status"
                : "Complete your application to become a course creator"}
            </p>
          </div>

          {/* Application Status or Form */}
          {application ? (
            <ApplicationStatus application={application} />
          ) : (
            <CreatorApplicationForm onSubmitted={handleApplicationSubmitted} />
          )}

          {/* Back to Dashboard Link */}
          <div className="mt-6 text-center">
            <Link
              href="/dashboard"
              className="text-primary hover:underline font-semibold"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

