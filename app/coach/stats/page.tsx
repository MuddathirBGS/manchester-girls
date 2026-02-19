import prisma from "@/lib/prisma";
import Link from "next/link";
import CoachSubNav from "@/app/components/CoachSubNav";

const DYNOS_ID = "cmltjiw8a0000396i44vrndkn";
const DIVAS_ID = "cmltjixjz0001396i0ybecwvr";

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ teamId?: string }>;
}) {
  const params = await searchParams;
  const teamId = params.teamId || DYNOS_ID;

  const players = await prisma.player.findMany({
    where: { teamId },
    include: {
      events: true, // 🔥 derive from match events
    },
  });

  /* ===========================
     DERIVE PLAYER STATS
  =========================== */

  const playersWithStats = players.map((p) => {
    const goals = p.events.filter(
      (e) => e.type === "GOAL"
    ).length;

    const assists = p.events.filter(
      (e) => e.type === "ASSIST"
    ).length;

    const saves = p.events.filter(
      (e) => e.type === "SAVE"
    ).length;

    return {
      ...p,
      derived: { goals, assists, saves },
    };
  });

  const totalGoals = playersWithStats.reduce(
    (sum, p) => sum + p.derived.goals,
    0
  );

  const totalAssists = playersWithStats.reduce(
    (sum, p) => sum + p.derived.assists,
    0
  );

  const totalSaves = playersWithStats.reduce(
    (sum, p) => sum + p.derived.saves,
    0
  );

  const topScorer = [...playersWithStats].sort(
    (a, b) =>
      b.derived.goals - a.derived.goals
  )[0];

  const topSaver = [...playersWithStats].sort(
    (a, b) =>
      b.derived.saves - a.derived.saves
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
      
              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
                  Season Statistics
                </h1>
      <CoachSubNav teamId={teamId} />
      
                
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
          <StatCard label="Goals" value={totalGoals} />
          <StatCard label="Assists" value={totalAssists} />
          <StatCard
            label="Saves"
            value={totalSaves}
            sub={topSaver?.name + " leads"}
          />
          <StatCard label="Coach POTM" value="—" />
          <StatCard label="Parents POTM" value="—" />
        </div>

        {/* PLAYER TABLE */}
        <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="font-bold text-lg">
              Player Statistics
            </h2>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              <div className="grid grid-cols-4 bg-zinc-50 px-5 py-3 text-sm font-semibold">
                <div>Player</div>
                <div>Goals</div>
                <div>Assists</div>
                <div>Saves</div>
              </div>

              {playersWithStats.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-4 px-5 py-3 border-t text-sm"
                >
                  <div className="font-medium text-black">
                    {p.name}
                  </div>

                  <div className="font-semibold text-pink-600">
                    {p.derived.goals}
                  </div>

                  <div>{p.derived.assists}</div>

                  <div className="font-semibold text-black">
                    {p.derived.saves}
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
  sub,
}: {
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md border p-5 text-center">
      <div className="text-sm text-zinc-500">
        {label}
      </div>
      <div className="text-3xl font-extrabold text-pink-600">
        {value}
      </div>
      {sub && (
        <div className="text-xs text-zinc-400 mt-1">
          {sub}
        </div>
      )}
    </div>
  );
}
