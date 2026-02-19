"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CoachSubNav from "@/app/components/CoachSubNav";

export default function LiveStatsClient({
  players,
  sessions,
  selectedSession,
  teamId,
  DYNOS_ID,
  DIVAS_ID,
}: any) {
  const router = useRouter();
  const now = new Date();

  const sorted = [...sessions].sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const isToday = (date: string) => {
    const d = new Date(date);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const isPast = (date: string) => {
    return new Date(date).getTime() < now.getTime();
  };

  const getKitStyle = (s: any) => {
    if (s.kit?.toLowerCase() === "black")
      return "bg-zinc-900 text-white";
    if (s.kit?.toLowerCase() === "pink")
      return "bg-pink-500 text-white";
    return "bg-zinc-200 text-black";
  };

  const [scores, setScores] = useState<any>({});

  useEffect(() => {
    const map: any = {};
    sessions.forEach((s: any) => {
      map[s.id] = {
        team: s.teamScore || 0,
        opp: s.opponentScore || 0,
      };
    });
    setScores(map);
  }, [sessions]);

  const switchTeam = (newTeamId: string) => {
    router.push(`/coach/live-stats?team=${newTeamId}`);
  };

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

    setScores((prev: any) => ({
      ...prev,
      [sessionId]: {
        ...prev[sessionId],
        opp:
          type === "plus"
            ? prev[sessionId]?.opp + 1
            : Math.max((prev[sessionId]?.opp || 0) - 1, 0),
      },
    }));
  };

  const updateGoal = async (
    sessionId: string,
    playerId: string
  ) => {
    await fetch("/api/live/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, sessionId }),
    });

    setScores((prev: any) => ({
      ...prev,
      [sessionId]: {
        ...prev[sessionId],
        team: (prev[sessionId]?.team || 0) + 1,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-pink-600 hover:underline"
        >
          ← Back
        </button>

        
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
                    Live Match Mode
                  </h1>
        <CoachSubNav teamId={teamId} />
        
                  
                </div>

        {/* TEAM SELECTOR */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-5">
          <div className="text-sm font-semibold mb-3">
            Select Team
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => switchTeam(DYNOS_ID)}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                teamId === DYNOS_ID
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md"
                  : "bg-zinc-100 hover:bg-zinc-200"
              }`}
            >
              Dynos
            </button>

            <button
              onClick={() => switchTeam(DIVAS_ID)}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                teamId === DIVAS_ID
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md"
                  : "bg-zinc-100 hover:bg-zinc-200"
              }`}
            >
              Divas
            </button>
          </div>
        </div>

        {/* FIXTURES */}
        {sorted.length === 0 && (
          <p className="text-zinc-500">No fixtures found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {sorted.map((s: any) => {
            const today = isToday(s.date);
            const past = isPast(s.date);

            return (
              <div
                key={s.id}
                className={`
                  rounded-2xl border bg-white overflow-hidden
                  transition-all duration-200 hover:-translate-y-1 hover:shadow-xl
                  ${
                    today
                      ? "border-pink-500 shadow-lg ring-2 ring-pink-200"
                      : "border-pink-100 shadow-sm"
                  }
                  ${past ? "opacity-80" : ""}
                `}
              >
                <div className="h-1.5 bg-gradient-to-r from-pink-600 to-rose-600" />

                <div className="p-6 flex flex-col gap-4">

                  {/* HEADER */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900">
                        {s.title}
                      </h2>

                      <div className="flex gap-2 mt-1 flex-wrap">
                        {today && (
                          <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold">
                            LIVE
                          </span>
                        )}
                        {!past && !today && (
                          <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">
                            UPCOMING
                          </span>
                        )}
                        {past && (
                          <span className="text-[10px] bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full font-semibold">
                            PLAYED
                          </span>
                        )}
                      </div>
                    </div>

                    {s.kit && (
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${getKitStyle(
                          s
                        )}`}
                      >
                        {s.kit} KIT
                      </span>
                    )}
                  </div>

                  {/* META */}
                  <div className="text-sm text-zinc-700">
                    📅 {new Date(s.date).toLocaleDateString()} • {s.time}
                  </div>

                  {/* SCOREBOARD */}
                  <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-xl">
                    <div className="text-3xl font-extrabold text-black">
                      {scores[s.id]?.team || 0}
                    </div>

                    <div className="text-sm text-zinc-500 font-semibold">
                      vs {s.opponent}
                    </div>

                    <div className="text-3xl font-extrabold text-black">
                      {scores[s.id]?.opp || 0}
                    </div>
                  </div>

                  {/* PLAYER GOALS */}
                  <div className="grid grid-cols-2 gap-2">
                    {players.map((p: any) => (
                      <button
                        key={p.id}
                        onClick={() => updateGoal(s.id, p.id)}
                        className="bg-pink-100 hover:bg-pink-200 text-pink-700 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        + {p.name}
                      </button>
                    ))}
                  </div>

                  {/* OPPONENT CONTROLS */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateOpponent(s.id, "plus")}
                      className="flex-1 bg-black text-white py-2 rounded-lg font-semibold hover:bg-zinc-800 transition"
                    >
                      Opp +
                    </button>

                    <button
                      onClick={() => updateOpponent(s.id, "minus")}
                      className="flex-1 bg-zinc-200 py-2 rounded-lg font-semibold hover:bg-zinc-300 transition"
                    >
                      Opp −
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
