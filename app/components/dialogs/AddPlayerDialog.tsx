"use client";

import { useState, useEffect } from "react";
import Modal from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function AddPlayerDialog({
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

  const [parents, setParents] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    number: "",
    position: "",
    teamId: "",
    parentId: "",
  });

  const [showParentModal, setShowParentModal] = useState(false);
  const [newParent, setNewParent] = useState({
    name: "",
    email: "",
  });

  // preload team
  useEffect(() => {
    if (teamId) {
      setForm((prev) => ({ ...prev, teamId }));
    }
  }, [teamId]);

  const loadTeams = async () => {
    const res = await fetch("/api/teams");
    if (res.ok) setTeams(await res.json());
  };

  const loadParents = async () => {
    const res = await fetch("/api/parents");
    if (res.ok) setParents(await res.json());
  };

  useEffect(() => {
    if (open) {
      loadTeams();
      loadParents();
    }
  }, [open]);

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    setError("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.teamId || !form.parentId) {
      setError("Please select both a team and a parent");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        number: Number(form.number) || null,
        position: form.position || null,
        teamId: form.teamId,
        parentId: form.parentId,
      }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Player added successfully!");

      onCreated?.();
      onClose();

      setForm({
        name: "",
        number: "",
        position: "",
        teamId: teamId || "",
        parentId: "",
      });
    } else {
      setError("Failed to add player");
      toast.error("Failed to add player");
    }
  };

  const handleAddParent = async () => {
    if (!newParent.name || !newParent.email) return;

    const res = await fetch("/api/parents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newParent),
    });

    if (res.ok) {
      const created = await res.json();
      await loadParents();
      setForm((prev) => ({ ...prev, parentId: created.id }));
      setShowParentModal(false);
      setNewParent({ name: "", email: "" });

      toast.success("Parent added");
    } else {
      toast.error("Failed to add parent");
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} size="md">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-pink-600">
            Add Player
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
          <input
            className="w-full border rounded-lg p-2"
            placeholder="Player name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />

          <input
            type="number"
            className="w-full border rounded-lg p-2"
            placeholder="Shirt Number"
            value={form.number}
            onChange={(e) => update("number", e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-2"
            placeholder="Position"
            value={form.position}
            onChange={(e) => update("position", e.target.value)}
          />

          <select
            className="w-full border rounded-lg p-2"
            value={form.teamId}
            onChange={(e) => update("teamId", e.target.value)}
            required
          >
            <option value="">Select team</option>
            {teams.map((team: any) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold">Parent</label>
              <button
                type="button"
                onClick={() => setShowParentModal(true)}
                className="text-xs text-pink-600 font-semibold hover:underline"
              >
                + Add Parent
              </button>
            </div>

            <select
              className="w-full border rounded-lg p-2 mt-1"
              value={form.parentId}
              onChange={(e) => update("parentId", e.target.value)}
              required
            >
              <option value="">Select parent</option>
              {parents.map((parent: any) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name}
                </option>
              ))}
            </select>
          </div>

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
              {loading ? "Saving..." : "Add Player"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Nested Add Parent */}
      <Modal
        open={showParentModal}
        onClose={() => setShowParentModal(false)}
        size="sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-pink-600">
            Add Parent
          </h3>

          <button
            onClick={() => setShowParentModal(false)}
            className="text-zinc-400 hover:text-zinc-700 text-xl font-semibold"
          >
            ×
          </button>
        </div>

        <input
          className="w-full border rounded-lg p-2 mb-3"
          placeholder="Parent name"
          value={newParent.name}
          onChange={(e) =>
            setNewParent({ ...newParent, name: e.target.value })
          }
        />

        <input
          className="w-full border rounded-lg p-2"
          placeholder="Email"
          value={newParent.email}
          onChange={(e) =>
            setNewParent({ ...newParent, email: e.target.value })
          }
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setShowParentModal(false)}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleAddParent}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold"
          >
            Save Parent
          </button>
        </div>
      </Modal>
    </>
  );
}
