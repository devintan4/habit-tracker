import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useHabitStore } from "../store/useHabitStore";
import HabitForm from "../components/HabitForm";
import { HabitDto, UpdateHabitDto } from "../types/habit";
import Loading from "../components/Loading";

export default function HabitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchOne, update, remove, markDone } = useHabitStore();

  const [habit, setHabit] = useState<HabitDto>();
  const [loading, setLoading] = useState(true);
  const [doneDisabled, setDoneDisabled] = useState(false);

  // load habit & update disabled state
  const loadHabit = async () => {
    if (!id) return;
    setLoading(true);
    const h = await fetchOne(id);
    setHabit(h);
    if (h) {
      const doneCount = h.completedCountToday ?? 0;
      setDoneDisabled(doneCount >= h.frequency);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHabit();
  }, [id]);

  if (!id || loading) return <Loading />;
  if (!habit) return <p>Habit not found</p>;

  // fallback completedCountToday ke 0 jika undefined
  const completedToday = habit.completedCountToday ?? 0;

  const handleDone = async () => {
    setDoneDisabled(true);
    await markDone(id);
    await loadHabit();
  };

  const handleUpdate = async (data: UpdateHabitDto) => {
    await update(id, data);
    navigate("/habits");
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This habit will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await remove(id);
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your habit has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/habits");
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
            {doneDisabled
              ? `Done Today ✅ (${completedToday}/${habit.frequency})`
              : `Mark Done Today (${completedToday}/${habit.frequency})`}
          </button>

          <div className="mt-6 text-gray-700 space-y-1">
            <p>
              Progress Today:{" "}
              <span className="font-semibold">{completedToday}</span> /{" "}
              <span className="font-semibold">{habit.frequency}</span>
            </p>
            <p>
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
            className="text-red-600 hover:underline cursor-pointer"
          >
            Delete Habit
          </button>
        </div>
      </div>
    </div>
  );
}
