"use client";

import { useEffect, useState } from "react";
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react";
import { usersApi } from "../../users/api/users.api";

export default function StatsCards() {
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    learningTime: 0,
    certificatesEarned: 0,
    avgProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStats = await usersApi.getUserStats();
        const progress = await usersApi.getAllUserProgress();

        setStats({
          enrolledCourses: progress.totalCourses || 0,
          learningTime: userStats.totalStudyTime || 0,
          certificatesEarned: userStats.certificatesEarned || 0,
          avgProgress: progress.totalCourses > 0
            ? Math.round(
                (progress.completedCourses / progress.totalCourses) * 100
              )
            : 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const statsData = [
    {
      id: 1,
      label: "Enrolled Courses",
      value: stats.enrolledCourses.toString(),
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      id: 2,
      label: "Learning Time",
      value: formatTime(stats.learningTime),
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      id: 3,
      label: "Certificates Earned",
      value: stats.certificatesEarned.toString(),
      icon: Award,
      color: "bg-green-500",
    },
    {
      id: 4,
      label: "Avg. Progress",
      value: `${stats.avgProgress}%`,
      icon: TrendingUp,
      color: "bg-yellow-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-xl p-6 animate-pulse">
            <div className="h-8 w-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 w-16 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <div
          key={stat.id}
          className={`${stat.color} rounded-xl p-6 text-white shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <stat.icon className="w-8 h-8" />
          </div>
          <p className="text-3xl font-bold mb-1">{stat.value}</p>
          <p className="text-white/90 text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
