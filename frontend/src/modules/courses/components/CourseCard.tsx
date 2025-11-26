import Link from "next/link";
import { Star, Clock } from "lucide-react";
import { Course } from "../api/courses.api";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const instructorName = course.creator
    ? `${course.creator.firstName || ''} ${course.creator.lastName || ''}`.trim() || course.creator.email
    : 'Unknown Instructor';

  const formatPrice = (price: number, isFree: boolean): string => {
    if (isFree) return 'Free';
    return `ETB ${price.toFixed(2)}`;
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        <div className="relative">
          <img
            src={course.thumbnail || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop"}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          {course.category && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
              {course.category.name}
            </span>
          )}
          <div className="absolute top-3 right-3 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold ml-1">{course.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.shortDescription || course.description}
          </p>

          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold">
              {instructorName[0].toUpperCase()}
            </div>
            <span className="text-sm text-gray-700 line-clamp-1">{instructorName}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(course.price, course.isFree)}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDuration(course.duration)} • {course.lessonsCount} lessons</span>
            </div>
          </div>

          <div className="w-full text-center px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition">
            {course.isFree ? 'Enroll Free' : 'Enroll Now'}
          </div>
        </div>
      </div>
    </Link>
  );
}
