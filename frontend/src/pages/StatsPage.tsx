import React, { useEffect } from "react";
import { useHabitStore } from "../store/useHabitStore";
import Loading from "../components/Loadint";

export default function StatsPage() {
  const { habits, loading, fetchAll } = useHabitStore();

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <Loading />;

  const avgStreak =
    habits.length > 0
      ? habits.reduce((acc, h) => acc + h.currentStreak, 0) / habits.length
      : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Statistics</h1>
      <p>Total Habits: {habits.length}</p>
      <p>
        Average Current Streak: <strong>{avgStreak.toFixed(1)}</strong>
      </p>
      <ul className="mt-4 space-y-2">
        {habits.map((h) => (
          <li key={h.id} className="flex justify-between">
            <span>{h.name}</span>
            <span>{h.currentStreak}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
