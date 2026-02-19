"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TeamSelector from "./TeamSelector";

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
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const nextFixture = sorted.find(
    (s) => new Date(s.date) >= now
  );

  const upcomingFixtures = sorted.filter(
    (s) => s.id !== nextFixture?.id
  );

  const isMatchDay = (date: string) => {
    const d = new Date(date);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const isLiveNow = (date: string) => {
    const d = new Date(date).getTime();
    const diff = d - now.getTime();
    return diff <= 2 * 60 * 60 * 1000 && diff >= -2 * 60 * 60 * 1000;
  };

  const getCountdown = (date: string) => {
    const diff = new Date(date).getTime() - now.getTime();
    if (diff <= 0) return "Starting soon";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    return `${hours}h ${mins}m`;
  };

  const [openId, setOpenId] = useState(
    selectedSession?.id ||
      sorted.find((s) => isMatchDay(s.date))?.id ||
      null
  );

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
            ? prev[sessionId]?.opp + 1
            : Math.max((prev[sessionId]?.opp || 0) - 1, 0),
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
            ? prev[sessionId]?.team + 1
            : Math.max((prev[sessionId]?.team || 0) - 1, 0),
      },
    }));
  };

  const updateStat = async (route: string, playerId: string) => {
    await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerId }),
    });
  };

  const renderFixture = (s: any, isHero: boolean) => {
    const isOpen = openId === s.id;
    const score = scores[s.id] || { team: 0, opp: 0 };

    const matchToday = isMatchDay(s.date);
    const liveNow = isLiveNow(s.date);

    const formattedDate = new Date(s.date).toLocaleDateString("en-GB", {
      timeZone: "Europe/London",
    });

    const formattedTime = new Date(s.date).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/London",
    });

    return (
      <div
        key={s.id}
        className={`
          rounded-xl shadow border transition
          ${matchToday ? "border-pink-500 bg-pink-50" : "border-zinc-200 bg-white"}
          ${isHero ? "p-5" : "p-4"}
        `}
      >
        <div
          onClick={() => setOpenId(isOpen ? null : s.id)}
          className="cursor-pointer flex justify-between items-center"
        >
          <div>
            <div className="flex items-center gap-2">
              <div className={`font-semibold ${isHero ? "text-lg" : ""}`}>
                {s.title}
              </div>

              {matchToday && (
                <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">
                  MATCH DAY
                </span>
              )}

              {liveNow && (
                <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                  LIVE
                </span>
              )}
            </div>

            <div className="text-xs text-zinc-500">
              {formattedDate} • {formattedTime} • {s.location}
            </div>

            {isHero && !liveNow && (
              <div className="text-xs text-pink-600 font-semibold mt-1">
                Starts in {getCountdown(s.date)}
              </div>
            )}
          </div>

          <div className="text-2xl font-extrabold text-pink-600">
            {score.team} - <span className="text-black">{score.opp}</span>
          </div>
        </div>

        {isOpen && (
          <div className="p-5 border-t space-y-6 mt-4">
            <div className="bg-zinc-100 rounded-xl p-5 text-center">
              <div className="text-xs text-zinc-500 mb-2">LIVE SCORE</div>

              <div className="flex justify-center items-center gap-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateGoal(s.id, "", "remove")}
                    className="w-10 h-10 bg-zinc-200 rounded-lg text-lg font-bold"
                  >
                    −
                  </button>

                  <div className="text-4xl font-extrabold text-pink-600">
                    {score.team}
                  </div>

                  <button
                    onClick={() => updateGoal(s.id, "", "add")}
                    className="w-10 h-10 bg-pink-500 text-white rounded-lg text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-2xl">-</div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateOpponent(s.id, "minus")}
                    className="w-10 h-10 bg-zinc-200 rounded-lg text-lg font-bold"
                  >
                    −
                  </button>

                  <div className="text-4xl font-extrabold text-black">
                    {score.opp}
                  </div>

                  <button
                    onClick={() => updateOpponent(s.id, "plus")}
                    className="w-10 h-10 bg-black text-white rounded-lg text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {players.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm"
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
                      onClick={() => updateGoal(s.id, p.id, "add")}
                      className="py-3 bg-pink-500 text-white rounded-lg font-semibold"
                    >
                      Goal
                    </button>

                    <button
                      onClick={() =>
                        updateStat("/api/live/assists", p.id)
                      }
                      className="py-3 bg-black text-white rounded-lg font-semibold"
                    >
                      Assist
                    </button>

                    <button
                      onClick={() =>
                        updateStat("/api/live/saves", p.id)
                      }
                      className="py-3 bg-zinc-200 text-black rounded-lg font-semibold"
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 via-white to-pink-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="mb-2 text-sm font-semibold text-pink-600 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-black">Live Match Mode</h1>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm font-semibold mb-2">Select Team</div>

          <TeamSelector
            teamId={teamId}
            DYNOS_ID={DYNOS_ID}
            DIVAS_ID={DIVAS_ID}
          />
        </div>

        {nextFixture && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-black">Next Fixture</h2>
            {renderFixture(nextFixture, true)}
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-black">Upcoming Fixtures</h2>

          {upcomingFixtures.length === 0 && (
            <div className="text-sm text-zinc-500 bg-white p-4 rounded-xl border border-zinc-200">
              No other fixtures scheduled
            </div>
          )}

          {upcomingFixtures.map((s) => renderFixture(s, false))}
        </div>
      </div>
    </div>
  );
}
