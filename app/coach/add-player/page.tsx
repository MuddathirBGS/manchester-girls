"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPlayerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    number: "",
    position: "",
    teamId: "",
    parentId: "parent-demo", // temp placeholder
  });

  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        number: Number(form.number),
        position: form.position,
        teamId: form.teamId,
        parentId: form.parentId,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Player added!");
      router.push("/roster");
      router.refresh();
    } else {
      alert("Error adding player");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/40">
      <div className="bg-white w-[420px] rounded-xl shadow-xl p-6">

        <h2 className="text-xl font-bold mb-4">Add Player</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-sm font-semibold">Name</label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Player name"
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>

          {/* NUMBER */}
          <div>
            <label className="text-sm font-semibold">Shirt Number</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="7"
              onChange={(e) => update("number", e.target.value)}
            />
          </div>

          {/* POSITION */}
          <div>
            <label className="text-sm font-semibold">Position</label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Striker / Defender / Midfielder"
              onChange={(e) => update("position", e.target.value)}
            />
          </div>

          {/* TEAM */}
          <div>
            <label className="text-sm font-semibold">Team</label>
            <select
              className="w-full border rounded-lg p-2 mt-1"
              onChange={(e) => update("teamId", e.target.value)}
              required
            >
              <option value="">Select team</option>
              <option value="dynos">Dynos - U9</option>
              <option value="divas">Divas - U9</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => router.push("/roster")}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-pink-500 text-white rounded-lg font-semibold"
            >
              {loading ? "Saving..." : "Add Player"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
