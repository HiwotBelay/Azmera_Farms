import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import PopularCoursesSection from "@/components/home/PopularCoursesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import SuccessStoriesSection from "@/components/home/SuccessStoriesSection";
import ShareYourKnowledgeSection from "@/components/home/ShareYourKnowledgeSection";
import CTASection from "@/components/home/CTASection";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <CategoriesSection />
        <PopularCoursesSection />
        <FeaturesSection />
        <SuccessStoriesSection />
        <ShareYourKnowledgeSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
