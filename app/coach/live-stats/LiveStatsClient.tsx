"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CoachSubNav from "@/app/components/CoachSubNav";

export default function LiveStatsClient({
  players,
  sessions,
  teamId,
  DYNOS_ID,
  DIVAS_ID,
}: any) {
  const router = useRouter();
  const now = new Date();

  const [openMatch, setOpenMatch] = useState<string | null>(null);
  const [scores, setScores] = useState<
    Record<string, { team: number; opp: number }>
  >({});
  const [loadingEvent, setLoadingEvent] = useState<string | null>(null);

  const sorted = [...sessions].sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const isPast = (date: string) =>
    new Date(date).getTime() < now.getTime();

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(
      d.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  useEffect(() => {
    const map: Record<string, { team: number; opp: number }> = {};
    sessions.forEach((s: any) => {
      map[s.id] = {
        team: s.teamScore ?? 0,
        opp: s.opponentScore ?? 0,
      };
    });
    setScores(map);
  }, [sessions]);

  const updateOpponent = async (
    sessionId: string,
    type: "plus" | "minus"
  ) => {
    const route =
      type === "plus"
        ? "/api/live/opponent-plus"
        : "/api/live/opponent-minus";

    await fetch(route, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    setScores((prev) => ({
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

  const updateStat = async (
    sessionId: string,
    playerId: string,
    type: "GOAL" | "ASSIST" | "SAVE"
  ) => {
    const route =
      type === "GOAL"
        ? "/api/live/goals"
        : type === "ASSIST"
        ? "/api/live/assists"
        : "/api/live/saves";

    setLoadingEvent(playerId + type);

    await fetch(route, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, playerId }),
    });

    if (type === "GOAL") {
      setScores((prev) => ({
        ...prev,
        [sessionId]: {
          ...prev[sessionId],
          team: prev[sessionId].team + 1,
        },
      }));
    }

    setLoadingEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">

        {/* HEADER */}
        <div className="mb-12">
          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
              Live Match Mode
              <span className="block text-pink-500 text-lg font-medium mt-2">
                Real-Time Match Control
              </span>
            </h1>

            <p className="text-base text-zinc-500 max-w-xl">
              Update scores and track player performance live.
            </p>
          </div>

          <div className="mt-8 border-t border-pink-200" />

          <div className="mt-6">
            <CoachSubNav teamId={teamId} />
          </div>
        </div>

        {/* TEAM SELECTOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[{ id: DYNOS_ID, name: "Dynos" }, { id: DIVAS_ID, name: "Divas" }].map(team => (
            <Link key={team.id} href={`/coach/live-stats?team=${team.id}`}>
              <div
                className={`cursor-pointer p-6 rounded-xl shadow-md border transition ${
                  teamId === team.id
                    ? "border-pink-500 ring-2 ring-pink-300 bg-white"
                    : "bg-white border-pink-200"
                }`}
              >
                <div className="font-bold text-xl text-zinc-900">
                  {team.name}
                </div>
                <div className="text-sm text-zinc-500">U9</div>
              </div>
            </Link>
          ))}
        </div>

        {/* MATCH GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {sorted.map((s: any) => {
            const past = isPast(s.date);
            const isOpen = openMatch === s.id;

            return (
              <div
                key={s.id}
                className={`rounded-xl border border-pink-200 bg-white overflow-hidden transition ${
                  past ? "opacity-70" : "shadow-md"
                }`}
              >
                <div className="h-2 bg-pink-500" />

                <div className="p-6 flex flex-col gap-6">

                  {/* MATCH INFO */}
                  <div>
                    <h2 className="text-lg font-semibold text-pink-600">
                      {s.title}
                    </h2>
                    <div className="text-sm text-zinc-600 mt-1">
                      📅 {formatDate(s.date)} • {s.time}
                    </div>
                  </div>

                  {/* SCOREBOARD */}
                  <div className="bg-pink-50 border border-pink-200 p-6 rounded-xl">
                    <div className="text-center text-xs font-semibold text-zinc-500 mb-6 tracking-wide">
                      LIVE SCORE
                    </div>

                    <div className="grid grid-cols-3 items-center text-center">
                      <div>
                        <div className="text-xs font-semibold uppercase text-zinc-500 mb-2">
                          Us
                        </div>
                        <div className="text-5xl font-bold text-pink-600">
                          {scores[s.id]?.team ?? 0}
                        </div>
                      </div>

                      <div className="text-4xl font-bold text-zinc-400">
                        -
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase text-zinc-500 mb-2 truncate">
                          {s.opponent}
                        </div>

                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => updateOpponent(s.id, "minus")}
                            className="w-9 h-9 bg-white border border-pink-200 rounded-lg hover:bg-pink-50 transition"
                          >
                            −
                          </button>

                          <div className="text-5xl font-bold text-zinc-900 w-12">
                            {scores[s.id]?.opp ?? 0}
                          </div>

                          <button
                            onClick={() => updateOpponent(s.id, "plus")}
                            className="w-9 h-9 bg-white border border-pink-200 rounded-lg hover:bg-pink-50 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PLAYER TOGGLE */}
                  <div
                    onClick={() => setOpenMatch(isOpen ? null : s.id)}
                    className="flex items-center justify-between bg-pink-50 hover:bg-pink-100 px-4 py-3 rounded-xl cursor-pointer border border-pink-200 transition"
                  >
                    <span className="text-sm font-semibold text-zinc-700">
                      Player List
                    </span>
                    <span className={`transition ${isOpen ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </div>

                  {/* PLAYER LIST */}
                  {isOpen && (
                    <div className="grid gap-4">
                      {players.map((p: any) => (
                        <div
                          key={p.id}
                          className="bg-white border border-pink-200 p-4 rounded-xl shadow-sm"
                        >
                          <div className="flex items-center gap-4">
                            {p.photoUrl ? (
                              <img
                                src={p.photoUrl}
                                className="w-14 h-14 rounded-full object-cover border border-pink-200"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-600">
                                {p.name?.charAt(0)}
                              </div>
                            )}

                            <div>
                              <div className="font-semibold text-zinc-900">
                                {p.name}
                              </div>
                              <div className="text-xs text-zinc-500">
                                #{p.number || "—"}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 mt-4">
                            <button
                              disabled={loadingEvent === p.id + "GOAL"}
                              onClick={() => updateStat(s.id, p.id, "GOAL")}
                              className="bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                            >
                              Goal
                            </button>

                            <button
                              disabled={loadingEvent === p.id + "ASSIST"}
                              onClick={() => updateStat(s.id, p.id, "ASSIST")}
                              className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                            >
                              Assist
                            </button>

                            <button
                              disabled={loadingEvent === p.id + "SAVE"}
                              onClick={() => updateStat(s.id, p.id, "SAVE")}
                              className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}