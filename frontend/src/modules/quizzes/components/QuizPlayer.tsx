"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Quiz, QuizQuestion, QuizAttempt } from "../api/quizzes.api";
import { quizzesApi } from "../api/quizzes.api";

interface QuizPlayerProps {
  quiz: Quiz;
  courseId: string;
  attempt: QuizAttempt;
  onComplete: (result: QuizAttempt) => void;
}

export default function QuizPlayer({
  quiz,
  courseId,
  attempt,
  onComplete,
}: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (quiz.timeLimit > 0 && attempt.startedAt) {
      const startTime = new Date(attempt.startedAt).getTime();
      const timeLimitMs = quiz.timeLimit * 60 * 1000;

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, timeLimitMs - elapsed);
        setTimeRemaining(Math.floor(remaining / 1000));

        if (remaining <= 0) {
          handleSubmit();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [quiz.timeLimit, attempt.startedAt]);

  const currentQuestion = quiz.questions?.[currentQuestionIndex];
  const totalQuestions = quiz.questions?.length || 0;

  const handleAnswerChange = (
    questionId: string,
    value: string,
    isMultiple = false
  ) => {
    setAnswers((prev) => {
      if (isMultiple) {
        const current = prev[questionId] || [];
        const newAnswers = current.includes(value)
          ? current.filter((a) => a !== value)
          : [...current, value];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: [value] };
      }
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const answerArray = Object.entries(answers).map(
        ([questionId, answerValues]) => ({
          questionId,
          answers: answerValues,
        })
      );

      const result = await quizzesApi.submitAttempt(attempt.id, answerArray);
      onComplete(result);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
          {timeRemaining !== null && (
            <div className="flex items-center gap-2 text-lg font-semibold text-red-600">
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span>•</span>
          <span>
            {currentQuestion.points} point
            {currentQuestion.points !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#01BC63] h-2 rounded-full transition-all"
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.type === "TRUE_FALSE" ? (
            <>
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#01BC63] transition">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value="true"
                  checked={answers[currentQuestion.id]?.includes("true")}
                  onChange={() =>
                    handleAnswerChange(currentQuestion.id, "true")
                  }
                  className="w-4 h-4 text-[#01BC63]"
                />
                <span className="ml-3 text-gray-900">True</span>
              </label>
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#01BC63] transition">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value="false"
                  checked={answers[currentQuestion.id]?.includes("false")}
                  onChange={() =>
                    handleAnswerChange(currentQuestion.id, "false")
                  }
                  className="w-4 h-4 text-[#01BC63]"
                />
                <span className="ml-3 text-gray-900">False</span>
              </label>
            </>
          ) : currentQuestion.type === "MULTIPLE_CHOICE" ? (
            currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#01BC63] transition"
              >
                <input
                  type="checkbox"
                  checked={answers[currentQuestion.id]?.includes(option)}
                  onChange={() =>
                    handleAnswerChange(currentQuestion.id, option, true)
                  }
                  className="w-4 h-4 text-[#01BC63] rounded"
                />
                <span className="ml-3 text-gray-900">{option}</span>
              </label>
            ))
          ) : (
            <textarea
              value={answers[currentQuestion.id]?.[0] || ""}
              onChange={(e) =>
                handleAnswerChange(currentQuestion.id, e.target.value)
              }
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-[#01BC63] focus:outline-none"
              rows={4}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
          }
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            className="px-6 py-3 bg-[#01BC63] text-white rounded-lg hover:bg-[#059669] transition flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#01BC63] text-white rounded-lg hover:bg-[#059669] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}
