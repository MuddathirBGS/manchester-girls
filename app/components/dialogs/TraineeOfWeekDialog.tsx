"use client";

import { useState } from "react";
import Modal from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function TraineeOfWeekDialog({
  open,
  onClose,
  sessionId,
  players,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  sessionId: string;
  players: any[];
  onSaved: () => void;
}) {
  const toast = useToast();
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!selected) {
      toast.error("Select a player first");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        traineeOfWeekId: selected,
      }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Trainee of the Week saved");
      onSaved();
      onClose();
    } else {
      toast.error("Failed to save");
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Trainee of the Week</h2>

        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-700 text-xl font-semibold"
        >
          ×
        </button>
      </div>

      {/* PLAYER LIST */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto mb-5">
        {players.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`
              w-full text-left px-4 py-3 rounded-lg border transition
              ${
                selected === p.id
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white hover:bg-pink-50 border-zinc-200"
              }
            `}
          >
            <div className="font-semibold">{p.name}</div>
            <div className="text-xs opacity-80">
              #{p.number || "?"} • {p.position || "Player"}
            </div>
          </button>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
}
