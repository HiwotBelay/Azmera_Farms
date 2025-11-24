import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Almaz Tesfaye",
    role: "Vegetable Farmer, Oromia",
    quote: "The greenhouse farming course transformed my business. I increased my tomato yield by 300% and now supply to major hotels in Addis Ababa.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Getachew Kebede",
    role: "Dairy Farmer, Amhara",
    quote: "Learning about modern dairy management helped me improve milk quality and quantity. My income doubled in just 8 months.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Rahel Assefa",
    role: "Coffee Producer, SNNP",
    quote: "The agribusiness courses taught me how to market my products effectively. I now export coffee to international buyers.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
];

export default function SuccessStoriesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Success Stories
          </h2>
          <p className="text-gray-600 text-lg">
            Real farmers, real results from our learning platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* User Info */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-3 object-cover"
                />
                <div>
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
