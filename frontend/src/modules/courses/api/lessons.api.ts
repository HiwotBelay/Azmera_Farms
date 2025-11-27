import { apiClient } from '@/lib/api-client';
import { Lesson } from './courses.api';

export interface CreateLessonDto {
  title: string;
  description?: string;
  type?: 'VIDEO' | 'PDF' | 'BOTH';
  videoUrl?: string;
  pdfUrl?: string;
  order?: number;
  duration?: number;
  isPreview?: boolean;
  isActive?: boolean;
}

export interface UpdateLessonDto extends Partial<CreateLessonDto> {}

export const lessonsApi = {
  create: async (courseId: string, data: CreateLessonDto): Promise<Lesson> => {
    const response = await apiClient.instance.post<Lesson>(
      `/courses/${courseId}/lessons`,
      data
    );
    return response.data;
  },

  update: async (
    courseId: string,
    lessonId: string,
    data: UpdateLessonDto
  ): Promise<Lesson> => {
    const response = await apiClient.instance.put<Lesson>(
      `/courses/${courseId}/lessons/${lessonId}`,
      data
    );
    return response.data;
  },

  delete: async (courseId: string, lessonId: string): Promise<void> => {
    await apiClient.instance.delete(`/courses/${courseId}/lessons/${lessonId}`);
  },
};

