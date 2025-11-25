import { apiClient } from '@/lib/api';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  language: 'ENGLISH' | 'AMHARIC';
  category: string;
  totalStudents: number;
  averageRating: number;
  totalReviews: number;
  totalViews: number;
  totalEnrollments: number;
  estimatedDuration?: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  sections?: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: 'VIDEO' | 'DOCUMENT' | 'BOTH';
  videoUrl?: string;
  documentUrl?: string;
  duration?: string;
  fileSize?: string;
  order: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  enrolledAt: string;
  course: Course;
}

export interface CreateCourseDto {
  title: string;
  description: string;
  thumbnail?: string;
  price?: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  language?: 'ENGLISH' | 'AMHARIC';
  category: string;
  status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';
  sections?: CreateSectionDto[];
}

export interface CreateSectionDto {
  title: string;
  description?: string;
  order?: number;
  lessons?: CreateLessonDto[];
}

export interface CreateLessonDto {
  title: string;
  description?: string;
  type: 'VIDEO' | 'DOCUMENT' | 'BOTH';
  videoUrl?: string;
  documentUrl?: string;
  duration?: string;
  order?: number;
}

export const coursesApi = {
  // Get all courses
  getAll: async (filters?: {
    status?: string;
    category?: string;
    level?: string;
    search?: string;
  }): Promise<Course[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.level) params.append('level', filters.level);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    return apiClient.get<Course[]>(`/courses${query ? `?${query}` : ''}`);
  },

  // Get single course
  getById: async (id: string): Promise<Course> => {
    return apiClient.get<Course>(`/courses/${id}`);
  },

  // Get my courses (creator)
  getMyCourses: async (): Promise<Course[]> => {
    return apiClient.get<Course[]>('/courses/my-courses');
  },

  // Get enrolled courses
  getEnrolled: async (): Promise<Enrollment[]> => {
    return apiClient.get<Enrollment[]>('/courses/enrolled');
  },

  // Create course
  create: async (data: CreateCourseDto): Promise<Course> => {
    return apiClient.post<Course>('/courses', data);
  },

  // Update course
  update: async (id: string, data: Partial<CreateCourseDto>): Promise<Course> => {
    return apiClient.patch<Course>(`/courses/${id}`, data);
  },

  // Delete course
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/courses/${id}`);
  },

  // Enroll in course
  enroll: async (courseId: string): Promise<Enrollment> => {
    return apiClient.post<Enrollment>(`/courses/${courseId}/enroll`, {});
  },

  // Update progress
  updateProgress: async (
    courseId: string,
    progress: number,
    completed?: boolean,
  ): Promise<Enrollment> => {
    return apiClient.patch<Enrollment>(`/courses/${courseId}/progress`, {
      progress,
      completed,
    });
  },
};

