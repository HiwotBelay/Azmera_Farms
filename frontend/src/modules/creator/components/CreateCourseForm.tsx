"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { coursesApi, CreateCourseDto } from "../../courses/api/courses.api";

export default function CreateCourseForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCourseDto>({
    title: "",
    description: "",
    shortDescription: "",
    level: "BEGINNER",
    price: 0,
    isFree: true,
    language: "en",
    tags: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Prepare data - ensure all required fields are present
      const submitData: CreateCourseDto = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription?.trim() || undefined,
        level: formData.level || "BEGINNER",
        price: formData.isFree ? 0 : (formData.price || 0),
        isFree: formData.isFree,
        language: formData.language || "en",
        tags: formData.tags && formData.tags.length > 0 ? formData.tags : undefined,
      };

      const course = await coursesApi.create(submitData);
      
      // Redirect to edit page
      if (course && course.id) {
        router.push(`/creator/courses/${course.id}/edit`);
      } else {
        throw new Error('Course created but no ID returned');
      }
    } catch (err: any) {
      console.error('Course creation error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.message || 
                          "Failed to create course. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
    <div className="bg-white rounded-xl shadow-md p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

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
            placeholder="e.g., Modern Greenhouse Farming Techniques"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            required
            minLength={5}
            maxLength={200}
          />
          <p className="mt-1 text-xs text-gray-500">Minimum 5 characters, maximum 200 characters</p>
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
            placeholder="A brief one-line description of your course"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            maxLength={500}
          />
          <p className="mt-1 text-xs text-gray-500">Optional. Maximum 500 characters</p>
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
            placeholder="Provide a detailed description of what students will learn in this course..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            required
            minLength={50}
            maxLength={5000}
          />
          <p className="mt-1 text-xs text-gray-500">Minimum 50 characters</p>
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

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.title || !formData.description}
            className="flex-1 px-6 py-3 bg-accent-yellow text-gray-800 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}

