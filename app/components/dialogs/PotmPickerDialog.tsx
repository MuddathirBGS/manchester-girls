"use client";

import { useEffect, useState } from "react";
import Modal from "@/app/components/ui/Modal";

export default function PotmPickerDialog({
  open,
  onClose,
  sessionId,
  type,
  players,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  sessionId: string;
  type: "coach" | "parent";
  players: any[];
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const selectPlayer = async (playerId: string) => {
    setLoading(true);

    await fetch(`/api/sessions/${sessionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [type === "coach" ? "coachPotmId" : "parentPotmId"]: playerId,
      }),
    });

    setLoading(false);
    onSaved();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <h2 className="text-xl font-bold mb-4">
        {type === "coach" ? "Select Coach POTM" : "Select Parent POTM"}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {players.map((p) => (
          <button
            key={p.id}
            disabled={loading}
            onClick={() => selectPlayer(p.id)}
            className="p-3 border rounded-xl hover:bg-pink-50 font-semibold"
          >
            {p.name}
          </button>
        ))}
      </div>
    </Modal>
  );
}
