import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHabitStore } from "../store/useHabitStore";
import HabitForm from "../components/HabitForm";
import { HabitDto, UpdateHabitDto } from "../types/habit";
import Loading from "../components/Loadint";

export default function HabitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { fetchOne, update, remove, markDone } = useHabitStore();

  const [habit, setHabit] = useState<HabitDto>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchOne(id)
      .then((h) => setHabit(h))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id || loading) return <Loading />;
  if (!habit) return <p>Not found</p>;

  const handleUpdate = async (h: UpdateHabitDto) => {
    await update(id, h);
    nav("/habits");
  };

  const handleDelete = async () => {
    if (confirm("Delete this habit?")) {
      await remove(id);
      nav("/habits");
    }
  };

  const handleDone = async () => {
    await markDone(id);
    // reload detail
    setLoading(true);
    const h2 = await fetchOne(id);
    setHabit(h2);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold">{habit.name}</h1>
      <button
        onClick={handleDone}
        className="bg-secondary text-white px-4 py-2 rounded"
      >
        Mark Done Today
      </button>
      <div>
        <p>
          Current Streak: <strong>{habit.currentStreak}</strong>
        </p>
        <p>
          Longest Streak: <strong>{habit.longestStreak}</strong>
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Edit Habit</h2>
        <HabitForm
          initial={{
            name: habit.name,
            frequency: habit.frequency,
            reminderOn: habit.reminderOn,
          }}
          submitLabel="Update"
          onSubmit={handleUpdate}
        />
      </div>
      <button onClick={handleDelete} className="text-red-600 hover:underline">
        Delete Habit
      </button>
    </div>
  );
}
