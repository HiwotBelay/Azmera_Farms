import { apiClient } from '@/lib/api-client';

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  creatorId: string;
  creator?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price: number;
  isFree: boolean;
  thumbnail?: string;
  images?: string[];
  duration: number;
  lessonsCount: number;
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  tags?: string[];
  language?: string;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  type: 'VIDEO' | 'PDF' | 'BOTH';
  videoUrl?: string;
  pdfUrl?: string;
  order: number;
  duration?: number;
  isPreview: boolean;
  isActive: boolean;
}

export interface CreateCourseDto {
  title: string;
  description: string;
  shortDescription?: string;
  categoryId?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price?: number;
  isFree?: boolean;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  language?: string;
}

export interface FilterCoursesDto {
  search?: string;
  categoryId?: string;
  status?: string;
  level?: string;
  language?: string;
  minPrice?: number;
  maxPrice?: number;
  isFree?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const coursesApi = {
  getAll: async (filters?: FilterCoursesDto) => {
    console.log('🔍 coursesApi.getAll called with filters:', filters);
    console.log('🔍 coursesApi.getAll - baseURL:', apiClient.instance.defaults.baseURL);
    console.log('🔍 coursesApi.getAll - full URL will be:', `${apiClient.instance.defaults.baseURL}/courses`);
    
    try {
      const response = await apiClient.instance.get<{ courses: Course[]; total: number }>('/courses', {
        params: filters,
      });
      
      console.log('✅ coursesApi.getAll response:', {
        status: response.status,
        data: response.data,
        coursesCount: response.data?.courses?.length || 0,
        total: response.data?.total || 0,
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ coursesApi.getAll error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      throw error;
    }
  },

  getById: async (id: string) => {
    const response = await apiClient.instance.get<Course>(`/courses/${id}`);
    return response.data;
  },

  create: async (data: CreateCourseDto) => {
    const response = await apiClient.instance.post<Course>('/courses', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateCourseDto>) => {
    const response = await apiClient.instance.put<Course>(`/courses/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.instance.delete(`/courses/${id}`);
  },

  submitForReview: async (id: string) => {
    const response = await apiClient.instance.post<Course>(`/courses/${id}/submit`);
    return response.data;
  },

  enroll: async (id: string) => {
    const response = await apiClient.instance.post(`/courses/${id}/enroll`);
    return response.data;
  },

  getMyCourses: async () => {
    const response = await apiClient.instance.get<Course[]>('/courses/my-courses');
    return response.data;
  },

  getCourseLessons: async (id: string) => {
    const response = await apiClient.instance.get<Lesson[]>(`/courses/${id}/lessons`);
    return response.data;
  },

  getCourseProgress: async (id: string) => {
    const response = await apiClient.instance.get(`/courses/${id}/progress`);
    return response.data;
  },

  publish: async (id: string) => {
    const response = await apiClient.instance.post<Course>(`/courses/${id}/publish`);
    return response.data;
  },

  reject: async (id: string, rejectionReason: string) => {
    const response = await apiClient.instance.post<Course>(`/courses/${id}/reject`, {
      rejectionReason,
    });
    return response.data;
  },
};

