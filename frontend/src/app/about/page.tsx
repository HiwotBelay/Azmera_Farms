import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Users, Target, Award, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-white to-accent-yellow/10 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                About <span className="text-primary">Azemera Academy</span>
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Empowering Ethiopian farmers and agricultural professionals with
                modern, practical education to transform agriculture and improve
                livelihoods.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Azemera Academy is dedicated to bridging the knowledge gap in
                Ethiopian agriculture by providing accessible, high-quality
                online education. We believe that education is the key to
                sustainable agricultural development and food security.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our platform connects expert instructors with eager learners,
                creating a community where traditional farming wisdom meets
                modern agricultural techniques. Through our courses, we aim to
                increase crop yields, improve farming practices, and ultimately
                enhance the livelihoods of farmers across Ethiopia.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Community
                </h3>
                <p className="text-gray-600">
                  Building a supportive learning community for all agricultural
                  stakeholders
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Excellence
                </h3>
                <p className="text-gray-600">
                  Delivering high-quality, expert-led courses that make a real
                  difference
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Impact
                </h3>
                <p className="text-gray-600">
                  Creating measurable positive change in agricultural practices
                  and outcomes
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Accessibility
                </h3>
                <p className="text-gray-600">
                  Making education accessible to everyone, regardless of
                  location or background
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Azemera Academy was born from a simple observation: many
                  Ethiopian farmers have the passion and dedication to improve
                  their practices, but lack access to modern agricultural
                  knowledge and training resources.
                </p>
                <p>
                  Founded by Azemera Farms, a leading agricultural organization
                  in Ethiopia, we recognized the need for a platform that could
                  bring expert knowledge directly to farmers, students, and
                  agricultural professionals across the country.
                </p>
                <p>
                  Today, Azemera Academy serves thousands of learners, offering
                  courses in multiple languages, supporting offline learning for
                  areas with limited internet access, and continuously expanding
                  our curriculum to meet the evolving needs of the agricultural
                  community.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
