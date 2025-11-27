"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Almaz Tesfaye",
    role: "Vegetable Farmer, Oromia",
    quote:
      "The greenhouse farming course transformed my business. I increased my tomato yield by 300% and now supply to major hotels in Addis Ababa.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: 2,
    name: "Getachew Kebede",
    role: "Dairy Farmer, Amhara",
    quote:
      "Learning about modern dairy management helped me improve milk quality and quantity. My income doubled in just 8 months.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: 3,
    name: "Rahel Assefa",
    role: "Coffee Producer, SNNP",
    quote:
      "The agribusiness courses taught me how to market my products effectively. I now export coffee to international buyers.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
]

export default function SuccessStoriesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-lg text-gray-600">Real farmers, real results from our learning platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative p-8 rounded-2xl border-2 border-gray-200 bg-white hover:border-[#01BC63] hover:bg-gradient-to-br hover:from-[#01BC63]/5 hover:to-[#FFDE59]/5 hover-lift smooth-transition"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#FFDE59] fill-[#FFDE59]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>

              {/* User Info */}
              <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-100">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#01BC63]"
                />
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



