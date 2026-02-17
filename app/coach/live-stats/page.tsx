import prisma from "@/lib/prisma";

const DYNOS_ID = "cmlj5zica0000s8zm2r11j8z0";
const DIVAS_ID = "cmlj605eh0001s8zmtkn3koal";

async function getData(teamId: string) {
  const players = await prisma.player.findMany({
    where: { teamId },
    include: { stats: true },
    orderBy: { name: "asc" },
  });

  const sessions = await prisma.session.findMany({
    where: { teamId },
    orderBy: { date: "desc" },
  });

  return { players, sessions };
}

export default async function LiveStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string; session?: string }>;
}) {
  // ✅ FIX: unwrap searchParams (App Router requirement)
  const params = await searchParams;

  const teamId = params.team || DYNOS_ID;
  const sessionId = params.session;

  const { players, sessions } = await getData(teamId);

  // TEAM TOTALS
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

  // LEADERS
  const topScorer = [...players].sort(
    (a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0)
  )[0];

  const topAssist = [...players].sort(
    (a, b) => (b.stats?.assists || 0) - (a.stats?.assists || 0)
  )[0];

  const topSaver = [...players].sort(
    (a, b) => (b.stats?.saves || 0) - (a.stats?.saves || 0)
  )[0];

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">⚡ Live Match Mode</h1>

        {/* TEAM SWITCH */}
        <div className="flex gap-3">
          <a href={`/coach/live-stats?team=${DYNOS_ID}`}>
            <button
              className={`px-4 py-2 rounded-lg font-semibold border ${
                teamId === DYNOS_ID
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white"
              }`}
            >
              Dynos
            </button>
          </a>

          <a href={`/coach/live-stats?team=${DIVAS_ID}`}>
            <button
              className={`px-4 py-2 rounded-lg font-semibold border ${
                teamId === DIVAS_ID
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white"
              }`}
            >
              Divas
            </button>
          </a>
        </div>

        {/* SESSION SELECT */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-2">Select Match / Training</div>

          <div className="flex flex-wrap gap-2">
            {sessions.map((s) => (
              <a
                key={s.id}
                href={`/coach/live-stats?team=${teamId}&session=${s.id}`}
              >
                <button
                  className={`px-3 py-2 rounded-lg text-sm ${
                    sessionId === s.id
                      ? "bg-pink-500 text-white"
                      : "bg-zinc-100"
                  }`}
                >
                  {s.title}
                </button>
              </a>
            ))}
          </div>
        </div>

        {/* LIVE SUMMARY BAR */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-xs text-zinc-500">Goals</div>
            <div className="text-2xl font-bold text-yellow-600">
              {totalGoals}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-xs text-zinc-500">Assists</div>
            <div className="text-2xl font-bold text-blue-600">
              {totalAssists}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-xs text-zinc-500">Saves</div>
            <div className="text-2xl font-bold text-green-600">
              {totalSaves}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-xs text-zinc-500">Top Scorer</div>
            <div className="text-sm font-bold">
              {topScorer?.name || "-"}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-xs text-zinc-500">Top Assist</div>
            <div className="text-sm font-bold">
              {topAssist?.name || "-"}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-xs text-zinc-500">Top Saver</div>
            <div className="text-sm font-bold">
              {topSaver?.name || "-"}
            </div>
          </div>
        </div>

        {/* PLAYER GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow p-6">
              <div className="text-lg font-bold">{p.name}</div>

              <div className="text-sm text-zinc-500 mb-4">
                Goals {p.stats?.goals || 0} •
                Assists {p.stats?.assists || 0} •
                Saves {p.stats?.saves || 0}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <form action="/api/live/goals" method="POST">
                  <input type="hidden" name="playerId" value={p.id} />
                  <button className="w-full py-2 bg-yellow-400 text-white rounded-lg">
                    + Goal
                  </button>
                </form>

                <form action="/api/live/assists" method="POST">
                  <input type="hidden" name="playerId" value={p.id} />
                  <button className="w-full py-2 bg-blue-500 text-white rounded-lg">
                    + Assist
                  </button>
                </form>

                <form action="/api/live/saves" method="POST">
                  <input type="hidden" name="playerId" value={p.id} />
                  <button className="w-full py-2 bg-green-600 text-white rounded-lg">
                    + Save
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
