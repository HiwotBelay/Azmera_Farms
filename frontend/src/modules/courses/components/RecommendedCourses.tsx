import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

const recommendedCourses = [
  {
    id: 1,
    title: "Water Management Basics",
    instructor: "Dr. Sarah Johnson",
    rating: 4.9,
    reviews: 234,
    price: "Free",
    badges: ["New", "Free"],
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Soil Science Fundamentals",
    instructor: "Prof. Michael Chen",
    rating: 4.8,
    reviews: 189,
    price: "ETB 500",
    badges: ["Popular"],
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Livestock Management Pro",
    instructor: "Dr. Ahmed Hassan",
    rating: 4.9,
    reviews: 312,
    price: "ETB 750",
    badges: ["Trending"],
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop",
  },
];

export default function RecommendedCourses() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recommended for You</h2>
        <Link
          href="/courses"
          className="text-primary hover:underline flex items-center gap-1"
        >
          Browse All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                {course.badges.map((badge, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      badge === "New"
                        ? "bg-yellow-400 text-gray-800"
                        : badge === "Free"
                        ? "bg-green-500 text-white"
                        : badge === "Popular"
                        ? "bg-blue-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-1">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold ml-1">{course.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({course.reviews} reviews)
                  </span>
                </div>
                <span className="text-primary font-bold">{course.price}</span>
              </div>
              <Link
                href={`/courses/${course.id}`}
                className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

