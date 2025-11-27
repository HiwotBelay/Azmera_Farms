"use client";

import React, { useState, useEffect } from "react";
import { Users, BookOpen, Award, TrendingUp } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

// Stats will be translated in component

export default function AboutSection() {
  const { t, translationVersion } = useTranslation();

  // Force re-render when translations change
  useEffect(() => {
    console.log(
      `[AboutSection] Re-rendered, translation version: ${translationVersion}`
    );
  }, [translationVersion]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("about-section");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <section id="about-section" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
        {/* About Azemera Section */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            {t("home.aboutTitle", "About")}{" "}
            <span className="text-[#01BC63]">Azemera Academy</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {t(
              "home.aboutDescription",
              "Empowering Ethiopian farmers and agricultural professionals with modern, practical education to transform agriculture and improve livelihoods. We connect expert instructors with eager learners, creating a community where traditional farming wisdom meets modern agricultural techniques."
            )}
          </p>
        </div>

        {/* Interactive Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 lg:mb-20">
          {[
            {
              icon: Users,
              value: "10,000+",
              labelKey: "home.activeLearners",
              label: "Active Learners",
              color: "from-[#01BC63] to-[#01BC63]/80",
            },
            {
              icon: BookOpen,
              value: "500+",
              labelKey: "home.expertCourses",
              label: "Expert Courses",
              color: "from-[#FFDE59] to-[#FFDE59]/80",
            },
            {
              icon: Award,
              value: "95%",
              labelKey: "home.successRate",
              label: "Success Rate",
              color: "from-[#01BC63] to-[#FFDE59]",
            },
            {
              icon: TrendingUp,
              value: "50+",
              labelKey: "home.expertInstructors",
              label: "Expert Instructors",
              color: "from-[#FFDE59] to-[#01BC63]",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#01BC63] transition-all duration-300 hover:shadow-lg ${
                  isVisible ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div
                    className={`inline-flex p-4 rounded-lg bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div
                    className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {t(stat.labelKey, stat.label)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Our Mission Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#01BC63]/10 via-white to-[#FFDE59]/10 rounded-3xl p-10 lg:p-14 border-2 border-[#01BC63]/20 shadow-xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 text-center">
              {t("home.missionTitle", "Our Mission")}
            </h3>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center">
              {t(
                "home.missionDescription",
                "Azemera Academy is dedicated to bridging the knowledge gap in Ethiopian agriculture by providing accessible, high-quality online education. We believe that education is the key to sustainable agricultural development and food security for our nation."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
