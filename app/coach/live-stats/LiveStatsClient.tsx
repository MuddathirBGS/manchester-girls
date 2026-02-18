"use client";

import { useState } from "react";
import TeamSelector from "./TeamSelector";

export default function LiveStatsClient({
  players,
  sessions,
  selectedSession,
  teamId,
  DYNOS_ID,
  DIVAS_ID,
}: any) {
  const [openId, setOpenId] = useState(selectedSession?.id || null);

  // store scores PER FIXTURE
  const [scores, setScores] = useState(() => {
    const map: any = {};
    sessions.forEach((s: any) => {
      map[s.id] = {
        team: s.teamScore || 0,
        opp: s.opponentScore || 0,
      };
    });
    return map;
  });

  const updateOpponent = async (sessionId: string, type: "plus" | "minus") => {
    const route =
      type === "plus"
        ? "/api/live/opponent-plus"
        : "/api/live/opponent-minus";

    await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    setScores((prev: any) => ({
      ...prev,
      [sessionId]: {
        ...prev[sessionId],
        opp:
          type === "plus"
            ? prev[sessionId].opp + 1
            : Math.max(prev[sessionId].opp - 1, 0),
      },
    }));
  };

  const updateGoal = async (
    sessionId: string,
    playerId: string,
    type: "add" | "remove"
  ) => {
    const route =
      type === "add"
        ? "/api/live/goals"
        : "/api/live/remove-goal";

    await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerId }),
    });

    setScores((prev: any) => ({
      ...prev,
      [sessionId]: {
        ...prev[sessionId],
        team:
          type === "add"
            ? prev[sessionId].team + 1
            : Math.max(prev[sessionId].team - 1, 0),
      },
    }));
  };

  const updateStat = async (
    route: string,
    playerId: string
  ) => {
    await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerId }),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">⚡ Live Match Mode</h1>

        {/* TEAM SELECT */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm font-semibold mb-2">Select Team</div>

          <TeamSelector
            teamId={teamId}
            DYNOS_ID={DYNOS_ID}
            DIVAS_ID={DIVAS_ID}
          />
        </div>

        {/* FIXTURE LIST */}
        <div className="space-y-4">
          {sessions.map((s: any) => {
            const isOpen = openId === s.id;
            const score = scores[s.id];

            return (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-pink-200 shadow"
              >
                {/* HEADER */}
                <div
                  onClick={() => setOpenId(isOpen ? null : s.id)}
                  className="cursor-pointer p-4 flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-xs text-zinc-500">
                      {new Date(s.date).toLocaleDateString()} • {s.location}
                    </div>
                  </div>

                  <div className="text-xl font-bold text-pink-600">
                    {score.team} - {score.opp}
                  </div>
                </div>

                {/* DROPDOWN */}
                {isOpen && (
                  <div className="p-5 border-t space-y-6">
                    {/* LIVE SCORE */}
                    <div className="bg-zinc-100 rounded-xl p-5 text-center">
                      <div className="text-xs text-zinc-500 mb-2">
                        LIVE SCORE
                      </div>

                      <div className="flex justify-center items-center gap-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateGoal(s.id, "", "remove")
                            }
                            className="w-10 h-10 bg-zinc-200 rounded-lg text-lg font-bold"
                          >
                            −
                          </button>

                          <div className="text-4xl font-extrabold text-pink-600">
                            {score.team}
                          </div>

                          <button
                            onClick={() =>
                              updateGoal(s.id, "", "add")
                            }
                            className="w-10 h-10 bg-pink-500 text-white rounded-lg text-lg font-bold"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-2xl">-</div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateOpponent(s.id, "minus")
                            }
                            className="w-10 h-10 bg-zinc-200 rounded-lg text-lg font-bold"
                          >
                            −
                          </button>

                          <div className="text-4xl font-extrabold text-blue-900">
                            {score.opp}
                          </div>

                          <button
                            onClick={() =>
                              updateOpponent(s.id, "plus")
                            }
                            className="w-10 h-10 bg-pink-500 text-white rounded-lg text-lg font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* PLAYERS */}
                    <div className="space-y-4">
                      {players.map((p: any) => (
                        <div
                          key={p.id}
                          className="bg-white border border-pink-200 rounded-xl p-4 shadow-sm"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src="https://i.pravatar.cc/60"
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <div className="font-semibold">{p.name}</div>
                              <div className="text-xs text-zinc-500">
                                #{p.number || "?"}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <button
                              onClick={() =>
                                updateGoal(s.id, p.id, "add")
                              }
                              className="py-3 bg-pink-500 text-white rounded-lg font-semibold"
                            >
                              Goal
                            </button>

                            <button
                              onClick={() =>
                                updateStat("/api/live/assists", p.id)
                              }
                              className="py-3 bg-purple-600 text-white rounded-lg font-semibold"
                            >
                              Assist
                            </button>

                            <button
                              onClick={() =>
                                updateStat("/api/live/saves", p.id)
                              }
                              className="py-3 bg-green-600 text-white rounded-lg font-semibold"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
