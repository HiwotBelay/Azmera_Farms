"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Users,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function CreatorCTASection() {
  const { t } = useTranslation();

  const benefits = [
    { icon: Users, text: "Reach Thousands" },
    { icon: BookOpen, text: "Share Knowledge" },
    { icon: TrendingUp, text: "Build Your Brand" },
  ];

  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFDE59]/10 via-white to-[#01BC63]/10 py-16 md:py-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#01BC63]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#FFDE59]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 md:px-10 max-w-5xl z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border-2 border-gray-100 p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#01BC63]/10 to-[#FFDE59]/10 backdrop-blur-sm border border-[#01BC63]/20 rounded-full px-4 py-1.5 mb-4">
                <Sparkles className="w-3 h-3 text-[#01BC63]" />
                <span className="text-xs font-semibold text-[#01BC63]">
                  Become a Creator
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-2 text-gray-900">
                {t("home.creatorCTATitle", "Are you a content creator?")}
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                {t(
                  "home.creatorCTADescription",
                  "Share your expertise and help farmers across Ethiopia learn and grow."
                )}
              </p>
            </div>

            {/* Right CTA Button */}
            <div className="flex-shrink-0">
              <Link
                href="/creator/application"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#01BC63] to-[#00a855] text-white rounded-xl font-bold text-base md:text-lg shadow-lg shadow-[#01BC63]/30 hover:shadow-xl hover:shadow-[#01BC63]/40 transition-all duration-300 hover:scale-105"
              >
                <span>
                  {t("home.joinAndContribute", "Join and Contribute")}
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
