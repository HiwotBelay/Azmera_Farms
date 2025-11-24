import Link from "next/link";
import CategoryIcon from "@/components/ui/CategoryIcons";

const categories = [
  {
    id: 1,
    title: "Crop Production",
    description: "Master modern farming techniques for cereals, vegetables, and cash crops",
    courses: 125,
    category: "crop" as const,
    gradient: "linear-gradient(135deg, #F0FDF4 0%, rgba(1, 188, 99, 0.1) 70.71%)",
  },
  {
    id: 2,
    title: "Livestock Management",
    description: "Learn cattle, poultry, and small ruminant management practices",
    courses: 89,
    category: "livestock" as const,
    gradient: "linear-gradient(135deg, #FEFCE8 0%, rgba(255, 222, 89, 0.2) 70.71%)",
  },
  {
    id: 3,
    title: "Agribusiness",
    description: "Develop business skills for agricultural entrepreneurship",
    courses: 67,
    category: "agribusiness" as const,
    gradient: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 70.71%)",
  },
  {
    id: 4,
    title: "Sustainable Farming",
    description: "Eco-friendly practices for long-term agricultural success",
    courses: 93,
    category: "sustainable" as const,
    gradient: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 70.71%)",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Explore Learning Categories
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Comprehensive agricultural education covering all aspects of modern farming and agribusiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl p-6 hover:shadow-lg transition-shadow"
              style={{ background: category.gradient }}
            >
              <div className="mb-4">
                <CategoryIcon category={category.category} className="w-16 h-16" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {category.title}
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                {category.description}
              </p>
              <Link
                href={`/categories/${category.id}`}
                className="text-primary font-semibold hover:underline inline-flex items-center"
              >
                {category.courses} Courses →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
