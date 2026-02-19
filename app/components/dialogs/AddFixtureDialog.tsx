"use client";

import { useState, useEffect } from "react";
import Modal from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function AddFixtureDialog({
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
    type: "MATCH",
    opponent: "",
    kit: "Pink",
    meetTime: "",
    date: "",
    time: "",
    location: "",
    notes: "",
  });

  /* ===============================
     LOAD TEAMS (ONLY WHEN OPENING)
  =============================== */
  useEffect(() => {
    if (!open) return;

    const loadTeams = async () => {
      try {
        const res = await fetch("/api/teams");
        const data = await res.json();
        setTeams(data);

        // Only set default if not already selected
        setForm((prev) => {
          if (prev.teamId) return prev;

          if (teamId) {
            return { ...prev, teamId };
          }

          if (data.length > 0) {
            return { ...prev, teamId: data[0].id };
          }

          return prev;
        });
      } catch (err) {
        console.error("LOAD TEAMS ERROR:", err);
      }
    };

    loadTeams();
  }, [open]);

  /* ===============================
     UPDATE FIELD
  =============================== */
  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const combinedDateTime = new Date(`${form.date}T${form.time}`);

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
          date: combinedDateTime,
          time: form.time,
          kit: form.kit,
          teamId: form.teamId,
          meetTime: form.meetTime,
          notes: form.notes,
        }),
      });

      setLoading(false);

      if (res.ok) {
        toast.success("Fixture added successfully!");
        onCreated?.();
        onClose();

        // Reset form but KEEP selected team
        setForm((prev) => ({
          ...prev,
          type: "MATCH",
          opponent: "",
          kit: "Pink",
          meetTime: "",
          date: "",
          time: "",
          location: "",
          notes: "",
        }));
      } else {
        setError("Failed to add fixture");
        toast.error("Failed to add fixture");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong");
      toast.error("Something went wrong");
      console.error("SUBMIT ERROR:", err);
    }
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Add Fixture</h2>
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

        {/* TEAM SELECTOR */}
        <div>
          <label className="text-sm font-semibold">Team</label>
          <select
            className="w-full border rounded-lg p-2 mt-1"
            value={form.teamId}
            onChange={(e) => update("teamId", e.target.value)}
            required
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* TYPE */}
        <div>
          <label className="text-sm font-semibold">Fixture Type</label>
          <select
            className="w-full border rounded-lg p-2 mt-1"
            value={form.type}
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
            value={form.opponent}
            onChange={(e) => update("opponent", e.target.value)}
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
            <option>Training</option>
          </select>
        </div>

        {/* MEET TIME */}
        <div>
          <label className="text-sm font-semibold">Meet Time</label>
          <input
            className="w-full border rounded-lg p-2 mt-1"
            placeholder="9:30 AM"
            value={form.meetTime}
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
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              required
            />
          </div>

          <div className="flex-1">
            <label className="text-sm font-semibold">Kick-off Time</label>
            <input
              type="time"
              className="w-full border rounded-lg p-2 mt-1"
              value={form.time}
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
            value={form.location}
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
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold shadow transition"
          >
            {loading ? "Saving..." : "Add Fixture"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
