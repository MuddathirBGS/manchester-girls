"use client";

import { useEffect, useState } from "react";

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/sessions");
      const data = await res.json();

      const sorted = data.sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setFixtures(sorted.filter((s: any) => s.type !== "TRAINING"));

      const pRes = await fetch("/api/players");
      const pData = await pRes.json();
      setPlayers(pData);
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-6">
          All Fixtures
        </h1>

        {fixtures.length === 0 && (
          <p className="text-zinc-500">No fixtures added yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fixtures.map((s: any) => (
            <div
              key={s.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-pink-200"
            >
              <div className="h-2 bg-pink-500" />

              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-pink-600">
                    {s.title}
                  </h2>

                  {s.kit && (
                    <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                      {s.kit} KIT
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-600 mb-1">
                  📅 {new Date(s.date).toLocaleDateString()} at {s.time}
                </p>

                <p className="text-sm text-zinc-600 mb-1">
                  📍 {s.location}
                </p>

                <p className="text-sm text-zinc-600 mb-3">
                  👥 0 attending
                </p>

                {/* ATTENDANCE BUTTONS */}
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await fetch("/api/attendance", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          playerId: players[0]?.id,
                          sessionId: s.id,
                          status: "YES",
                        }),
                      });
                      alert("Marked as attending");
                    }}
                    className="flex-1 border-2 border-pink-500 text-pink-500 py-2 rounded-lg text-sm font-semibold hover:bg-pink-50"
                  >
                    ✓ Attending
                  </button>

                  <button
                    onClick={async () => {
                      await fetch("/api/attendance", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          playerId: players[0]?.id,
                          sessionId: s.id,
                          status: "NO",
                        }),
                      });
                      alert("Marked as not attending");
                    }}
                    className="flex-1 border-2 border-pink-500 text-pink-500 py-2 rounded-lg text-sm font-semibold hover:bg-pink-50"
                  >
                    ✕ No
                  </button>

                  <button
                    onClick={async () => {
                      await fetch("/api/attendance", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          playerId: players[0]?.id,
                          sessionId: s.id,
                          status: "MAYBE",
                        }),
                      });
                      alert("Marked as maybe");
                    }}
                    className="flex-1 border-2 border-pink-500 text-pink-500 py-2 rounded-lg text-sm font-semibold hover:bg-pink-50"
                  >
                    ? Maybe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
