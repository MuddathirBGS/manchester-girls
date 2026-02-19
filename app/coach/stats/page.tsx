import prisma from "@/lib/prisma";
import Link from "next/link";

const DYNOS_ID = "cmlp8lhno00004lay76ixxb2n";
const DIVAS_ID = "cmlp8lji200014lays2jfga30";

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

  const teamButton = (id: string) =>
    `px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
      teamId === id
        ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg ring-2 ring-pink-300 scale-[1.02]"
        : "bg-white border shadow-sm hover:shadow"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-rose-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* BACK */}
        <Link
          href="/coach"
          className="text-sm font-semibold text-pink-600 hover:underline"
        >
          ← Back
        </Link>

        {/* HEADER */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
            Season Statistics
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Team performance overview
          </p>
        </div>

        {/* TEAM SWITCH */}
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

        {/* HERO CARD */}
        <div className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r from-pink-600 to-rose-600">
          <div className="text-xs opacity-90 mb-1">
            Season Leader
          </div>
          <div className="text-2xl font-bold">
            {topScorer?.name || "No data yet"}
          </div>
          <div className="text-sm opacity-90">
            Leading goal scorer this season
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
          <div className="bg-white rounded-2xl shadow-md border p-5 text-center">
            <div className="text-sm text-zinc-500">Goals</div>
            <div className="text-3xl font-extrabold text-pink-600">
              {totalGoals}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border p-5 text-center">
            <div className="text-sm text-zinc-500">Assists</div>
            <div className="text-3xl font-extrabold text-pink-600">
              {totalAssists}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border p-5 text-center">
            <div className="text-sm text-zinc-500">Saves</div>
            <div className="text-3xl font-extrabold text-pink-600">
              {totalSaves}
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              {topSaver?.name} leads
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border p-5 text-center">
            <div className="text-sm text-zinc-500">Coach POTM</div>
            <div className="text-2xl font-bold text-black">—</div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border p-5 text-center">
            <div className="text-sm text-zinc-500">Parents POTM</div>
            <div className="text-2xl font-bold text-black">—</div>
          </div>
        </div>

        {/* PLAYER TABLE */}
        <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="font-bold text-lg">Player Statistics</h2>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              <div className="grid grid-cols-4 bg-zinc-50 px-5 py-3 text-sm font-semibold">
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
                    className="grid grid-cols-4 px-5 py-3 border-t text-sm"
                  >
                    <div className="font-medium text-black">
                      {p.name}
                    </div>

                    <div className="font-semibold text-pink-600">
                      {s?.goals || 0}
                    </div>

                    <div>{s?.assists || 0}</div>

                    <div className="font-semibold text-black">
                      {s?.saves || 0}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
