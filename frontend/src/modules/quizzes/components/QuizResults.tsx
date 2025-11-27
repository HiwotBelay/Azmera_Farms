"use client";

import { CheckCircle, XCircle, Award, Clock } from "lucide-react";
import Link from "next/link";
import { QuizAttempt, Quiz } from "../api/quizzes.api";

interface QuizResultsProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  courseId: string;
}

export default function QuizResults({
  quiz,
  attempt,
  courseId,
}: QuizResultsProps) {
  const passed = attempt.passed;
  const percentage = attempt.percentage || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="mb-6">
          {passed ? (
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          )}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {passed ? "Congratulations!" : "Quiz Completed"}
          </h2>
          <p className="text-gray-600">
            {passed
              ? "You passed the quiz!"
              : `You scored ${percentage.toFixed(1)}%, but need ${
                  quiz.passingScore
                }% to pass.`}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-3xl font-bold text-[#01BC63] mb-1">
                {percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Your Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {attempt.score}
              </div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {quiz.passingScore}%
              </div>
              <div className="text-sm text-gray-600">Passing Score</div>
            </div>
          </div>
        </div>

        {attempt.answers && attempt.answers.length > 0 && (
          <div className="text-left mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Question Review
            </h3>
            <div className="space-y-4">
              {attempt.answers.map((answer, index) => (
                <div
                  key={answer.id}
                  className={`p-4 rounded-lg border-2 ${
                    answer.isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      Question {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {answer.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-sm font-medium">
                        {answer.points} point{answer.points !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Your answer: {answer.answers.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <Link
            href={`/courses/${courseId}`}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Back to Course
          </Link>
          {quiz.allowRetake && !passed && (
            <Link
              href={`/courses/${courseId}/quizzes/${quiz.id}`}
              className="px-6 py-3 bg-[#01BC63] text-white rounded-lg hover:bg-[#059669] transition"
            >
              Retake Quiz
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
