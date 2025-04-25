import React, { useEffect } from "react";
import { useHabitStore } from "../store/useHabitStore";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
import { CreateHabitDto } from "../types/habit";
import Loading from "../components/Loading";

export default function HabitsPage() {
  const { habits, loading, fetchAll, create } = useHabitStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAdd = async (h: CreateHabitDto) => {
    await create(h);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold text-gray-800">Your Habits</h1>
        </header>

        {/* Grid of Habits */}
        <section>
          {loading ? (
            <Loading />
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {habits.map((h) => (
                <HabitCard key={h.id} habit={h} />
              ))}
            </div>
          )}
        </section>

        {/* Form Card */}
        <section>
          <div className="bg-white rounded-lg shadow-lg p-8 mx-auto max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Add New Habit
            </h2>
            <HabitForm onSubmit={handleAdd} submitLabel="Add Habit" />
          </div>
        </section>
      </div>
    </div>
  );
}
