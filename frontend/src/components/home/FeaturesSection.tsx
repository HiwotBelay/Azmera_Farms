"use client";

import React from "react";
import { BookOpen, Globe, Award, Users, Smartphone, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: BookOpen,
      titleKey: "home.feature1Title",
      descKey: "home.feature1Desc",
    },
    {
      icon: Globe,
      titleKey: "home.feature2Title",
      descKey: "home.feature2Desc",
    },
    {
      icon: Award,
      titleKey: "home.feature3Title",
      descKey: "home.feature3Desc",
    },
    {
      icon: Users,
      titleKey: "home.feature4Title",
      descKey: "home.feature4Desc",
    },
    {
      icon: Smartphone,
      titleKey: "home.feature5Title",
      descKey: "home.feature5Desc",
    },
    {
      icon: Clock,
      titleKey: "home.feature6Title",
      descKey: "home.feature6Desc",
    },
  ];

  return (
    <section
      id="features"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#f8fffe] to-white py-20 md:py-32"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#01BC63]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#FFDE59]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 md:px-10 max-w-7xl z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFDE59]/10 to-[#01BC63]/10 backdrop-blur-sm border border-[#FFDE59]/20 rounded-full px-5 py-2.5 mb-6">
            <div className="w-2 h-2 bg-[#FFDE59] rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-[#01BC63]">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            <span className="text-gray-900">
              {t("home.featuresTitle", "Why Choose")}
            </span>{" "}
            <span className="bg-gradient-to-r from-[#01BC63] to-[#FFDE59] bg-clip-text text-transparent">
              Azemera Academy
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t(
              "home.featuresDescription",
              "Experience world-class agricultural education designed for real-world success."
            )}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#01BC63]/10 transition-all duration-500 hover:-translate-y-2 hover:border-[#01BC63] overflow-hidden"
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#01BC63]/0 via-[#FFDE59]/0 to-[#01BC63]/0 group-hover:from-[#01BC63]/5 group-hover:via-[#FFDE59]/5 group-hover:to-[#01BC63]/5 transition-all duration-500"></div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#01BC63]/0 to-[#FFDE59]/0 group-hover:from-[#01BC63]/10 group-hover:to-[#FFDE59]/10 rounded-bl-full transition-all duration-500"></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#01BC63] to-[#00a855] shadow-lg group-hover:shadow-xl group-hover:shadow-[#01BC63]/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#01BC63] transition-colors duration-300">
                    {t(feature.titleKey, feature.titleKey)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg group-hover:text-gray-700 transition-colors duration-300">
                    {t(feature.descKey, feature.descKey)}
                  </p>
                </div>

                {/* Hover Border Glow */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#01BC63]/30 transition-all duration-500 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
