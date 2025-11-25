"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", activity: 2.5 },
  { day: "Tue", activity: 3.0 },
  { day: "Wed", activity: 2.0 },
  { day: "Thu", activity: 4.0 },
  { day: "Fri", activity: 3.5 },
  { day: "Sat", activity: 5.0 },
  { day: "Sun", activity: 2.0 },
];

export default function WeeklyActivityChart() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Activity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 5.0]} />
          <Tooltip />
          <Bar dataKey="activity" fill="#10B981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

