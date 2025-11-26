"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { lessonsApi, CreateLessonDto } from "../../courses/api/lessons.api";

interface CreateLessonFormProps {
  courseId: string;
  courseTitle: string;
}

export default function CreateLessonForm({ courseId, courseTitle }: CreateLessonFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateLessonDto>({
    title: "",
    description: "",
    type: "VIDEO",
    videoUrl: "",
    pdfUrl: "",
    duration: 0,
    isPreview: false,
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate that at least videoUrl or pdfUrl is provided based on type
      if (formData.type === 'VIDEO' && !formData.videoUrl?.trim()) {
        setError('Video URL is required for video lessons');
        setIsLoading(false);
        return;
      }
      if (formData.type === 'PDF' && !formData.pdfUrl?.trim()) {
        setError('PDF URL is required for PDF lessons');
        setIsLoading(false);
        return;
      }
      if (formData.type === 'BOTH' && (!formData.videoUrl?.trim() || !formData.pdfUrl?.trim())) {
        setError('Both Video URL and PDF URL are required for BOTH type lessons');
        setIsLoading(false);
        return;
      }

      const lesson = await lessonsApi.create(courseId, formData);
      router.push(`/creator/courses/${courseId}/edit`);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create lesson. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="mb-6">
        <Link
          href={`/creator/courses/${courseId}/edit`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Link>
        <h2 className="text-xl font-bold text-gray-800">New Lesson</h2>
        <p className="text-sm text-gray-600 mt-1">Course: {courseTitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Lesson Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Introduction to Greenhouse Farming"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            required
            minLength={3}
            maxLength={200}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what students will learn in this lesson..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            maxLength={2000}
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Lesson Type *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as "VIDEO" | "PDF" | "BOTH",
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            required
          >
            <option value="VIDEO">Video</option>
            <option value="PDF">PDF</option>
            <option value="BOTH">Both Video and PDF</option>
          </select>
        </div>

        {/* Video URL */}
        {(formData.type === 'VIDEO' || formData.type === 'BOTH') && (
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Video URL *
            </label>
            <input
              type="url"
              id="videoUrl"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://example.com/video.mp4 or HLS playlist URL"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required={formData.type === 'VIDEO' || formData.type === 'BOTH'}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter the URL to your video file or HLS playlist
            </p>
          </div>
        )}

        {/* PDF URL */}
        {(formData.type === 'PDF' || formData.type === 'BOTH') && (
          <div>
            <label htmlFor="pdfUrl" className="block text-sm font-medium text-gray-700 mb-2">
              PDF URL *
            </label>
            <input
              type="url"
              id="pdfUrl"
              value={formData.pdfUrl}
              onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
              placeholder="https://example.com/document.pdf"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required={formData.type === 'PDF' || formData.type === 'BOTH'}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter the URL to your PDF document
            </p>
          </div>
        )}

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            min="0"
            value={formData.duration || 0}
            onChange={(e) =>
              setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Optional. Duration in minutes (mainly for video lessons)
          </p>
        </div>

        {/* Preview Lesson */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isPreview}
              onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">
              Make this a preview lesson (students can view without enrollment)
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push(`/creator/courses/${courseId}/edit`)}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.title.trim()}
            className="flex-1 px-6 py-3 bg-accent-yellow text-gray-800 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Creating..." : "Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
}

