import prisma from "@/lib/prisma";

async function getPlayers(teamId: string) {
  return prisma.player.findMany({
    where: { teamId },
    orderBy: { name: "asc" },
  });
}

export default async function TeamRosterPage({
  params,
}: {
  params: { teamId: string };
}) {
  const players = await getPlayers(params.teamId);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white p-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-zinc-900 mb-8">
          Team Roster
        </h1>

        {players.length === 0 && (
          <p className="text-zinc-600">No players found for this team.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-xl shadow-md border border-pink-200 p-6"
            >
              <div className="text-lg font-semibold text-zinc-900">
                {player.name}
              </div>
              <div className="text-sm text-zinc-500 mt-1">
                Position: {player.position || "N/A"}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}