"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Clock, CheckCircle, Lock } from "lucide-react";
import { coursesApi, Course, Lesson } from "../api/courses.api";
import { useAuth } from "../../auth/hooks/useAuth";

interface CourseDetailProps {
  courseId: string;
}

export default function CourseDetail({ courseId }: CourseDetailProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [courseData, lessonsData] = await Promise.all([
          coursesApi.getById(courseId),
          coursesApi.getCourseLessons(courseId).catch(() => []),
        ]);

        setCourse(courseData);
        setLessons(lessonsData);
        
        // Check if user is enrolled
        if (isAuthenticated && user) {
          try {
            const myCourses = await coursesApi.getMyCourses();
            setIsEnrolled(myCourses.some(c => c.id === courseId));
          } catch {
            setIsEnrolled(false);
          }
        }
      } catch (error: any) {
        console.error('Error fetching course:', error);
        if (error.response?.status === 404) {
          router.push('/courses');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, isAuthenticated, user, router]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      setEnrolling(true);
      await coursesApi.enroll(courseId);
      setIsEnrolled(true);
      router.push(`/courses/${courseId}/learn`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const formatPrice = (price: number, isFree: boolean): string => {
    if (isFree) return 'Free';
    return `ETB ${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-64 lg:h-96 bg-gray-200 rounded-xl mb-6"></div>
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <p className="text-gray-600">Course not found</p>
      </div>
    );
  }

  const instructorName = course.creator
    ? `${course.creator.firstName || ''} ${course.creator.lastName || ''}`.trim() || course.creator.email
    : 'Unknown Instructor';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <img
            src={course.thumbnail || "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=800&h=400&fit=crop"}
            alt={course.title}
            className="w-full h-64 lg:h-96 object-cover rounded-xl mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-full mr-2 flex items-center justify-center text-white font-bold">
                {instructorName[0].toUpperCase()}
              </div>
              <span className="text-gray-700">{instructorName}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-semibold">{course.rating.toFixed(1)}</span>
              <span className="text-gray-500 ml-1">({course.reviewsCount} reviews)</span>
            </div>
          </div>
          <p className="text-gray-600 mb-6">{course.description}</p>

          {/* Course Curriculum */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Course Curriculum</h2>
            {lessons.length === 0 ? (
              <p className="text-gray-500">No lessons available yet.</p>
            ) : (
              <div className="space-y-2">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      isEnrolled ? "bg-gray-50 border-gray-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      {isEnrolled ? (
                        <CheckCircle className="w-5 h-5 text-gray-400 mr-3" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400 mr-3" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{lesson.title}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{lesson.duration ? formatDuration(lesson.duration) : 'N/A'}</span>
                          <span className="mx-2">•</span>
                          <span className="capitalize">{lesson.type.toLowerCase()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <div className="mb-6">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(course.price, course.isFree)}
              </span>
              {course.isFree && (
                <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Free
                </span>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Level:</span>
                <span className="font-semibold capitalize">{course.level.toLowerCase()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Lessons:</span>
                <span className="font-semibold">{course.lessonsCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Students:</span>
                <span className="font-semibold">{course.studentsCount}</span>
              </div>
              {course.language && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-semibold uppercase">{course.language}</span>
                </div>
              )}
            </div>

            {isEnrolled ? (
              <button
                onClick={() => router.push(`/courses/${courseId}/learn`)}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Continue Learning
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling || !isAuthenticated}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrolling ? 'Enrolling...' : course.isFree ? 'Enroll Free' : 'Enroll Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
