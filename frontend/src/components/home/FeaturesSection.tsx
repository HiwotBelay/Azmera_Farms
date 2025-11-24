"use client"

import { BookOpen, Globe, Award, Users, Smartphone, Clock } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Offline Learning",
    description: "Download courses and learn without internet connection. Perfect for rural areas.",
    color: "from-[#01BC63]",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Learn in Amharic, Afaan Oromo, Tigrigna, or English.",
    color: "from-[#FFDE59]",
  },
  {
    icon: Award,
    title: "Verified Certificates",
    description: "Earn recognized certificates that boost your credibility.",
    color: "from-[#01BC63]",
  },
  {
    icon: Users,
    title: "Expert Instructors",
    description: "Learn from experienced agricultural professionals.",
    color: "from-[#FFDE59]",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Optimized for smartphones and tablets. Learn anywhere.",
    color: "from-[#01BC63]",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Get help when you need it with our dedicated team.",
    color: "from-[#FFDE59]",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Designed specifically for farmers with features that work in real-world conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl border-2 border-gray-200 hover:border-[#01BC63] bg-white hover:bg-gradient-to-br hover:from-[#01BC63]/5 hover:to-[#FFDE59]/5 smooth-transition hover-lift"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#01BC63]/10 to-[#FFDE59]/10 rounded-2xl smooth-transition"></div>

                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} to-[#FFDE59] mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
