"use client";

import { useState } from "react";
import { adminApi, CreateApplicationDto } from "../api/admin.api";

interface CreatorApplicationFormProps {
  onSubmitted: (application: any) => void;
}

export default function CreatorApplicationForm({
  onSubmitted,
}: CreatorApplicationFormProps) {
  const [formData, setFormData] = useState<CreateApplicationDto>({
    motivation: "",
    experience: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.motivation.trim() || formData.motivation.trim().length < 50) {
        setError("Motivation must be at least 50 characters long");
        setIsLoading(false);
        return;
      }

      // Prepare data for submission - only include documents if they exist and are properly structured
      const submitData: CreateApplicationDto = {
        motivation: formData.motivation.trim(),
        ...(formData.experience && formData.experience.trim() && { 
          experience: formData.experience.trim() 
        }),
        // Only include documents if it's a valid object
        ...(formData.documents && typeof formData.documents === 'object' && !Array.isArray(formData.documents) && { 
          documents: formData.documents 
        }),
      };

      const application = await adminApi.submitCreatorApplication(submitData);
      onSubmitted(application);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Motivation */}
        <div>
          <label
            htmlFor="motivation"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Why do you want to become a creator? *
          </label>
          <textarea
            id="motivation"
            rows={5}
            value={formData.motivation}
            onChange={(e) =>
              setFormData({ ...formData, motivation: e.target.value })
            }
            placeholder="Tell us about your motivation to create courses and share your knowledge..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Minimum 50 characters
          </p>
        </div>

        {/* Experience */}
        <div>
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            What is your experience in agriculture/farming?
          </label>
          <textarea
            id="experience"
            rows={6}
            value={formData.experience}
            onChange={(e) =>
              setFormData({ ...formData, experience: e.target.value })
            }
            placeholder="Describe your background, experience, education, certifications, or any relevant achievements in agriculture or farming..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Optional. Minimum 50 characters if provided. Include your education, work experience, certifications, or achievements.
          </p>
        </div>

        {/* Documents (Optional for now) */}
        <div>
          <label
            htmlFor="documents"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Supporting Documents (Optional)
          </label>
          <input
            type="file"
            id="documents"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                // For now, we'll just store file names
                // In production, you'd upload these to storage first
                const fileNames = Array.from(files).map((f) => f.name);
                // Structure documents as an object as expected by backend
                setFormData({ 
                  ...formData, 
                  documents: {
                    other: fileNames
                  }
                });
              } else {
                // Remove documents if no files selected
                const { documents, ...rest } = formData;
                setFormData(rest);
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Upload certificates, portfolio, or any supporting documents (PDF, DOC, or images)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.motivation.trim() || formData.motivation.trim().length < 50}
          className="w-full bg-accent-yellow text-gray-800 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Submitting..." : "Submit Application"}
        </button>

        <p className="text-xs text-center text-gray-500">
          Your application will be reviewed by our team. You'll be notified once a decision is made.
        </p>
      </form>
    </div>
  );
}

