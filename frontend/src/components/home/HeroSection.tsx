"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Sparkles, Play } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import az1 from "@/components/layout/az1.png";
import az2 from "@/components/layout/az2.png";
import az3 from "@/components/layout/az3.png";
import az4 from "@/components/layout/az4.png";

export default function HeroSection() {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [az1, az2, az3, az4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full flex items-start justify-center overflow-hidden bg-gradient-to-br from-white via-[#f0fef9] to-[#e8fdf5] pt-16 md:pt-20 pb-16 md:pb-20">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#01BC63]/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-[#FFDE59]/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/2 w-96 h-96 bg-[#01BC63]/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative container mx-auto px-4 md:px-10 max-w-7xl z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-5 md:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#01BC63]/10 to-[#FFDE59]/10 backdrop-blur-sm border border-[#01BC63]/20 rounded-full px-5 py-2.5">
              <Sparkles className="w-4 h-4 text-[#01BC63]" />
              <span className="text-sm font-semibold text-[#01BC63]">
                ✨ {t("home.badge", "Transform Your Future Today")}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight">
              <span className="text-gray-900">
                {t("home.heroTitle1", "Transform Agriculture Through")}
              </span>{" "}
              <span className="bg-gradient-to-r from-[#01BC63] to-[#FFDE59] bg-clip-text text-transparent">
                {t("home.heroTitle2", "Learning")}
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-700 max-w-lg leading-relaxed">
              {t(
                "home.heroDescription",
                "Join thousands of farmers, students, and agricultural professionals mastering modern farming techniques with expert-led courses designed for success."
              )}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#01BC63] to-[#00a855] text-white rounded-xl font-semibold shadow-lg shadow-[#01BC63]/30 hover:shadow-xl hover:shadow-[#01BC63]/40 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative flex items-center justify-center gap-2 z-10">
                  {t("home.startLearning", "Start Learning")}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00a855] to-[#01BC63] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/courses"
                className="group px-8 py-4 bg-white border-2 border-[#01BC63] text-[#01BC63] rounded-xl font-semibold hover:bg-[#01BC63]/5 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                {t("home.exploreCourses", "Explore Courses")}
              </Link>
            </div>
          </div>

          {/* Right Visual - Image Carousel */}
          <div className="hidden md:flex flex-1 justify-center items-center relative h-[400px] md:h-[480px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#01BC63]/20 to-[#FFDE59]/20 rounded-3xl blur-2xl"></div>
            <div className="relative w-full h-full max-w-lg flex items-center justify-center">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
                >
                  <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#01BC63]/40 via-[#FFDE59]/30 to-[#01BC63]/40 p-1">
                      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white">
                        <Image
                          src={image}
                          alt={`Hero image ${index + 1}`}
                          fill
                          className="object-cover rounded-3xl"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#01BC63] via-[#FFDE59] to-[#01BC63] rounded-3xl opacity-20 blur-xl -z-10"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
