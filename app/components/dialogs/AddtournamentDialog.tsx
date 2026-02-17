"use client";

import { useState, useEffect } from "react";
import Modal from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function AddTournamentDialog({
  open,
  onClose,
  teamId,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  teamId?: string;
  onCreated?: () => void;
}) {
  const toast = useToast();

  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // 🔥 PRELOAD TEAM (same as AddPlayerDialog)
  useEffect(() => {
    if (teamId) {
      setForm((prev) => ({ ...prev, teamId }));
    }
  }, [teamId]);

  useEffect(() => {
    if (open) loadTeams();
  }, [open]);

  const loadTeams = async () => {
    const res = await fetch("/api/teams");
    const data = await res.json();
    setTeams(data);
  };

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    setError("");
  };

  const addExtraPlayer = () => {
    setExtraPlayers([...extraPlayers, { name: "", position: "" }]);
  };

  const updateExtra = (index: number, key: string, value: string) => {
    const copy = [...extraPlayers];
    copy[index][key as "name" | "position"] = value;
    setExtraPlayers(copy);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
      toast.success("Tournament added successfully!");

      onCreated?.();
      onClose();

      setForm({
        teamId: teamId || "",
        title: "",
        date: "",
        time: "",
        location: "",
        kit: "Pink",
        meetTime: "",
        notes: "",
      });
      setPoster(null);
      setExtraPlayers([]);
    } else {
      setError("Failed to add tournament");
      toast.error("Failed to add tournament");
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="xl">
      <div className="max-h-[85vh] overflow-y-auto pr-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-pink-600">
            Add Tournament Fixture
          </h2>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 text-xl font-semibold"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm bg-red-100 text-red-700 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

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

          {/* TITLE */}
          <div>
            <label className="text-sm font-semibold">
              Tournament / Opponent
            </label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="e.g. Spring Cup 2026"
              value={form.title}
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
                value={form.date}
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
                value={form.time}
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
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              required
            />
          </div>

          {/* KIT */}
          <div>
            <label className="text-sm font-semibold">Kit</label>
            <select
              className="w-full border rounded-lg p-2 mt-1"
              value={form.kit}
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
              value={form.meetTime}
              onChange={(e) => update("meetTime", e.target.value)}
            />
          </div>

          {/* POSTER */}
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
                  value={p.name}
                  onChange={(e) =>
                    updateExtra(i, "name", e.target.value)
                  }
                />
                <input
                  className="flex-1 border rounded-lg p-2"
                  placeholder="Position"
                  value={p.position}
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
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold shadow transition"
            >
              {loading ? "Saving..." : "Add Tournament"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
