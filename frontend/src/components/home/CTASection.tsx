import Link from "next/link";
import { Shield } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Transform Your Farm?
        </h2>
        <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
          Join thousands of successful farmers who have upgraded their skills and increased their income through our platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link
            href="/register"
            className="px-6 py-3 bg-white text-primary border-2 border-white rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Free Trial
          </Link>
          <Link
            href="/courses"
            className="px-6 py-3 bg-primary text-white border-2 border-white rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            Browse Courses
          </Link>
        </div>

        <div className="flex items-center justify-center text-sm text-white/80">
          <Shield className="w-4 h-4 mr-2" />
          <span>30-day money-back guarantee • No credit card required</span>
        </div>
      </div>
    </section>
  );
}

