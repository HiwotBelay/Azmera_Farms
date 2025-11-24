import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCards from "@/modules/profile/components/StatsCards";
import ContinueLearning from "@/modules/courses/components/ContinueLearning";
import WeeklyActivityChart from "@/modules/profile/components/WeeklyActivityChart";
import CourseCompletionChart from "@/modules/profile/components/CourseCompletionChart";
import RecommendedCourses from "@/modules/courses/components/RecommendedCourses";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, John!
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and achieve your goals
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Continue Learning */}
        <ContinueLearning />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyActivityChart />
          <CourseCompletionChart />
        </div>

        {/* Recommended Courses */}
        <RecommendedCourses />
      </div>
    </DashboardLayout>
  );
}
