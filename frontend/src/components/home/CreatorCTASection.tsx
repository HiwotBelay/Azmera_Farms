"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CreatorCTASection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#FFDE59]/10 via-white to-[#01BC63]/10">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20 max-w-4xl">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            Are you a content creator?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Share your expertise and help farmers across Ethiopia learn and
            grow.
          </p>
          <Link
            href="/register?role=creator"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#01BC63] text-white rounded-lg font-semibold text-lg hover:bg-[#059669] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Join and Contribute
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
