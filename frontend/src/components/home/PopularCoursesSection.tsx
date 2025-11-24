import Link from "next/link";
import { Star, Clock } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Modern Greenhouse Farming",
    description: "Learn advanced greenhouse techniques for year-round production of vegetables and herbs",
    instructor: "Dr. Alemayehu Tadesse",
    rating: 4.9,
    reviews: 234,
    price: 49,
    duration: "8 weeks",
    lessons: 32,
    category: "Crop Production",
    categoryColor: "bg-green-100 text-green-800",
    image: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Dairy Cattle Management",
    description: "Comprehensive guide to raising healthy dairy cattle and maximizing milk production",
    instructor: "Dr. Meseret Hailu",
    rating: 4.8,
    reviews: 189,
    price: 39,
    duration: "6 weeks",
    lessons: 24,
    category: "Livestock",
    categoryColor: "bg-yellow-100 text-yellow-800",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Agricultural Finance & Marketing",
    description: "Master financial planning, market analysis, and profitable agricultural business strategies",
    instructor: "Ato Bekele Molla",
    rating: 4.7,
    reviews: 312,
    price: 59,
    duration: "10 weeks",
    lessons: 40,
    category: "Agribusiness",
    categoryColor: "bg-blue-100 text-blue-800",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
  },
];

export default function PopularCoursesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Popular Courses
            </h2>
            <p className="text-gray-600">
              Top-rated courses from expert instructors
            </p>
          </div>
          <Link
            href="/courses"
            className="hidden md:block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            View All Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Course Image */}
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${course.categoryColor}`}>
                  {course.category}
                </span>
                <div className="absolute top-3 right-3 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold ml-1">{course.rating}</span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700">{course.instructor}</span>
                </div>

                {/* Price */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-primary">
                    ${course.price}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration} • {course.lessons} lessons</span>
                  </div>
                </div>

                {/* Enroll Button */}
                <Link
                  href={`/courses/${course.id}`}
                  className="block w-full text-center px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
