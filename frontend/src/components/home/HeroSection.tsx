import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-primary text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Transform Agriculture Through{" "}
              <span className="text-accent-yellow">Learning</span>
            </h1>
            <p className="text-lg mb-8 text-white/90">
              Join thousands of farmers, students, and agricultural professionals
              mastering modern farming techniques with expert-led courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="px-6 py-3 bg-accent-yellow text-gray-800 rounded-lg font-semibold hover:bg-yellow-400 transition text-center"
              >
                Start Learning
              </Link>
              <Link
                href="/courses"
                className="px-6 py-3 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition text-center"
              >
                Explore Courses
              </Link>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="hidden md:block">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop"
                alt="Agricultural fields"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
