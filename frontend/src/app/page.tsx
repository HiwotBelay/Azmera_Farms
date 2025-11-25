import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import PopularCoursesSection from "@/components/home/PopularCoursesSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CreatorCTASection from "@/components/home/CreatorCTASection";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section id="home" className="scroll-mt-16">
          <HeroSection />
        </section>
        <section id="about" className="scroll-mt-16">
          <AboutSection />
        </section>
        <section id="features" className="scroll-mt-16">
          <FeaturesSection />
        </section>
        <section id="courses" className="scroll-mt-16">
          <PopularCoursesSection />
        </section>
        <section id="categories" className="scroll-mt-16">
          <CategoriesSection />
        </section>
        <section id="cta" className="scroll-mt-16">
          <CreatorCTASection />
        </section>
        <section id="contact" className="scroll-mt-16">
          <ContactSection />
        </section>
      </main>
      <Footer />
    </div>
  );
}
