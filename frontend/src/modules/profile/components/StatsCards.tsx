import { BookOpen, Clock, Award, TrendingUp } from "lucide-react";

const stats = [
  {
    id: 1,
    label: "Enrolled Courses",
    value: "4",
    icon: BookOpen,
    color: "bg-green-500",
  },
  {
    id: 2,
    label: "Learning Time",
    value: "37.5h",
    icon: Clock,
    color: "bg-yellow-500",
  },
  {
    id: 3,
    label: "Certificates Earned",
    value: "1",
    icon: Award,
    color: "bg-green-500",
  },
  {
    id: 4,
    label: "Avg. Progress",
    value: "60%",
    icon: TrendingUp,
    color: "bg-yellow-500",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`${stat.color} rounded-xl p-6 text-white shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <stat.icon className="w-8 h-8" />
          </div>
          <p className="text-3xl font-bold mb-1">{stat.value}</p>
          <p className="text-white/90 text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

