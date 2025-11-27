"use client";

import React, { useEffect } from "react";
import { BookOpen, Globe, Award, Users, Smartphone, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

// Features will be translated in component

export default function FeaturesSection() {
  const { t, translationVersion } = useTranslation();

  useEffect(() => {
    console.log(
      `[FeaturesSection] Re-rendered, translation version: ${translationVersion}`
    );
  }, [translationVersion]);
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20 max-w-7xl">
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            {t("home.featuresTitle", "Why Choose Us")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t(
              "home.featuresDescription",
              "Designed specifically for farmers with features that work in real-world conditions."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              titleKey: "home.feature1Title",
              descKey: "home.feature1Desc",
              color: "from-[#01BC63]",
            },
            {
              icon: Globe,
              titleKey: "home.feature2Title",
              descKey: "home.feature2Desc",
              color: "from-[#FFDE59]",
            },
            {
              icon: Award,
              titleKey: "home.feature3Title",
              descKey: "home.feature3Desc",
              color: "from-[#01BC63]",
            },
            {
              icon: Users,
              titleKey: "home.feature4Title",
              descKey: "home.feature4Desc",
              color: "from-[#FFDE59]",
            },
            {
              icon: Smartphone,
              titleKey: "home.feature5Title",
              descKey: "home.feature5Desc",
              color: "from-[#01BC63]",
            },
            {
              icon: Clock,
              titleKey: "home.feature6Title",
              descKey: "home.feature6Desc",
              color: "from-[#FFDE59]",
            },
          ].map((feature, index) => {
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
                    {t(feature.titleKey, feature.titleKey)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {t(feature.descKey, feature.descKey)}
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
