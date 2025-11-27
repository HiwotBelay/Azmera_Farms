"use client";

import { useTranslation } from "@/hooks/useTranslation";
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
  const { translationVersion } = useTranslation(); // Subscribe to context changes

  return (
    <div
      className="min-h-screen flex flex-col"
      key={`home-${translationVersion}`}
    >
      <Header />
      <main className="flex-grow">
        <section id="home" className="scroll-mt-16">
          <HeroSection key={`hero-${translationVersion}`} />
        </section>
        <section id="about" className="scroll-mt-16">
          <AboutSection key={`about-${translationVersion}`} />
        </section>
        <section id="features" className="scroll-mt-16">
          <FeaturesSection key={`features-${translationVersion}`} />
        </section>
        <section id="courses" className="scroll-mt-16">
          <PopularCoursesSection key={`courses-${translationVersion}`} />
        </section>
        <section id="categories" className="scroll-mt-16">
          <CategoriesSection key={`categories-${translationVersion}`} />
        </section>
        <section id="cta" className="scroll-mt-16">
          <CreatorCTASection key={`cta-${translationVersion}`} />
        </section>
        <section id="contact" className="scroll-mt-16">
          <ContactSection key={`contact-${translationVersion}`} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
