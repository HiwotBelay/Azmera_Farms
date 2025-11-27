"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Save, Send, ArrowLeft, Trash2 } from "lucide-react";
import { coursesApi, Course, CreateCourseDto, Lesson } from "../../courses/api/courses.api";
import { lessonsApi } from "../../courses/api/lessons.api";

interface EditCourseFormProps {
  course: Course;
}

export default function EditCourseForm({ course }: EditCourseFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCourseDto>({
    title: course.title,
    description: course.description,
    shortDescription: course.shortDescription || "",
    level: course.level,
    price: course.price,
    isFree: course.isFree,
    language: course.language || "en",
    tags: course.tags || [],
  });
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const fetchLessons = async () => {
    try {
      const courseLessons = await coursesApi.getCourseLessons(course.id);
      setLessons(courseLessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [course.id]);

  // Refresh lessons when page becomes visible (e.g., after returning from lesson creation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchLessons();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [course.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await coursesApi.update(course.id, formData);
      setSuccess("Course updated successfully!");
      setTimeout(() => {
        router.push('/creator/courses');
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update course. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!confirm('Are you sure you want to submit this course for review? You won\'t be able to edit it until it\'s reviewed.')) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await coursesApi.submitForReview(course.id);
      setSuccess("Course submitted for review successfully!");
      setTimeout(() => {
        router.push('/creator/courses');
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit course for review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      return;
    }

    try {
      await lessonsApi.delete(course.id, lessonId);
      await fetchLessons(); // Refresh lessons list
      setSuccess("Lesson deleted successfully!");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete lesson. Please try again."
      );
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Course Info Form */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Course Information</h2>
          <Link
            href="/creator/courses"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
              minLength={5}
              maxLength={200}
            />
          </div>

          {/* Short Description */}
          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <input
              type="text"
              id="shortDescription"
              value={formData.shortDescription || ""}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              maxLength={500}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Full Description *
            </label>
            <textarea
              id="description"
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              required
              minLength={50}
            />
          </div>

          {/* Level */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
              Course Level *
            </label>
            <select
              id="level"
              value={formData.level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  level: e.target.value as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={formData.isFree}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isFree: e.target.checked,
                      price: e.target.checked ? 0 : formData.price || 0,
                    })
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Free Course</span>
              </label>
            </div>
            {!formData.isFree && (
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (ETB) *
                </label>
                <input
                  type="number"
                  id="price"
                  min="0"
                  step="0.01"
                  value={formData.price || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required={!formData.isFree}
                />
              </div>
            )}
          </div>

          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Language *
            </label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            >
              <option value="en">English</option>
              <option value="am">Amharic</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag and press Enter"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Add
              </button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/creator/courses')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title || !formData.description}
              className="flex-1 px-6 py-3 bg-accent-yellow text-gray-800 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            {course.status === 'DRAFT' && (
              <button
                type="button"
                onClick={handleSubmitForReview}
                disabled={isSubmitting || lessons.length === 0}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                title={lessons.length === 0 ? "Add at least one lesson before submitting" : ""}
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lessons Section */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Lessons ({lessons.length})</h2>
          <Link
            href={`/creator/courses/${course.id}/lessons/create`}
            className="flex items-center gap-2 px-4 py-2 bg-accent-yellow text-gray-800 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            <PlusCircle className="w-5 h-5" />
            Add Lesson
          </Link>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No lessons added yet.</p>
            <Link
              href={`/creator/courses/${course.id}/lessons/create`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-yellow text-gray-800 rounded-lg font-semibold hover:bg-yellow-400 transition"
            >
              <PlusCircle className="w-5 h-5" />
              Add Your First Lesson
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                    <p className="text-sm text-gray-500">
                      {lesson.type} {lesson.duration ? `• ${lesson.duration} min` : ''}
                      {lesson.isPreview && (
                        <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                          Preview
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/creator/courses/${course.id}/lessons/${lesson.id}/edit`}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                    title="Delete Lesson"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

