import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseListing from "@/modules/courses/components/CourseListing";

export default function CoursesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <CourseListing />
      </main>
      <Footer />
    </div>
  );
}
