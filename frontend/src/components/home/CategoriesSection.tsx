"use client";

import Link from "next/link";
import { Leaf, Beef, TrendingUp, Sprout, ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Crop Production",
    description:
      "Master modern farming techniques for cereals, vegetables, and cash crops",
    courses: 125,
    icon: Leaf,
  },
  {
    id: 2,
    title: "Livestock Management",
    description:
      "Learn cattle, poultry, and small ruminant management practices",
    courses: 89,
    icon: Beef,
  },
  {
    id: 3,
    title: "Agribusiness",
    description: "Develop business skills for agricultural entrepreneurship",
    courses: 67,
    icon: TrendingUp,
  },
  {
    id: 4,
    title: "Sustainable Farming",
    description: "Eco-friendly practices for long-term agricultural success",
    courses: 93,
    icon: Sprout,
  },
];

export default function CategoriesSection() {
  return (
    <section
      id="categories"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#f8fffe] to-white py-20 md:py-32"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#01BC63]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFDE59]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 md:px-10 max-w-7xl z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFDE59]/10 to-[#01BC63]/10 backdrop-blur-sm border border-[#FFDE59]/20 rounded-full px-5 py-2.5 mb-6">
            <div className="w-2 h-2 bg-[#FFDE59] rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-[#01BC63]">
              Learning Categories
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            <span className="text-gray-900">Explore Learning</span>{" "}
            <span className="bg-gradient-to-r from-[#01BC63] to-[#FFDE59] bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive agricultural education covering all aspects of modern
            farming
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group relative bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:shadow-[#01BC63]/20 transition-all duration-500 hover:-translate-y-3 hover:border-[#01BC63] overflow-hidden"
              >
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#01BC63]/0 via-[#FFDE59]/0 to-[#01BC63]/0 group-hover:from-[#01BC63]/10 group-hover:via-[#FFDE59]/10 group-hover:to-[#01BC63]/10 transition-all duration-500"></div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#01BC63]/0 to-[#FFDE59]/0 group-hover:from-[#01BC63]/20 group-hover:to-[#FFDE59]/20 rounded-bl-full transition-all duration-500"></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#01BC63] to-[#00a855] shadow-lg group-hover:shadow-xl group-hover:shadow-[#01BC63]/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#01BC63] transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    {category.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 group-hover:border-[#01BC63]/30 transition-colors duration-300">
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-[#01BC63] transition-colors duration-300">
                      {category.courses} Courses
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#01BC63] to-[#FFDE59] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Hover Border Glow */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#01BC63]/30 transition-all duration-500 pointer-events-none"></div>

                {/* Bottom Glow Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#01BC63] via-[#FFDE59] to-[#01BC63] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
