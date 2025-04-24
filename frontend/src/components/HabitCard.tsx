import React from "react";
import { Link } from "react-router-dom";
import { HabitDto } from "../types/habit";

export default function HabitCard({ habit }: { habit: HabitDto }) {
  return (
    <Link
      to={`/habits/${habit.id}`}
      className="block bg-white p-4 rounded shadow hover:shadow-md transition"
    >
      <h3 className="text-lg font-medium">{habit.name}</h3>
      <p className="text-sm text-gray-500">
        Frequency: {habit.frequency} / day
      </p>
      <p className="text-sm text-gray-500">
        Streak: {habit.currentStreak} (longest {habit.longestStreak})
      </p>
    </Link>
  );
}
