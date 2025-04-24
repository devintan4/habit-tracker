import React, { useEffect } from "react";
import { useHabitStore } from "../store/useHabitStore";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
import { CreateHabitDto } from "../types/habit";
import Loading from "../components/Loadint";

export default function HabitsPage() {
  const { habits, loading, fetchAll, create } = useHabitStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAdd = async (h: CreateHabitDto) => {
    await create(h);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Habits</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <Loading />
        ) : (
          habits.map((h) => <HabitCard key={h.id} habit={h} />)
        )}
      </div>
      <div className="mt-8 max-w-md">
        <h2 className="text-xl font-semibold">Add New Habit</h2>
        <HabitForm onSubmit={handleAdd} />
      </div>
    </div>
  );
}
