"use client";

import { useEffect, useState } from "react";
import Modal from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function EditFixtureDialog({
  fixture,
  open,
  onClose,
  onSaved,
}: {
  fixture: any;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: "",
    teamId: "",
    opponent: "",
    type: "MATCH",
    kit: "Pink",
    meetTime: "",
    date: "",
    time: "",
    location: "",
    notes: "",
  });

  // Load teams + populate form
  useEffect(() => {
    if (!fixture || !open) return;

    const load = async () => {
      const res = await fetch("/api/teams");
      const t = await res.json();
      setTeams(t);

      const d = new Date(fixture.date);

      setForm({
        id: fixture.id, // 🔥 store the ID here
        teamId: fixture.teamId || "",
        opponent: fixture.opponent || "",
        type: fixture.type || "MATCH",
        kit: fixture.kit || "Pink",
        meetTime: fixture.meetTime || "",
        date: d.toISOString().slice(0, 10),
        time: fixture.time || "",
        location: fixture.location || "",
        notes: fixture.notes || "",
      });
    };

    load();
  }, [fixture, open]);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSave = async (e: any) => {
    e.preventDefault();

    if (!form.id) {
      setError("Missing fixture id");
      toast.error("Missing fixture id");
      return;
    }

    setLoading(true);

    const combinedDateTime = new Date(`${form.date}T${form.time}`);

    const res = await fetch(`/api/sessions/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
      toast.success("Fixture updated");
      onSaved();
    } else {
      setError("Failed to update fixture");
      toast.error("Update failed");
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Edit Fixture</h2>
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

      <form onSubmit={handleSave} className="space-y-4">
        {/* TEAM */}
        <div>
          <label className="text-sm font-semibold">Team</label>
          <select
            className="w-full border rounded-lg p-2 mt-1"
            value={form.teamId}
            onChange={(e) => update("teamId", e.target.value)}
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
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        {/* SAVE */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-pink-500 text-white rounded-lg font-semibold"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
