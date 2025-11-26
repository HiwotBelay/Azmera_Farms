"use client"

import Link from "next/link"
import { Shield, CheckCircle } from "lucide-react"

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#01BC63] via-[#01BC63]/95 to-[#01BC63]/90">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FFDE59] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">Ready to Transform Your Farm?</h2>
        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of successful farmers who have upgraded their skills and increased their income through our
          platform. Start your journey today!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            href="/register"
            className="group relative px-8 py-4 bg-gray-900 text-[#FFDE59] rounded-xl font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/30"
          >
            <span className="relative flex items-center justify-center gap-2">
              Start Free Trial
              <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </span>
          </Link>
          <Link
            href="/courses"
            className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white text-white rounded-xl font-bold hover:bg-white/30 transition-all duration-300 hover:scale-105"
          >
            Browse Courses
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-white" />
            <span>30-day money-back guarantee</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></div>
          <span>No credit card required</span>
        </div>
      </div>
    </section>
  )
}



