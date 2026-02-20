"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CoachSubNav from "../../components/CoachSubNav";

const DYNOS_ID = "cmltjiw8a0000396i44vrndkn";
const DIVAS_ID = "cmltjixjz0001396i0ybecwvr";

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
      setShowCodes({});

      const res = await fetch(`/api/players?teamId=${teamId}`);
      const data = await res.json();

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
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">

      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* PAGE HEADER */}
        <div className="mb-10">
          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
              Player Codes
              <span className="block text-pink-500 text-lg font-medium mt-2">
                Secure Player Login Access
              </span>
            </h1>

            <p className="text-base text-zinc-500 max-w-xl">
              Manage and share login codes for players and parents.
            </p>
          </div>

          <div className="mt-8 border-t border-pink-200" />

          <div className="mt-6">
            <CoachSubNav teamId={teamId} />
          </div>
        </div>

        {/* SHARE BOX */}
        <div className="bg-white border border-pink-200 rounded-xl p-6 shadow-md">
          <div className="font-semibold mb-2 text-lg text-zinc-900">
            Player Login Link
          </div>

          <p className="text-sm text-zinc-600 mb-4">
            Share this link with parents and players so they can access their
            account anytime.
          </p>

          <button
            onClick={() => copy(`${window.location.origin}/login`)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-lg font-semibold transition"
          >
            Copy Login Link
          </button>
        </div>

        {/* TEAM SELECT */}
        <div>
          <div className="font-semibold mb-3 text-zinc-900">
            Select Team
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setTeamId(DYNOS_ID)}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                teamId === DYNOS_ID
                  ? "bg-pink-500 text-white shadow-md"
                  : "bg-white border border-pink-200 text-zinc-700 hover:bg-pink-50"
              }`}
            >
              Dynos (U9)
            </button>

            <button
              onClick={() => setTeamId(DIVAS_ID)}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                teamId === DIVAS_ID
                  ? "bg-pink-500 text-white shadow-md"
                  : "bg-white border border-pink-200 text-zinc-700 hover:bg-pink-50"
              }`}
            >
              Divas (U9)
            </button>
          </div>
        </div>

        {/* PLAYER TABLE */}
        <div className="bg-white rounded-xl shadow-md border border-pink-200 overflow-hidden">

          {/* TABLE HEADER */}
          <div className="grid grid-cols-3 bg-pink-500 text-white font-semibold px-6 py-4 text-sm">
            <div>Player</div>
            <div>Login Code</div>
            <div>Actions</div>
          </div>

          {loading && (
            <div className="p-6 text-zinc-500">
              Loading players...
            </div>
          )}

          {!loading && players.length === 0 && (
            <div className="p-6 text-zinc-500">
              No players in this team yet.
            </div>
          )}

          {players.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-3 items-center px-6 py-4 border-t border-pink-100 hover:bg-pink-50 transition"
            >
              <div>
                <div className="font-semibold text-zinc-900">
                  {p.name}
                </div>
                <div className="text-xs text-pink-500">
                  #{p.number}
                </div>
              </div>

              <div className="font-mono bg-pink-50 border border-pink-200 px-3 py-2 rounded-lg w-fit">
                {showCodes[p.id] ? p.loginCode : "••••••"}
              </div>

              <div className="flex gap-4 text-lg">
                <button onClick={() => toggleShow(p.id)}>
                  👁
                </button>

                <button onClick={() => copy(p.loginCode)}>
                  📋
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* HELP BOX */}
        <div className="bg-pink-50 border border-pink-200 p-6 rounded-xl">
          <div className="font-semibold mb-2 text-zinc-900">
            How it works
          </div>
          <ul className="text-sm text-zinc-700 space-y-1">
            <li>• Share the login link with parents</li>
            <li>• Players enter their personal code</li>
            <li>• Use 👁 to show/hide codes</li>
            <li>• Use 📋 to copy codes quickly</li>
          </ul>
        </div>

      </div>
    </div>
  );
}