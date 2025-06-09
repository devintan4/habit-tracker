import React, { useEffect } from "react";
import Loading from "../components/Loading";
import { useHabitStore } from "../store/useHabitStore";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export default function StatsPage() {
  const { habits, loading, fetchAll } = useHabitStore();

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <Loading />;
  if (habits.length === 0) return <p>No habits yet</p>;

  // ring data
  const maxCurrent = Math.max(...habits.map((h) => h.currentStreak));
  const maxLongest = Math.max(...habits.map((h) => h.longestStreak));
  const todayLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // pie data for today completion
  const doneCount = habits.filter(
    (h) => h.completedCountToday >= h.frequency
  ).length;
  const notDoneCount = habits.length - doneCount;
  const pieData = [
    { name: "Done Today", value: doneCount },
    { name: "Not Done", value: notDoneCount },
  ];
  const COLORS = ["#10B981", "#EF4444"]; // green, red

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        <RingStat
          value={maxCurrent}
          label="Current Streak"
          subLabel={todayLabel}
          color="#F97316"
        />
        <RingStat value={maxLongest} label="Longest Streak" color="#3B82F6" />
      </div>

      {/* Today Completion Pie Chart */}
      <div className="max-w-4xl mx-auto mt-12 bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Today’s Completion
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => `${value}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RingStat({
  value,
  label,
  subLabel,
  color,
}: {
  value: number;
  label: string;
  subLabel?: string;
  color: string;
}) {
  const data = [{ value }];

  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
      <div className="relative w-36 h-36">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              background={{ fill: "#E5E7EB" }}
              dataKey="value"
              cornerRadius={20}
              fill={color}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-gray-800">{value}</span>
          {subLabel && (
            <span className="text-sm text-gray-500 mt-1">{subLabel}</span>
          )}
        </div>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-gray-800">{label}</h3>
    </div>
  );
}
