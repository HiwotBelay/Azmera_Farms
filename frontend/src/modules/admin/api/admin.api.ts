import { apiClient } from '@/lib/api-client';

export interface AdminStats {
  users: {
    total: number;
    learners: number;
    creators: number;
    admins: number;
  };
  courses: {
    total: number;
    published: number;
    pending: number;
    draft: number;
    rejected: number;
  };
  enrollments: {
    total: number;
  };
  applications: {
    pending: number;
  };
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'LEARNER' | 'CREATOR' | 'ADMIN';
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UpdateUserDto {
  role?: 'LEARNER' | 'CREATOR' | 'ADMIN';
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface CreatorApplication {
  id: string;
  userId: string;
  user?: User;
  motivation: string;
  experience?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationDto {
  motivation: string;
  experience?: string;
}

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.instance.get<AdminStats>('/admin/stats');
    return response.data;
  },

  getAllUsers: async (filters?: {
    role?: 'LEARNER' | 'CREATOR' | 'ADMIN';
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<UsersResponse> => {
    const response = await apiClient.instance.get<UsersResponse>('/admin/users', {
      params: filters,
    });
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.instance.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.instance.put<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.instance.delete(`/admin/users/${id}`);
  },

  // Creator Applications (existing)
  submitCreatorApplication: async (data: any): Promise<CreatorApplication> => {
    const response = await apiClient.instance.post<CreatorApplication>(
      '/admin/creator-applications',
      data
    );
    return response.data;
  },

  getMyApplication: async (): Promise<CreatorApplication | null> => {
    try {
      const response = await apiClient.instance.get<CreatorApplication>(
        '/admin/creator-applications/my-application'
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getAllApplications: async (): Promise<CreatorApplication[]> => {
    const response = await apiClient.instance.get<CreatorApplication[]>(
      '/admin/creator-applications'
    );
    return response.data;
  },

  getApplicationById: async (id: string): Promise<CreatorApplication> => {
    const response = await apiClient.instance.get<CreatorApplication>(
      `/admin/creator-applications/${id}`
    );
    return response.data;
  },

  // Admin Courses Endpoint
  // This calls: GET http://localhost:3001/api/admin/courses?status=PENDING&limit=1000
  getCourses: async (filters?: {
    status?: string;
    search?: string;
    categoryId?: string;
    level?: string;
    language?: string;
    minPrice?: number;
    maxPrice?: number;
    isFree?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ courses: any[]; total: number }> => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const endpoint = `${API_URL}/admin/courses`;
    const queryString = filters ? '?' + new URLSearchParams(filters as any).toString() : '';
    const fullUrl = `${endpoint}${queryString}`;
    
    console.log('🔍 adminApi.getCourses called with filters:', filters);
    console.log('🔍 Full API URL will be:', fullUrl);
    console.log('🔍 Calling endpoint: /admin/courses with params:', filters);
    
    const response = await apiClient.instance.get<{ courses: any[]; total: number }>('/admin/courses', {
      params: filters,
    });
    
    console.log('✅ adminApi.getCourses response received:', {
      coursesCount: response.data.courses.length,
      total: response.data.total,
      statusFilter: filters?.status,
    });
    return response.data;
  },

  publishCourse: async (courseId: string): Promise<any> => {
    const response = await apiClient.instance.post(`/courses/${courseId}/publish`);
    return response.data;
  },

  rejectCourse: async (courseId: string, rejectionReason: string): Promise<any> => {
    const response = await apiClient.instance.post(`/courses/${courseId}/reject`, {
      rejectionReason,
    });
    return response.data;
  },
};
