import prisma from "@/lib/prisma";
import Link from "next/link";

const DYNOS_ID = "cmlj5zica0000s8zm2r11j8z0";
const DIVAS_ID = "cmlj605eh0001s8zmtkn3koal";

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ teamId?: string }>;
}) {
  const params = await searchParams;
  const teamId = params.teamId || DYNOS_ID;

  const players = await prisma.player.findMany({
    where: { teamId },
    include: { stats: true },
  });

  const totalGoals = players.reduce(
    (sum, p) => sum + (p.stats?.goals || 0),
    0
  );

  const totalAssists = players.reduce(
    (sum, p) => sum + (p.stats?.assists || 0),
    0
  );

  const totalSaves = players.reduce(
    (sum, p) => sum + (p.stats?.saves || 0),
    0
  );

  const topScorer = [...players].sort(
    (a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0)
  )[0];

  const topSaver = [...players].sort(
    (a, b) => (b.stats?.saves || 0) - (a.stats?.saves || 0)
  )[0];

  return (
    <div className="min-h-screen bg-[#f7f1f4]">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-900 text-white px-8 py-10">
        <Link href="/coach">
          <div className="text-sm mb-2 opacity-90 cursor-pointer">
            ← Back to Home
          </div>
        </Link>

        <h1 className="text-4xl font-bold">Season Statistics</h1>
      </div>

      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* TEAM SELECT */}
        <div>
          <div className="font-semibold mb-3 text-lg">Select Team</div>

          <div className="flex gap-3">
            <Link href={`/coach/stats?teamId=${DYNOS_ID}`}>
              <button
                className={`px-4 py-2 rounded-lg font-semibold border ${
                  teamId === DYNOS_ID
                    ? "bg-pink-500 text-white"
                    : "bg-white"
                }`}
              >
                Dynos (U9)
              </button>
            </Link>

            <Link href={`/coach/stats?teamId=${DIVAS_ID}`}>
              <button
                className={`px-4 py-2 rounded-lg font-semibold border ${
                  teamId === DIVAS_ID
                    ? "bg-pink-500 text-white"
                    : "bg-white"
                }`}
              >
                Divas (U9)
              </button>
            </Link>
          </div>
        </div>

        {/* PLAYER OF THE MONTH */}
        <div className="rounded-xl p-6 text-white shadow bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
          <div className="text-sm opacity-90 mb-1">
            ✨ View Award Leaders
          </div>
          <div className="text-2xl font-bold">Player of the Month</div>
          <div className="text-sm opacity-90">
            {topScorer?.name || "No data yet"} leading the charts
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-zinc-500">Goals</div>
            <div className="text-3xl font-bold text-yellow-600">
              {totalGoals} total
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-zinc-500">Assists</div>
            <div className="text-3xl font-bold text-blue-600">
              {totalAssists} total
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-zinc-500">Saves</div>
            <div className="text-3xl font-bold text-green-600">
              {totalSaves} total
            </div>
            <div className="text-xs text-zinc-400">
              {topSaver?.name} leads
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-zinc-500">Coach's POTM</div>
            <div className="text-2xl font-bold text-orange-600">
              5 matches
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-zinc-500">Parents Player</div>
            <div className="text-2xl font-bold text-purple-600">
              5 matches
            </div>
          </div>
        </div>

        {/* PLAYER TABLE */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold mb-4 text-lg">Player Statistics</h2>

          <div className="grid grid-cols-4 font-semibold border-b pb-2 mb-2 text-sm">
            <div>Player</div>
            <div>Goals</div>
            <div>Assists</div>
            <div>Saves</div>
          </div>

          {players.map((p) => {
            const s = p.stats;

            return (
              <div
                key={p.id}
                className="grid grid-cols-4 border-b py-2 text-sm"
              >
                <div>{p.name}</div>
                <div className="text-yellow-700 font-semibold">
                  {s?.goals || 0}
                </div>
                <div>{s?.assists || 0}</div>
                <div className="text-green-700 font-semibold">
                  {s?.saves || 0}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
