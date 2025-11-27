"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  quizzesApi,
  Quiz,
  QuizAttempt,
} from "@/modules/quizzes/api/quizzes.api";
import QuizPlayer from "@/modules/quizzes/components/QuizPlayer";
import QuizResults from "@/modules/quizzes/components/QuizResults";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuiz();
  }, [courseId, quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const quizData = await quizzesApi.getById(courseId, quizId);
      setQuiz(quizData);

      // Check for existing attempts
      const attempts = await quizzesApi.getUserAttempts(courseId, quizId);
      if (attempts.length > 0) {
        const latestAttempt = attempts[0];
        if (latestAttempt.status === "IN_PROGRESS") {
          setAttempt(latestAttempt);
        } else {
          // Start new attempt if allowed
          if (quizData.allowRetake || attempts.length < quizData.maxAttempts) {
            const newAttempt = await quizzesApi.startAttempt(courseId, quizId);
            setAttempt(newAttempt);
          } else {
            setAttempt(latestAttempt);
          }
        }
      } else {
        // Start new attempt
        const newAttempt = await quizzesApi.startAttempt(courseId, quizId);
        setAttempt(newAttempt);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load quiz");
      console.error("Error loading quiz:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = (result: QuizAttempt) => {
    setAttempt(result);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01BC63] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quiz...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !quiz || !attempt) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error || "Quiz not found"}</p>
          <button
            onClick={() => router.push(`/courses/${courseId}`)}
            className="px-6 py-3 bg-[#01BC63] text-white rounded-lg hover:bg-[#059669] transition"
          >
            Back to Course
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {attempt.status === "COMPLETED" || attempt.status === "TIMED_OUT" ? (
        <QuizResults quiz={quiz} attempt={attempt} courseId={courseId} />
      ) : (
        <QuizPlayer
          quiz={quiz}
          courseId={courseId}
          attempt={attempt}
          onComplete={handleComplete}
        />
      )}
    </DashboardLayout>
  );
}
