import Link from "next/link";
import { ArrowRight } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Modern Farming Techniques",
    instructor: "Dr. Abebe Tadesse",
    progress: 75,
    lessons: "9/12",
    time: "8h 30m",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Sustainable Agriculture",
    instructor: "Prof. Marta Alemu",
    progress: 45,
    lessons: "7/15",
    time: "10h 15m",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Crop Management Essentials",
    instructor: "Eng. Dawit Bekele",
    progress: 90,
    lessons: "9/10",
    time: "6h 45m",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    title: "Irrigation Systems Design",
    instructor: "Dr. Sarah Johnson",
    progress: 30,
    lessons: "5/18",
    time: "12h 20m",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop",
  },
];

export default function ContinueLearning() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
        <Link
          href="/courses/my-courses"
          className="text-primary hover:underline flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{course.lessons} lessons</span>
                  <span>{course.time}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{course.progress}% complete</p>
              </div>

              <Link
                href={`/courses/${course.id}/learn`}
                className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Continue Learning
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

