"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, BookOpen, CheckCircle, Lock, ArrowLeft, Clock } from "lucide-react";
import { coursesApi, Course, Lesson } from "../api/courses.api";
import { useAuth } from "../../auth/hooks/useAuth";

interface CourseLearningProps {
  courseId: string;
}

export default function CourseLearning({ courseId }: CourseLearningProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [courseData, lessonsData] = await Promise.all([
          coursesApi.getById(courseId),
          coursesApi.getCourseLessons(courseId).catch(() => []),
        ]);

        setCourse(courseData);
        setLessons(lessonsData.sort((a, b) => a.order - b.order));
        
        // Set first lesson as selected if available
        if (lessonsData.length > 0) {
          setSelectedLesson(lessonsData.sort((a, b) => a.order - b.order)[0]);
        }

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
      await coursesApi.enroll(courseId);
      setIsEnrolled(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to enroll in course');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Course not found</p>
          <button
            onClick={() => router.push('/courses')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // Check if user needs to enroll
  if (!isEnrolled && course.status === 'PUBLISHED') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          <button
            onClick={handleEnroll}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-semibold"
          >
            Enroll in Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar - Lessons List */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => router.push(`/courses/${courseId}`)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </button>
          <h2 className="text-lg font-bold text-gray-800 line-clamp-2">{course.title}</h2>
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Course Content</h3>
          <div className="space-y-1">
            {lessons.map((lesson, index) => {
              const isSelected = selectedLesson?.id === lesson.id;
              const isCompleted = false; // TODO: Implement completion tracking
              
              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 mt-1 ${
                      isSelected ? 'text-white' : 'text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${
                          isSelected ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          Lesson {index + 1}
                        </span>
                        {lesson.isPreview && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            isSelected 
                              ? 'bg-white/20 text-white' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            Preview
                          </span>
                        )}
                      </div>
                      <p className={`text-sm font-medium line-clamp-2 ${
                        isSelected ? 'text-white' : 'text-gray-800'
                      }`}>
                        {lesson.title}
                      </p>
                      {lesson.duration && (
                        <div className={`flex items-center gap-1 mt-1 text-xs ${
                          isSelected ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(lesson.duration)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Lesson Player */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedLesson ? (
          <>
            {/* Lesson Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedLesson.title}</h1>
                  {selectedLesson.description && (
                    <p className="text-gray-600">{selectedLesson.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {selectedLesson.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(selectedLesson.duration)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Lesson {lessons.findIndex(l => l.id === selectedLesson.id) + 1} of {lessons.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                {selectedLesson.type === 'VIDEO' || selectedLesson.type === 'BOTH' ? (
                  <div className="mb-6">
                    <div className="bg-black rounded-lg overflow-hidden aspect-video mb-4">
                      {selectedLesson.videoUrl ? (
                        <video
                          controls
                          className="w-full h-full"
                          src={selectedLesson.videoUrl}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <div className="text-center">
                            <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Video URL not available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {selectedLesson.type === 'PDF' || selectedLesson.type === 'BOTH' ? (
                  <div className="mb-6">
                    {selectedLesson.pdfUrl ? (
                      <iframe
                        src={selectedLesson.pdfUrl}
                        className="w-full h-[600px] border border-gray-300 rounded-lg"
                        title={selectedLesson.title}
                      />
                    ) : (
                      <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">PDF URL not available</p>
                      </div>
                    )}
                  </div>
                ) : null}

                {!selectedLesson.videoUrl && !selectedLesson.pdfUrl && (
                  <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Lesson content is not available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a lesson to start learning</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

