"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddTournamentPage() {
  const router = useRouter();

  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    teamId: "",
    title: "",
    date: "",
    time: "",
    location: "",
    kit: "Pink",
    meetTime: "",
    notes: "",
  });

  const [poster, setPoster] = useState<File | null>(null);

  const [extraPlayers, setExtraPlayers] = useState<
    { name: string; position: string }[]
  >([]);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    const res = await fetch("/api/teams");
    const data = await res.json();
    setTeams(data);
  };

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const addExtraPlayer = () => {
    setExtraPlayers([
      ...extraPlayers,
      { name: "", position: "" },
    ]);
  };

  const updateExtra = (
    index: number,
    key: string,
    value: string
  ) => {
    const copy = [...extraPlayers];
    copy[index][key as "name" | "position"] = value;
    setExtraPlayers(copy);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // NOTE:
    // For now we send poster name only.
    // Later we can wire real upload (Cloudinary).
    const res = await fetch("/api/tournaments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        poster: poster?.name || null,
        extraPlayers,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Tournament added!");
      router.push("/coach");
      router.refresh();
    } else {
      alert("Error adding tournament");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[520px] max-h-[92vh] overflow-y-auto rounded-xl shadow-xl p-6">

        <h2 className="text-xl font-bold mb-4">
          Add Tournament Fixture
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TEAM */}
          <div>
            <label className="text-sm font-semibold">Team</label>
            <select
              className="w-full border rounded-lg p-2 mt-1"
              value={form.teamId}
              onChange={(e) => update("teamId", e.target.value)}
              required
            >
              <option value="">Select a team</option>
              {teams.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* TOURNAMENT NAME */}
          <div>
            <label className="text-sm font-semibold">
              Tournament / Opponent
            </label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="e.g. Spring Cup 2026"
              onChange={(e) => update("title", e.target.value)}
              required
            />
          </div>

          {/* DATE + TIME */}
          <div className="flex gap-3">
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
              <label className="text-sm font-semibold">
                Kick-off Time
              </label>
              <input
                type="time"
                className="w-full border rounded-lg p-2 mt-1"
                onChange={(e) => update("time", e.target.value)}
              />
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <label className="text-sm font-semibold">Location</label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Venue address"
              onChange={(e) => update("location", e.target.value)}
              required
            />
          </div>

          {/* KIT */}
          <div>
            <label className="text-sm font-semibold">Kit</label>
            <select
              className="w-full border rounded-lg p-2 mt-1"
              onChange={(e) => update("kit", e.target.value)}
            >
              <option>Pink</option>
              <option>Black</option>
              <option>White</option>
            </select>
          </div>

          {/* MEET TIME */}
          <div>
            <label className="text-sm font-semibold">
              Meet Time (optional)
            </label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="e.g. 9:30 AM"
              onChange={(e) => update("meetTime", e.target.value)}
            />
          </div>

          {/* POSTER IMAGE */}
          <div>
            <label className="text-sm font-semibold">
              Poster Image (optional)
            </label>
            <input
              type="file"
              className="w-full border rounded-lg p-2 mt-1"
              onChange={(e) =>
                setPoster(e.target.files?.[0] || null)
              }
            />
          </div>

          {/* EXTRA PLAYERS */}
          <div>
            <label className="text-sm font-semibold">
              Add Extra Players (optional)
            </label>

            {extraPlayers.map((p, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <input
                  className="flex-1 border rounded-lg p-2"
                  placeholder="Player name"
                  onChange={(e) =>
                    updateExtra(i, "name", e.target.value)
                  }
                />
                <input
                  className="flex-1 border rounded-lg p-2"
                  placeholder="Position"
                  onChange={(e) =>
                    updateExtra(i, "position", e.target.value)
                  }
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addExtraPlayer}
              className="mt-2 px-3 py-1 bg-pink-500 text-white rounded"
            >
              +
            </button>
          </div>

          {/* NOTES */}
          <div>
            <label className="text-sm font-semibold">
              Notes (optional)
            </label>
            <textarea
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Any additional information..."
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/coach")}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-pink-500 text-white rounded-lg font-semibold"
            >
              {loading ? "Saving..." : "Add Tournament"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
