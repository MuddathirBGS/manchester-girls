"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTrainingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    meetTime: "",
    date: "",
    time: "",
    location: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

const handleSubmit = async (e: any) => {
  e.preventDefault();
  setLoading(true);

  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: form.title,
      opponent: "",        // not used for training
      type: "TRAINING",    // 🔥 THIS is the key
      location: form.location,
      date: form.date,
      time: form.time,
      kit: "",             // not needed
    }),
  });

  setLoading(false);

  if (res.ok) {
    alert("Training added successfully!");
    router.push("/coach");
    router.refresh();
  } else {
    alert("Error adding training");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/40">
      <div className="bg-white w-[420px] rounded-xl shadow-xl p-6 relative">

        <h2 className="text-xl font-bold mb-4">Add Training</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TEAM (visual only for now) */}
          <div>
            <label className="text-sm font-semibold">Team</label>
            <select
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option>Dynos</option>
              <option>Divas</option>
            </select>
          </div>

          {/* TITLE */}
          <div>
            <label className="text-sm font-semibold">Training Title</label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Fitness / Shooting / Passing"
              onChange={(e) => update("title", e.target.value)}
              required
            />
          </div>

          {/* MEET TIME (not saved yet, UI only) */}
          <div>
            <label className="text-sm font-semibold">Meet Time</label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="5:30 PM"
              onChange={(e) => update("meetTime", e.target.value)}
            />
          </div>

          {/* DATE + TIME */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-semibold">Date</label>
              <input
                type="date"
                className="w-full border rounded-lg p-2 mt-1"
                onChange={(e) => update("date", e.target.value)}
                required
              />
            </div>

            <div className="flex-1">
              <label className="text-sm font-semibold">Start Time</label>
              <input
                type="time"
                className="w-full border rounded-lg p-2 mt-1"
                onChange={(e) => update("time", e.target.value)}
                required
              />
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <label className="text-sm font-semibold">Location</label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Training ground"
              onChange={(e) => update("location", e.target.value)}
              required
            />
          </div>

          {/* NOTES (not saved yet, UI only) */}
          <div>
            <label className="text-sm font-semibold">Notes</label>
            <textarea
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Bring water, cones, etc..."
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => router.push("/coach")}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-black text-white rounded-lg font-semibold"
            >
              {loading ? "Saving..." : "Add Training"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
