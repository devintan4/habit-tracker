import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHabitStore } from "../store/useHabitStore";
import HabitForm from "../components/HabitForm";
import { HabitDto, UpdateHabitDto } from "../types/habit";
import Loading from "../components/Loading";

export default function HabitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { fetchOne, update, remove, markDone } = useHabitStore();

  const [habit, setHabit] = useState<HabitDto>();
  const [loading, setLoading] = useState(true);
  const [doneDisabled, setDoneDisabled] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchOne(id)
      .then((h) => {
        setHabit(h);
        // Disable if already marked today
        if (h && h.currentStreak > 0) {
          const lastLogDate = new Date(); // frontend can't see logs—assume done if just reloaded
          setDoneDisabled(true);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!id || loading) return <Loading />;
  if (!habit) return <p>Habit not found</p>;

  const handleDone = async () => {
    setDoneDisabled(true);
    await markDone(id);
    // reload detail
    setLoading(true);
    const h2 = await fetchOne(id);
    setHabit(h2);
    setLoading(false);
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Card Wrapper */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {habit.name}
          </h1>

          <button
            onClick={handleDone}
            disabled={doneDisabled}
            className="
            w-full py-3 rounded-md text-white font-semibold
            bg-indigo-600 hover:bg-indigo-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            transition
            disabled:bg-indigo-300 disabled:hover:bg-indigo-300 disabled:cursor-not-allowed
          "
          >
            {doneDisabled ? "Done Today ✅" : "Mark Done Today"}
          </button>

          <div className="mt-6 text-gray-700">
            <p className="mb-1">
              Current Streak:{" "}
              <span className="font-semibold">{habit.currentStreak}</span>
            </p>
            <p>
              Longest Streak:{" "}
              <span className="font-semibold">{habit.longestStreak}</span>
            </p>
          </div>
        </div>

        {/* Edit Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Edit Habit
          </h2>
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

        {/* Delete Button */}
        <div className="text-center">
          <button
            onClick={handleDelete}
            className="text-red-600 hover:underline"
          >
            Delete Habit
          </button>
        </div>
      </div>
    </div>
  );
}
