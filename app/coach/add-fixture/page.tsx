"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddFixturePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamIdFromUrl = searchParams.get("teamId");

  const [teamName, setTeamName] = useState("Loading...");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    teamId: "",
    type: "MATCH",
    opponent: "",
    kit: "Pink",
    meetTime: "",
    date: "",
    time: "",
    location: "",
    notes: "",
  });

  // Set teamId from URL
  useEffect(() => {
    if (teamIdFromUrl) {
      setForm((prev) => ({ ...prev, teamId: teamIdFromUrl }));
    }
  }, [teamIdFromUrl]);

  // 🔥 Fetch team name from DB
  useEffect(() => {
    const loadTeam = async () => {
      if (!teamIdFromUrl) return;

      const res = await fetch(`/api/teams`);
      const teams = await res.json();

      const team = teams.find((t: any) => t.id === teamIdFromUrl);
      if (team) setTeamName(team.name);
    };

    loadTeam();
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
        title: `vs ${form.opponent}`,
        opponent: form.opponent,
        type: form.type,
        location: form.location,
        date: form.date,
        time: form.time,
        kit: form.kit,
        teamId: form.teamId,
        meetTime: form.meetTime,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Fixture added successfully!");
      router.push("/coach");
      router.refresh();
    } else {
      alert("Error adding fixture");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/40">
      <div className="bg-white w-[420px] rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">Add Fixture</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TEAM */}
          <div>
            <label className="text-sm font-semibold">Team</label>
            <input
              value={teamName}
              disabled
              className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="text-sm font-semibold">Fixture Type</label>
            <select
              className="w-full border rounded-lg p-2 mt-1"
              onChange={(e) => update("type", e.target.value)}
            >
              <option value="MATCH">League</option>
              <option value="FRIENDLY">Friendly</option>
              <option value="TOURNAMENT">Tournament</option>
            </select>
          </div>

          {/* OPPONENT */}
          <div>
            <label className="text-sm font-semibold">Opponent</label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="e.g. City Girls FC"
              onChange={(e) => update("opponent", e.target.value)}
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
            <label className="text-sm font-semibold">Meet Time</label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="9:30 AM"
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
              <label className="text-sm font-semibold">Kick-off Time</label>
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
              placeholder="Venue address"
              onChange={(e) => update("location", e.target.value)}
              required
            />
          </div>

          {/* NOTES */}
          <div>
            <label className="text-sm font-semibold">Notes</label>
            <textarea
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Any additional info..."
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>

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
              className="px-5 py-2 bg-pink-500 text-white rounded-lg font-semibold"
            >
              {loading ? "Saving..." : "Add Fixture"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
