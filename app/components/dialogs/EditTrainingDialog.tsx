"use client";

import { useEffect, useState } from "react";
import Modal from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function EditTrainingDialog({
  session,
  open,
  onClose,
  onSaved,
}: {
  session: any;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();

  const DYNOS_ID = "cmlp8lhno00004lay76ixxb2n";
  const DIVAS_ID = "cmlp8lji200014lays2jfga30";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    teamId: "",
    title: "",
    meetTime: "",
    date: "",
    time: "",
    location: "",
    notes: "",
  });

  // Populate form when dialog opens
  useEffect(() => {
    if (!session) return;

    const d = new Date(session.date);

    setForm({
      teamId: session.teamId || "",
      title: session.title || "",
      meetTime: session.meetTime || "",
      date: d.toISOString().slice(0, 10),
      time: session.time || "",
      location: session.location || "",
      notes: session.notes || "",
    });
  }, [session]);

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    setError("");
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const combinedDateTime = new Date(`${form.date}T${form.time}`);

    const res = await fetch(`/api/sessions/${session.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        opponent: "",
        type: "TRAINING",
        location: form.location,
        date: combinedDateTime,
        time: form.time,
        kit: "",
        teamId: form.teamId,
        meetTime: form.meetTime,
        notes: form.notes,
      }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Training updated successfully!");
      onSaved();
    } else {
      setError("Failed to update training");
      toast.error("Update failed");
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Edit Training</h2>

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
            <option value={DYNOS_ID}>Dynos</option>
            <option value={DIVAS_ID}>Divas</option>
          </select>
        </div>

        {/* TITLE */}
        <div>
          <label className="text-sm font-semibold">Training Title</label>
          <input
            className="w-full border rounded-lg p-2 mt-1"
            placeholder="Fitness / Shooting / Passing"
            value={form.title}
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
            <label className="text-sm font-semibold">Start Time</label>
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
            placeholder="Training ground"
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
            placeholder="Bring water, cones, etc..."
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        {/* ACTIONS */}
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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
