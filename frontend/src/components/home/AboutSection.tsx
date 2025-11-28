"use client";

import React from "react";
import { Target, Lightbulb, Heart, ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function AboutSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "Empowering Ethiopian farmers with modern agricultural education to transform lives and communities.",
    },
    {
      icon: Lightbulb,
      title: "Our Vision",
      description:
        "Creating a future where every farmer has access to world-class agricultural knowledge and skills.",
    },
    {
      icon: Heart,
      title: "Our Values",
      description:
        "Dedicated to excellence, accessibility, and sustainable agricultural development across Ethiopia.",
    },
  ];

  return (
    <section
      id="about"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#f8fffe] to-white py-20 md:py-32"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#01BC63]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#FFDE59]/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 md:px-10 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8 z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#01BC63]/10 to-[#FFDE59]/10 backdrop-blur-sm border border-[#01BC63]/20 rounded-full px-5 py-2.5">
              <div className="w-2 h-2 bg-[#01BC63] rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-[#01BC63]">
                {t("home.aboutTitle", "About Us")}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="text-gray-900">
                {t("home.aboutTitle", "About")}
              </span>{" "}
              <span className="bg-gradient-to-r from-[#01BC63] to-[#FFDE59] bg-clip-text text-transparent">
                Azemera Academy
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-lg">
              {t(
                "home.aboutDescription",
                "Azemera Academy is dedicated to empowering Ethiopian farmers and agricultural professionals with cutting-edge knowledge and practical skills. We bridge the gap between traditional wisdom and modern techniques, creating a sustainable future for agriculture."
              )}
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <a
                href="#courses"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#01BC63] to-[#00a855] text-white rounded-xl font-semibold shadow-lg shadow-[#01BC63]/30 hover:shadow-xl hover:shadow-[#01BC63]/40 transition-all duration-300 hover:scale-105"
              >
                <span>Explore Our Courses</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Side - Feature Cards */}
          <div className="space-y-6 z-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-md overflow-hidden transition-all duration-500 hover:border-[#01BC63] hover:shadow-2xl hover:shadow-[#01BC63]/20"
                >
                  {/* Animated Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#01BC63] to-[#FFDE59] opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

                  {/* Animated Border Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#01BC63] via-[#FFDE59] to-[#01BC63] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md scale-105"></div>

                  <div className="flex items-start gap-4 relative z-10">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFDE59] to-[#ffd633] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-[#FFDE59]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="w-7 h-7 text-gray-900 group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#01BC63] transition-colors duration-300 group-hover:translate-x-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
