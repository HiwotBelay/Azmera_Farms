import { apiClient } from '@/lib/api-client';

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit: number;
  isActive: boolean;
  allowRetake: boolean;
  maxAttempts: number;
  questions?: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options: string[];
  correctAnswers: string[];
  points: number;
  order: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'TIMED_OUT';
  score: number;
  percentage: number;
  passed: boolean;
  startedAt?: string;
  completedAt?: string;
  answers?: QuizAnswer[];
}

export interface QuizAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  answers: string[];
  isCorrect: boolean;
  points: number;
}

export const quizzesApi = {
  create: async (courseId: string, data: Partial<Quiz>): Promise<Quiz> => {
    const response = await apiClient.instance.post<Quiz>(
      `/courses/${courseId}/quizzes`,
      data,
    );
    return response.data;
  },

  getAll: async (courseId: string): Promise<Quiz[]> => {
    const response = await apiClient.instance.get<Quiz[]>(
      `/courses/${courseId}/quizzes`,
    );
    return response.data;
  },

  getById: async (courseId: string, quizId: string): Promise<Quiz> => {
    const response = await apiClient.instance.get<Quiz>(
      `/courses/${courseId}/quizzes/${quizId}`,
    );
    return response.data;
  },

  addQuestion: async (
    courseId: string,
    quizId: string,
    question: Partial<QuizQuestion>,
  ): Promise<QuizQuestion> => {
    const response = await apiClient.instance.post<QuizQuestion>(
      `/courses/${courseId}/quizzes/${quizId}/questions`,
      question,
    );
    return response.data;
  },

  startAttempt: async (
    courseId: string,
    quizId: string,
  ): Promise<QuizAttempt> => {
    const response = await apiClient.instance.post<QuizAttempt>(
      `/courses/${courseId}/quizzes/${quizId}/start`,
      {},
    );
    return response.data;
  },

  submitAttempt: async (
    attemptId: string,
    answers: { questionId: string; answers: string[] }[],
  ): Promise<QuizAttempt> => {
    const response = await apiClient.instance.post<QuizAttempt>(
      `/courses/quizzes/attempts/${attemptId}/submit`,
      { answers },
    );
    return response.data;
  },

  getAttempt: async (attemptId: string): Promise<QuizAttempt> => {
    const response = await apiClient.instance.get<QuizAttempt>(
      `/courses/quizzes/attempts/${attemptId}`,
    );
    return response.data;
  },

  getUserAttempts: async (
    courseId: string,
    quizId: string,
  ): Promise<QuizAttempt[]> => {
    const response = await apiClient.instance.get<QuizAttempt[]>(
      `/courses/${courseId}/quizzes/${quizId}/attempts`,
    );
    return response.data;
  },

  delete: async (courseId: string, quizId: string): Promise<void> => {
    await apiClient.instance.delete(`/courses/${courseId}/quizzes/${quizId}`);
  },
};

