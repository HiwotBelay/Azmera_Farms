"use client"

import Link from "next/link"
import { Video, DollarSign, Users, CheckCircle } from "lucide-react"

const features = [
  {
    icon: Video,
    title: "Easy Course Creation",
    description: "Upload videos, PDFs, and presentations with our intuitive tools",
  },
  {
    icon: DollarSign,
    title: "Earn Revenue",
    description: "Get paid for your expertise and grow your income",
  },
  {
    icon: Users,
    title: "Reach Thousands",
    description: "Connect with eager learners across multiple regions",
  },
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description: "Our team ensures your content meets high standards",
  },
]

export default function ShareYourKnowledgeSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#01BC63]/5 via-white to-[#01BC63]/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 bg-[#01BC63] text-white px-4 py-2 rounded-full mb-6 shadow-lg">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-sm">FOR EXPERTS & PRACTITIONERS</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              Share Your Knowledge, <span className="text-[#01BC63]">Empower Farmers</span>
            </h2>

            <p className="text-lg text-gray-800 mb-8 leading-relaxed max-w-xl">
              Are you an agricultural expert, researcher, or experienced farmer? Join our community of content creators
              and make a lasting impact by teaching thousands of learners.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#01BC63] rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-700">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Link
              href="/register?role=creator"
              className="inline-flex px-8 py-4 bg-[#01BC63] text-white rounded-xl font-bold hover:scale-105 hover:shadow-lg hover:shadow-[#01BC63]/30 transition-all duration-300"
            >
              Become a Content Creator
            </Link>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-1 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=800&fit=crop"
                alt="Teacher in classroom"
                className="w-full h-auto"
              />

              {/* Overlay Badges */}
              <div className="absolute top-6 right-6 bg-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 backdrop-blur">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="text-xs text-gray-600">Rating</p>
                  <p className="font-bold text-gray-900">4.9/5</p>
                </div>
              </div>

              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 backdrop-blur">
                <Users className="w-5 h-5 text-[#01BC63]" />
                <div>
                  <p className="text-xs text-gray-600">Active</p>
                  <p className="font-bold text-gray-900">1,200+ Learners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
