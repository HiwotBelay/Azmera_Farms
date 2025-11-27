"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";
import { reviewsApi, CreateReviewDto } from "../api/reviews.api";

interface ReviewFormProps {
  courseId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ courseId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      alert("Please provide a rating and comment");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewsApi.create(courseId, { rating, comment: comment.trim() });
      setRating(0);
      setComment("");
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Write a Review
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition ${
                  star <= (hoverRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {rating} out of 5
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this course..."
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#01BC63] focus:outline-none"
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || rating === 0 || !comment.trim()}
        className="w-full px-6 py-3 bg-[#01BC63] text-white rounded-lg hover:bg-[#059669] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
