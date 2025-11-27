"use client";

import { Clock, Target, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Quiz } from "../api/quizzes.api";

interface QuizCardProps {
  quiz: Quiz;
  courseId: string;
  latestAttempt?: {
    score: number;
    percentage: number;
    passed: boolean;
  };
}

export default function QuizCard({
  quiz,
  courseId,
  latestAttempt,
}: QuizCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {quiz.title}
          </h3>
          {quiz.description && (
            <p className="text-sm text-gray-600 mb-4">{quiz.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{quiz.timeLimit} min</span>
        </div>
        <div className="flex items-center gap-1">
          <Target className="w-4 h-4" />
          <span>{quiz.passingScore}% to pass</span>
        </div>
      </div>

      {latestAttempt && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Latest Score:</span>
            <div className="flex items-center gap-2">
              {latestAttempt.passed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span
                className={`font-semibold ${
                  latestAttempt.passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {latestAttempt.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      <Link
        href={`/courses/${courseId}/quizzes/${quiz.id}`}
        className="block w-full text-center px-4 py-2 bg-[#01BC63] text-white rounded-lg hover:bg-[#059669] transition font-medium"
      >
        {latestAttempt ? "Retake Quiz" : "Start Quiz"}
      </Link>
    </div>
  );
}
