import { apiClient } from '@/lib/api-client';

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  isModerated: boolean;
  isVisible: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewDto {
  rating: number;
  comment: string;
}

export const reviewsApi = {
  create: async (courseId: string, data: CreateReviewDto): Promise<Review> => {
    const response = await apiClient.instance.post<Review>(
      `/courses/${courseId}/reviews`,
      data,
    );
    return response.data;
  },

  getAll: async (courseId: string): Promise<Review[]> => {
    const response = await apiClient.instance.get<Review[]>(
      `/courses/${courseId}/reviews`,
    );
    return response.data;
  },

  getById: async (courseId: string, reviewId: string): Promise<Review> => {
    const response = await apiClient.instance.get<Review>(
      `/courses/${courseId}/reviews/${reviewId}`,
    );
    return response.data;
  },

  update: async (
    courseId: string,
    reviewId: string,
    data: Partial<CreateReviewDto>,
  ): Promise<Review> => {
    const response = await apiClient.instance.put<Review>(
      `/courses/${courseId}/reviews/${reviewId}`,
      data,
    );
    return response.data;
  },

  delete: async (courseId: string, reviewId: string): Promise<void> => {
    await apiClient.instance.delete(`/courses/${courseId}/reviews/${reviewId}`);
  },
};

