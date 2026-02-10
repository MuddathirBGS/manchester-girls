import Link from "next/link";

async function getPlayers() {
  const res = await fetch("http://localhost:3000/api/players", {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function RosterPage() {
  const players = await getPlayers();

  // TEMP: split by teamId (matches your add form values)
  const dynos = players.filter((p: any) => p.teamId === "dynos");
  const divas = players.filter((p: any) => p.teamId === "divas");

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Team Roster</h1>

          <Link href="/coach/add-player">
            <div className="px-5 py-2 border-2 border-pink-500 text-pink-500 rounded-lg font-semibold hover:bg-pink-50">
              + Add Player
            </div>
          </Link>
        </div>

        {/* TEAM SWITCHER */}
        <div className="flex gap-3 mb-8">
          <div className="px-4 py-2 rounded-lg border-2 border-pink-500 text-pink-500 font-semibold">
            Dynos - U9
          </div>
          <div className="px-4 py-2 rounded-lg border-2 border-pink-300 text-pink-400 font-semibold">
            Divas - U9
          </div>
        </div>

        {/* DYNOS */}
        <h2 className="text-xl font-bold mb-4">Dynos</h2>

        {dynos.length === 0 && (
          <p className="text-zinc-500 mb-6">No players in Dynos yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {dynos.map((p: any) => (
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
            </div>
          ))}
        </div>

        {/* DIVAS */}
        <h2 className="text-xl font-bold mb-4">Divas</h2>

        {divas.length === 0 && (
          <p className="text-zinc-500">No players in Divas yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {divas.map((p: any) => (
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
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
