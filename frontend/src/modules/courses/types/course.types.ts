export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  reviews: number;
  price: number;
  isFree: boolean;
  duration: string;
  lessons: number;
  category: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  language: "en" | "am";
  image: string;
  thumbnail?: string;
  status?: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED";
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  type: "VIDEO" | "PDF" | "BOTH";
  videoUrl?: string;
  pdfUrl?: string;
  order: number;
  duration?: number;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  progress: number;
}

