import Link from "next/link";

const DYNOS_ID = "cmlj5zica0000s8zm2r11j8z0";
const DIVAS_ID = "cmlj605eh0001s8zmtkn3koal";

async function getPlayers() {
  const res = await fetch("http://localhost:3000/api/players", {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function RosterPage({
  searchParams,
}: {
  searchParams: Promise<{ teamId?: string }>;
}) {
  const { teamId } = await searchParams;
  const activeTeam = teamId || DYNOS_ID;

  const players = await getPlayers();

  // Only show selected team
  const filtered = players.filter((p: any) => p.teamId === activeTeam);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Team Roster</h1>

          <Link href={`/coach/add-player?teamId=${activeTeam}`}>
            <div className="px-5 py-2 border-2 border-pink-500 text-pink-500 rounded-lg font-semibold hover:bg-pink-50">
              + Add Player
            </div>
          </Link>
        </div>

        {/* TEAM SWITCHER */}
        <div className="flex gap-3 mb-8">
          <Link href={`/roster?teamId=${DYNOS_ID}`}>
            <button
              className={`px-4 py-2 rounded-lg border-2 font-semibold ${
                activeTeam === DYNOS_ID
                  ? "border-pink-500 bg-pink-500 text-white"
                  : "border-pink-300 text-pink-400 bg-white"
              }`}
            >
              Dynos - U9
            </button>
          </Link>

          <Link href={`/roster?teamId=${DIVAS_ID}`}>
            <button
              className={`px-4 py-2 rounded-lg border-2 font-semibold ${
                activeTeam === DIVAS_ID
                  ? "border-pink-500 bg-pink-500 text-white"
                  : "border-pink-300 text-pink-400 bg-white"
              }`}
            >
              Divas - U9
            </button>
          </Link>
        </div>

        {/* TEAM TITLE */}
        <h2 className="text-xl font-bold mb-4">
          {activeTeam === DYNOS_ID ? "Dynos" : "Divas"}
        </h2>

        {filtered.length === 0 && (
          <p className="text-zinc-500 mb-6">No players yet.</p>
        )}

        {/* PLAYERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p: any) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-md p-6 border border-pink-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://i.pravatar.cc/100"
                  className="w-16 h-16 rounded-full"
                />

                <div>
                  <div className="text-lg font-bold text-zinc-900">
                    {p.name}
                  </div>

                  <div className="text-pink-500 font-semibold">
                    #{p.number}
                  </div>

                  <div className="text-sm text-zinc-500">
                    {p.position}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-4">
                <Link href={`/player/${p.id}`}>
                  <button className="px-3 py-2 bg-pink-500 text-white rounded-lg text-sm font-semibold">
                    Profile
                  </button>
                </Link>

                <Link href={`/coach/stats/${p.id}`}>
                  <button className="px-3 py-2 border border-pink-500 text-pink-500 rounded-lg text-sm font-semibold">
                    Stats
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
