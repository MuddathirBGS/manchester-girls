"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddTrainingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamIdFromUrl = searchParams.get("teamId");

  // ✅ REAL TEAM IDS
  const DYNOS_ID = "cmlp8lhno00004lay76ixxb2n";
  const DIVAS_ID = "cmlp8lji200014lays2jfga30";

  const [form, setForm] = useState({
    teamId: "",
    title: "",
    meetTime: "",
    date: "",
    time: "",
    location: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teamIdFromUrl) {
      setForm((prev) => ({ ...prev, teamId: teamIdFromUrl }));
    }
  }, [teamIdFromUrl]);

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
        opponent: "",
        type: "TRAINING",
        location: form.location,
        date: form.date,
        time: form.time,
        kit: "",
        teamId: form.teamId,
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

          {/* TEAM */}
          <div>
            <label className="text-sm font-semibold">Team</label>
            <input
              value={
                form.teamId === DYNOS_ID
                  ? "Dynos"
                  : form.teamId === DIVAS_ID
                  ? "Divas"
                  : "Loading..."
              }
              disabled
              className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
            />
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

          {/* MEET TIME */}
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

          {/* NOTES */}
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

            {/* 🔥 NOW PINK */}
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold"
            >
              {loading ? "Saving..." : "Add Training"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
