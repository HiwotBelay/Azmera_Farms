"use client";

import { BookOpen, Globe, Award, Users, Smartphone, Clock } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Offline Learning",
    description:
      "Download courses and learn without internet connection. Perfect for rural areas.",
    color: "from-[#01BC63]",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Learn in Amharic, Afaan Oromo, Tigrigna, or English.",
    color: "from-[#FFDE59]",
  },
  {
    icon: Award,
    title: "Verified Certificates",
    description: "Earn recognized certificates that boost your credibility.",
    color: "from-[#01BC63]",
  },
  {
    icon: Users,
    title: "Expert Instructors",
    description: "Learn from experienced agricultural professionals.",
    color: "from-[#FFDE59]",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Optimized for smartphones and tablets. Learn anywhere.",
    color: "from-[#01BC63]",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Get help when you need it with our dedicated team.",
    color: "from-[#FFDE59]",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Designed specifically for farmers with features that work in
            real-world conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-xl border border-gray-200 hover:border-[#01BC63] bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <div
                    className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} to-[#FFDE59] mb-6`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
