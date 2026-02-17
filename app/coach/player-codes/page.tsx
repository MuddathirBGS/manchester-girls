"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const DYNOS_ID = "cmlp8lhno00004lay76ixxb2n";
const DIVAS_ID = "cmlp8lji200014lays2jfga30";

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function PlayerCodesPage() {
  const [teamId, setTeamId] = useState<string>(DYNOS_ID);
  const [players, setPlayers] = useState<any[]>([]);
  const [showCodes, setShowCodes] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamId) return;

    const loadPlayers = async () => {
      setLoading(true);
      setPlayers([]);
      setShowCodes({}); // reset when switching teams

      const res = await fetch(`/api/players?teamId=${teamId}`);
      const data = await res.json();

      // Ensure every player has a login code
      const updated = await Promise.all(
        data.map(async (p: any) => {
          if (!p.loginCode) {
            const code = generateCode();

            await fetch(`/api/players/${p.id}/code`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code }),
            });

            return { ...p, loginCode: code };
          }
          return p;
        })
      );

      setPlayers(updated);
      setLoading(false);
    };

    loadPlayers();
  }, [teamId]);

  const toggleShow = (id: string) => {
    setShowCodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white p-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <Link href="/coach">
          <div className="mb-6 text-sm text-pink-600 cursor-pointer">
            ← Back
          </div>
        </Link>

        <h1 className="text-3xl font-bold mb-2">Player Codes</h1>
        <p className="text-zinc-600 mb-6">
          Manage login codes for your players
        </p>

        {/* SHARE BOX */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-8">
          <div className="font-semibold mb-2">Share Player Login Link</div>
          <p className="text-sm text-zinc-600 mb-4">
            Give this link to parents and players. They can bookmark it and use
            it anytime to log in.
          </p>

          <button
            onClick={() => copy(`${window.location.origin}/login`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Copy Login Link
          </button>
        </div>

        {/* TEAM SELECT */}
        <div className="mb-6">
          <div className="font-semibold mb-3">Select Team</div>

          <div className="flex gap-3">
            <button
              onClick={() => setTeamId(DYNOS_ID)}
              className={`px-4 py-2 rounded-lg font-semibold border ${
                teamId === DYNOS_ID
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white"
              }`}
            >
              Dynos - U9
            </button>

            <button
              onClick={() => setTeamId(DIVAS_ID)}
              className={`px-4 py-2 rounded-lg font-semibold border ${
                teamId === DIVAS_ID
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white"
              }`}
            >
              Divas - U9
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <div className="grid grid-cols-3 bg-gradient-to-r from-pink-500 to-pink-700 text-white font-semibold p-4">
            <div>Player Name</div>
            <div>Code</div>
            <div>Actions</div>
          </div>

          {loading && (
            <div className="p-6 text-zinc-500">Loading players...</div>
          )}

          {!loading && players.length === 0 && (
            <div className="p-6 text-zinc-500">No players in this team yet.</div>
          )}

          {players.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-3 items-center p-4 border-t"
            >
              {/* PLAYER */}
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-pink-500">#{p.number}</div>
              </div>

              {/* CODE */}
              <div className="font-mono bg-zinc-100 px-3 py-1 rounded w-fit">
                {showCodes[p.id] ? p.loginCode : "••••••"}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4">
                <button
                  onClick={() => toggleShow(p.id)}
                  className="text-zinc-600"
                >
                  👁
                </button>

                <button
                  onClick={() => copy(p.loginCode)}
                  className="text-zinc-600"
                >
                  📋
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* HELP BOX */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mt-8">
          <div className="font-semibold mb-2">How to use:</div>
          <ul className="text-sm text-zinc-700 space-y-1">
            <li>• Share the login link with parents and players</li>
            <li>• Players enter their personal code to log in</li>
            <li>• Click the eye icon to show/hide codes</li>
            <li>• Click the copy icon to copy a code</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
