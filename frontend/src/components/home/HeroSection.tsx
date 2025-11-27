"use client"

import Link from "next/link"
import { ChevronRight, Sparkles } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#f0fef9] to-[#e8fdf5]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#01BC63] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#FFDE59] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#01BC63] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 z-10">
            <div className="flex items-center gap-2 bg-[#01BC63]/10 backdrop-blur-md border border-[#01BC63]/30 rounded-full px-4 py-2 w-fit">
              <Sparkles className="w-4 h-4 text-[#01BC63]" />
              <span className="text-sm font-semibold text-[#01BC63]">✨ Transform Your Future Today</span>
            </div>

            <div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-gray-900">Transform Agriculture Through</span>{" "}
                <span className="bg-gradient-to-r from-[#01BC63] to-[#FFDE59] bg-clip-text text-transparent">
                  Learning
                </span>
              </h1>

              <p className="text-xl text-gray-700 leading-relaxed max-w-lg">
                Join thousands of farmers, students, and agricultural professionals mastering modern farming techniques
                with expert-led courses designed for success.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#01BC63] to-[#01BC63] text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#01BC63]/50"
              >
                <span className="relative flex items-center justify-center gap-2">
                  Start Learning
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/courses"
                className="px-8 py-4 bg-[#01BC63]/10 border-2 border-[#01BC63] text-[#01BC63] rounded-xl font-semibold hover:bg-[#01BC63]/20 transition-all duration-300 hover:scale-105"
              >
                Explore Courses
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-gray-300">
              <div>
                <p className="text-3xl font-bold text-[#01BC63]">1,000+</p>
                <p className="text-sm text-gray-600">Active Learners</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#01BC63]">500+</p>
                <p className="text-sm text-gray-600">Expert Courses</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#01BC63]">95%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden md:block relative h-96">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#01BC63]/20 to-[#FFDE59]/20 rounded-3xl blur-2xl"></div>
            <div className="absolute inset-8 bg-gradient-to-br from-[#01BC63]/10 to-[#FFDE59]/10 rounded-3xl backdrop-blur-xl border border-[#01BC63]/30 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-[#01BC63] to-[#FFDE59] rounded-2xl mx-auto mb-4 animate-pulse"></div>
                <p className="text-gray-900 font-semibold">Quality Education</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



