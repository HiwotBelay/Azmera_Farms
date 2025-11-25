import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseDetail from "@/modules/courses/components/CourseDetail";

interface CourseDetailPageProps {
  params: {
    id: string;
  };
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <CourseDetail courseId={params.id} />
      </main>
      <Footer />
    </div>
  );
}

