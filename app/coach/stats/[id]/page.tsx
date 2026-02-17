"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AddStatsPage() {
  const router = useRouter();
  const params = useParams();
  const playerId = params.id as string;

  const [player, setPlayer] = useState<any>(null);

  const [form, setForm] = useState({
    goals: 0,
    assists: 0,
    saves: 0,
  });

  useEffect(() => {
    fetch(`/api/players/${playerId}`)
      .then(res => res.json())
      .then(setPlayer);
  }, [playerId]);

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: Number(value) });
  };

  const save = async () => {
    await fetch("/api/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerId,
        ...form,
      }),
    });

    alert("Stats saved!");
    router.push("/roster");
  };

  if (!player) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/40">
      <div className="bg-white w-[420px] rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">
          Add Stats — {player.name}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Goals</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              onChange={(e) => update("goals", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Assists</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              onChange={(e) => update("assists", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Saves</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              onChange={(e) => update("saves", e.target.value)}
            />
          </div>

          <button
            onClick={save}
            className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold"
          >
            Save Stats
          </button>
        </div>
      </div>
    </div>
  );
}
