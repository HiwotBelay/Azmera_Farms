import FeatureIcon from "@/components/ui/FeatureIcons";

const features = [
  {
    id: 1,
    title: "Offline Learning",
    description: "Download courses and learn without internet connection. Perfect for rural areas with limited connectivity.",
    feature: "offline" as const,
    iconBg: "bg-green-500",
  },
  {
    id: 2,
    title: "Multi-Language Support",
    description: "Learn in your preferred language: Amharic, Afaan Oromo, Tigrigna, or English.",
    feature: "multilanguage" as const,
    iconBg: "bg-yellow-600",
  },
  {
    id: 3,
    title: "Verified Certificates",
    description: "Earn recognized certificates that boost your credibility as a professional farmer.",
    feature: "certificates" as const,
    iconBg: "bg-teal-500",
  },
  {
    id: 4,
    title: "Expert Instructors",
    description: "Learn from experienced agricultural professionals and industry experts.",
    feature: "instructors" as const,
    iconBg: "bg-purple-400",
  },
  {
    id: 5,
    title: "Mobile-First Design",
    description: "Optimized for smartphones and tablets. Learn anywhere, anytime.",
    feature: "mobile" as const,
    iconBg: "bg-purple-300",
  },
  {
    id: 6,
    title: "24/7 Support",
    description: "Get help when you need it with our dedicated support team.",
    feature: "support" as const,
    iconBg: "bg-pink-400",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Choose Azemera Farms?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our platform is designed specifically for Ethiopian farmers with features that work in real-world conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4">
                <FeatureIcon feature={feature.feature} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
