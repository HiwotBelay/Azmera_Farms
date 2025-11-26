import { apiClient } from '@/lib/api-client';

export interface UserProfile {
  id: string;
  userId: string;
  phoneNumber?: string;
  bio?: string;
  organization?: string;
  profileImage?: string;
  language?: string;
  location?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isEmailVerified: boolean;
  isActive: boolean;
  userProfile?: UserProfile;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  organization?: string;
  location?: string;
  language?: string;
  profileImage?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface UserStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessons: number;
  completedLessons: number;
  totalStudyTime: number;
  certificatesEarned: number;
  joinDate: string;
  lastActive: string;
}

export const usersApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.instance.get<User>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileDto): Promise<User> => {
    const response = await apiClient.instance.put<User>('/users/profile', data);
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.instance.get<User>(`/users/${id}`);
    return response.data;
  },

  getUserStats: async (): Promise<UserStats> => {
    const response = await apiClient.instance.get<UserStats>('/users/me/stats');
    return response.data;
  },

  getAllUserProgress: async () => {
    const response = await apiClient.instance.get('/users/me/progress');
    return response.data;
  },
};

