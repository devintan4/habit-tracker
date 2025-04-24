import React, { useState } from "react";
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
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    onSubmit(form).finally(() => setSaving(false));
  };

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Frequency (per day)</label>
        <input
          type="number"
          value={form.frequency}
          min={1}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              frequency: Number(e.target.value),
            }))
          }
          required
          className="mt-1 w-24 border rounded px-3 py-2"
        />
      </div>
      <div className="flex items-center">
        <input
          id="rem"
          type="checkbox"
          checked={form.reminderOn}
          onChange={(e) =>
            setForm((f) => ({ ...f, reminderOn: e.target.checked }))
          }
          className="mr-2"
        />
        <label htmlFor="rem" className="text-sm">
          Reminder On
        </label>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        {submitLabel}
      </button>
    </form>
  );
}
