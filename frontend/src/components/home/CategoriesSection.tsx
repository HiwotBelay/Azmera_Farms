"use client";

import Link from "next/link";
import { Leaf, Beef, TrendingUp, Sprout } from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Crop Production",
    description:
      "Master modern farming techniques for cereals, vegetables, and cash crops",
    courses: 125,
    icon: Leaf,
    color: "from-emerald-400 to-[#01BC63]",
  },
  {
    id: 2,
    title: "Livestock Management",
    description:
      "Learn cattle, poultry, and small ruminant management practices",
    courses: 89,
    icon: Beef,
    color: "from-amber-300 to-[#FFDE59]",
  },
  {
    id: 3,
    title: "Agribusiness",
    description: "Develop business skills for agricultural entrepreneurship",
    courses: 67,
    icon: TrendingUp,
    color: "from-sky-400 to-blue-500",
  },
  {
    id: 4,
    title: "Sustainable Farming",
    description: "Eco-friendly practices for long-term agricultural success",
    courses: 93,
    icon: Sprout,
    color: "from-teal-400 to-cyan-500",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Explore Learning Categories
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive agricultural education covering all aspects of modern
            farming
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group relative p-8 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-100`}
                ></div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>

                <div className="relative z-10">
                  <div className="inline-flex p-3 rounded-lg bg-white/20 backdrop-blur-sm mb-5">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {category.title}
                  </h3>
                  <p className="text-white/90 text-sm mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-white/90 text-sm font-semibold">
                      {category.courses} Courses
                    </span>
                    <span className="text-xl font-bold text-white group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
