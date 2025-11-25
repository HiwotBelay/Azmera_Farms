"use client";

import { useState } from "react";
import { Star, Clock, CheckCircle, Lock } from "lucide-react";

interface CourseDetailProps {
  courseId: string;
}

export default function CourseDetail({ courseId }: CourseDetailProps) {
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Mock course data
  const course = {
    id: parseInt(courseId),
    title: "Modern Greenhouse Farming",
    description: "Learn advanced greenhouse techniques for year-round production of vegetables and herbs. This comprehensive course covers everything from setup to harvest.",
    instructor: "Dr. Alemayehu Tadesse",
    rating: 4.9,
    reviews: 234,
    price: 49,
    isFree: false,
    duration: "8 weeks",
    lessons: 32,
    category: "Crop Production",
    level: "Intermediate",
    language: "English",
    image: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=800&h=400&fit=crop",
    whatYoullLearn: [
      "Greenhouse design and setup",
      "Climate control systems",
      "Crop selection and rotation",
      "Pest and disease management",
      "Harvesting and post-harvest handling",
    ],
    requirements: [
      "Basic understanding of agriculture",
      "Access to a greenhouse (optional)",
    ],
  };

  const lessons = [
    { id: 1, title: "Introduction to Greenhouse Farming", duration: "15 min", type: "video", completed: true },
    { id: 2, title: "Greenhouse Design Principles", duration: "20 min", type: "video", completed: true },
    { id: 3, title: "Climate Control Systems", duration: "25 min", type: "video", completed: false },
    { id: 4, title: "Crop Selection Guide", duration: "18 min", type: "pdf", completed: false },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-64 lg:h-96 object-cover rounded-xl mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-gray-700">{course.instructor}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-semibold">{course.rating}</span>
              <span className="text-gray-500 ml-1">({course.reviews} reviews)</span>
            </div>
          </div>
          <p className="text-gray-600 mb-6">{course.description}</p>

          {/* What You'll Learn */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">What you&apos;ll learn</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {course.whatYoullLearn.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Course Curriculum */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Course Curriculum</h2>
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    lesson.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    {lesson.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    ) : isEnrolled ? (
                      <Lock className="w-5 h-5 text-gray-400 mr-3" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400 mr-3" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{lesson.title}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{lesson.duration}</span>
                        <span className="mx-2">•</span>
                        <span className="capitalize">{lesson.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Requirements</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {course.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <div className="mb-6">
              <span className="text-3xl font-bold text-primary">
                ${course.price}
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
                <span className="font-semibold">{course.level}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">{course.duration}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Lessons:</span>
                <span className="font-semibold">{course.lessons}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Language:</span>
                <span className="font-semibold">{course.language}</span>
              </div>
            </div>

            {isEnrolled ? (
              <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition">
                Continue Learning
              </button>
            ) : (
              <button
                onClick={() => setIsEnrolled(true)}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Enroll Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

