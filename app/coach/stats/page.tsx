export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import Link from "next/link";
import CoachSubNav from "@/app/components/CoachSubNav";

const DYNOS_ID = "cmltjiw8a0000396i44vrndkn";
const DIVAS_ID = "cmltjixjz0001396i0ybecwvr";

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ teamId?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const teamId = params.teamId || DYNOS_ID;
  const sortKey = params.sort || "goals";

  const players = await prisma.player.findMany({
    where: { teamId },
    orderBy: { name: "asc" },
  });

  const events = await prisma.matchEvent.findMany({
    where: {
      session: {
        teamId,
        type: { not: "TRAINING" },
      },
    },
  });

  const playersWithStats = players.map((p) => {
    const playerEvents = events.filter(
      (e) => e.playerId === p.id
    );

    const goals = playerEvents.filter(
      (e) => e.type === "GOAL"
    ).length;

    const assists = playerEvents.filter(
      (e) => e.type === "ASSIST"
    ).length;

    const saves = playerEvents.filter(
      (e) => e.type === "SAVE"
    ).length;

    return {
      ...p,
      goals,
      assists,
      saves,
      ga: goals + assists,
    };
  });

  const sortedPlayers = [...playersWithStats].sort((a, b) => {
    return (
      b[
        sortKey as
          | "goals"
          | "assists"
          | "saves"
          | "ga"
      ] -
      a[
        sortKey as
          | "goals"
          | "assists"
          | "saves"
          | "ga"
      ]
    );
  });

  const totalGoals = playersWithStats.reduce(
    (sum, p) => sum + p.goals,
    0
  );

  const totalAssists = playersWithStats.reduce(
    (sum, p) => sum + p.assists,
    0
  );

  const totalSaves = playersWithStats.reduce(
    (sum, p) => sum + p.saves,
    0
  );

  const topScorer = sortedPlayers[0];

  const teamButton = (id: string) =>
    `px-5 py-2 rounded-lg font-semibold transition ${
      teamId === id
        ? "bg-pink-500 text-white shadow-md"
        : "bg-white border border-pink-200 text-zinc-700 hover:bg-pink-50"
    }`;

  const sortLink = (key: string) =>
    `/coach/stats?teamId=${teamId}&sort=${key}`;

  const medal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
              Season Statistics
              <span className="block text-pink-500 text-lg font-medium mt-2">
                Team Performance Overview
              </span>
            </h1>

            <p className="text-base text-zinc-500 max-w-xl">
              View goals, assists and saves across all matches.
            </p>
          </div>

          <div className="mt-8 border-t border-pink-200" />

          <div className="mt-6">
            <CoachSubNav teamId={teamId} />
          </div>
        </div>

        {/* TEAM SELECTOR */}
        <div className="flex flex-wrap gap-3">
          <Link href={`/coach/stats?teamId=${DYNOS_ID}`}>
            <button className={teamButton(DYNOS_ID)}>
              Dynos (U9)
            </button>
          </Link>

          <Link href={`/coach/stats?teamId=${DIVAS_ID}`}>
            <button className={teamButton(DIVAS_ID)}>
              Divas (U9)
            </button>
          </Link>
        </div>

        {/* HERO TOP SCORER */}
        <div className="rounded-xl p-6 text-white shadow-md bg-pink-500">
          <div className="text-xs opacity-80 mb-1">
            Top Scorer
          </div>
          <div className="text-2xl font-bold">
            {topScorer?.name || "No data yet"}
          </div>
          <div className="text-sm opacity-80">
            {topScorer?.goals || 0} goals
          </div>
        </div>

        {/* TOTAL CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard label="Goals" value={totalGoals} />
          <StatCard label="Assists" value={totalAssists} />
          <StatCard label="Saves" value={totalSaves} />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-md border border-pink-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[750px]">

              {/* HEADER */}
              <div className="grid grid-cols-6 bg-pink-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500 border-b border-pink-200">
                <div>#</div>
                <div>Player</div>
                <Link href={sortLink("goals")} className="text-center hover:text-pink-500">
                  Goals
                </Link>
                <Link href={sortLink("assists")} className="text-center hover:text-pink-500">
                  Assists
                </Link>
                <Link href={sortLink("ga")} className="text-center hover:text-pink-500">
                  G/A
                </Link>
                <Link href={sortLink("saves")} className="text-center hover:text-pink-500">
                  Saves
                </Link>
              </div>

              {/* ROWS */}
              {sortedPlayers.map((p, index) => (
                <div
                  key={p.id}
                  className="grid grid-cols-6 px-6 py-4 border-t border-pink-100 text-sm items-center hover:bg-pink-50 transition"
                >
                  <div className="font-semibold">
                    {medal(index)}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.photoUrl ? (
                      <img
                        src={p.photoUrl}
                        className="w-10 h-10 rounded-full object-cover border border-pink-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-sm font-bold text-pink-600">
                        {p.name?.charAt(0)}
                      </div>
                    )}

                    <div>
                      <div className="font-medium text-zinc-900">
                        {p.name}
                      </div>
                      <div className="text-xs text-zinc-500">
                        #{p.number || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="text-center font-semibold text-pink-600">
                    {p.goals}
                  </div>

                  <div className="text-center">
                    {p.assists}
                  </div>

                  <div className="text-center font-semibold text-pink-600">
                    {p.ga}
                  </div>

                  <div className="text-center font-semibold">
                    {p.saves}
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-pink-200 p-5 text-center">
      <div className="text-sm text-zinc-500">
        {label}
      </div>
      <div className="text-3xl font-bold text-pink-600">
        {value}
      </div>
    </div>
  );
}