"use client";

import { Star } from "lucide-react";
import { Review } from "../api/reviews.api";

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No reviews yet. Be the first to review this course!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#01BC63] rounded-full flex items-center justify-center text-white font-semibold">
                  {review.user?.firstName?.[0] ||
                    review.user?.email?.[0] ||
                    "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.user?.firstName && review.user?.lastName
                      ? `${review.user.firstName} ${review.user.lastName}`
                      : review.user?.email || "Anonymous"}
                  </p>
                  {review.isVerified && (
                    <span className="text-xs text-[#01BC63] font-medium">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {review.rating}.0
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
