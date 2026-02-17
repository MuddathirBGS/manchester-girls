"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FeedbackEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const playerId = params.id;

  const [form, setForm] = useState({
    strengths: "",
    improve: "",
    coachNote: "",
  });

  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const save = async () => {
    setLoading(true);

    await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerId,
        strengths: form.strengths,
        improve: form.improve,
        coachNote: form.coachNote,
      }),
    });

    setLoading(false);
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">

        <h1 className="text-2xl font-bold mb-6">Coach Feedback</h1>

        <div className="space-y-4">

          <div>
            <label className="font-semibold text-sm">Strengths</label>
            <textarea
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="What is the player doing well?"
              onChange={(e) => update("strengths", e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-sm">Needs Improvement</label>
            <textarea
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="What should they work on?"
              onChange={(e) => update("improve", e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-sm">Coach Notes</label>
            <textarea
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Extra notes..."
              onChange={(e) => update("coachNote", e.target.value)}
            />
          </div>

          <button
            onClick={save}
            disabled={loading}
            className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Saving..." : "Save Feedback"}
          </button>

        </div>
      </div>
    </div>
  );
}
