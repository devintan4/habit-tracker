import React, { useState } from "react";
import Swal from "sweetalert2";
import { CreateHabitDto } from "../types/habit";

interface Props {
  initial?: CreateHabitDto;
  onSubmit: (h: CreateHabitDto) => Promise<void>;
  submitLabel?: string;
}

export default function HabitForm({
  initial = { name: "", frequency: 1, reminderOn: false },
  onSubmit,
  submitLabel = "Save",
}: Props) {
  const [form, setForm] = useState<CreateHabitDto>(initial);
  const [saving, setSaving] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
      await Swal.fire({
        icon: "success",
        title: "Habit Added!",
        text: `“${form.name}” has been added successfully.`,
        confirmButtonText: "OK",
      });
      // reset form
      setForm(initial);
    } catch (err: any) {
      await Swal.fire({
        icon: "error",
        title: "Failed to Add Habit",
        text:
          err?.response?.data ||
          err?.message ||
          "Something went wrong while adding the habit.",
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <form onSubmit={handle} className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="habit-name"
            className="block text-sm font-semibold text-gray-700"
          >
            Name
          </label>
          <input
            id="habit-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="
              mt-1 block w-full
              border border-gray-300
              rounded-md px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition
            "
            placeholder="e.g. Read a book"
          />
        </div>

        {/* Frequency */}
        <div>
          <label
            htmlFor="habit-frequency"
            className="block text-sm font-semibold text-gray-700"
          >
            Frequency (per day)
          </label>
          <input
            id="habit-frequency"
            type="number"
            min={1}
            value={form.frequency}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                frequency: Number(e.target.value),
              }))
            }
            required
            className="
              mt-1 block w-32
              border border-gray-300
              rounded-md px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition
            "
          />
        </div>

        {/* Reminder */}
        <div className="flex items-center">
          <input
            id="habit-reminder"
            type="checkbox"
            checked={form.reminderOn}
            onChange={(e) =>
              setForm((f) => ({ ...f, reminderOn: e.target.checked }))
            }
            className="
              h-4 w-4
              text-primary
              border-gray-300 rounded
              focus:ring-2 focus:ring-primary
              transition
            "
          />
          <label
            htmlFor="habit-reminder"
            className="ml-2 text-sm font-medium text-gray-700"
          >
            Enable Reminder
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="
            w-full flex justify-center items-center
            bg-primary text-white
            rounded-md py-2
            hover:bg-primary-dark
            focus:outline-none focus:ring-2 focus:ring-primary
            transition
            disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
          "
        >
          {saving && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3.536-3.536A12 12 0 004 12z"
              />
            </svg>
          )}
          <span className={saving ? "ml-2" : ""}>{submitLabel}</span>
        </button>
      </form>
    </div>
  );
}
