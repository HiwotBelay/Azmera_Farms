"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-start overflow-hidden bg-white pt-8 md:pt-12">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#01BC63]/5 via-white to-[#FFDE59]/5"></div>

      <div className="relative container mx-auto px-6 md:px-12 lg:px-16 xl:px-20 max-w-7xl pt-8 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Content */}
          <div className="space-y-8 z-10">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-gray-900">
                Transform Agriculture Through{" "}
                <span className="bg-gradient-to-r from-[#01BC63] to-[#FFDE59] bg-clip-text text-transparent">
                  Learning
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl font-light">
                Join thousands of farmers, students, and agricultural
                professionals mastering modern farming techniques with
                expert-led courses designed for success.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#01BC63] text-white rounded-lg font-semibold text-lg hover:bg-[#059669] transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#01BC63]/30"
              >
                Start Learning
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-lg hover:border-[#01BC63] hover:text-[#01BC63] transition-all duration-200"
              >
                Explore Courses
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:block relative w-full h-[500px] xl:h-[600px]">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/image.png"
                alt="Agricultural learning"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 0vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
