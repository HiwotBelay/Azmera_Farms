import Link from "next/link";
import { Star, Clock } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  reviews: number;
  price: number;
  duration: string;
  lessons: number;
  category: string;
  level?: string;
  language?: string;
  image: string;
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        <div className="relative">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          <span className="absolute top-3 left-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
            {course.category}
          </span>
          <div className="absolute top-3 right-3 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold ml-1">{course.rating}</span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">{course.instructor}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-primary">
              ${course.price}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{course.duration} • {course.lessons} lessons</span>
            </div>
          </div>

          <div className="w-full text-center px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition">
            Enroll Now
          </div>
        </div>
      </div>
    </Link>
  );
}

