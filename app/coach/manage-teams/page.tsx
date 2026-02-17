import prisma from "@/lib/prisma";
import Link from "next/link";

async function getTeams() {
  return prisma.team.findMany({
    orderBy: { name: "asc" },
  });
}

export default async function ManageTeamsPage() {
  const teams = await getTeams();

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-800 text-white p-8">
        <Link href="/coach">
          <div className="text-sm mb-2 cursor-pointer">← Back to Home</div>
        </Link>
        <h1 className="text-3xl font-bold">Manage Teams</h1>
      </div>

      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          <button className="px-5 py-3 bg-pink-500 text-white rounded-lg font-semibold">
            + Add New Team
          </button>

          <button className="px-5 py-3 bg-white border rounded-lg font-semibold">
            Invite Parent
          </button>
        </div>

        {/* TEAM CARDS */}
        {teams.length === 0 && (
          <p className="text-zinc-600 mt-6">No teams created yet.</p>
        )}

        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-xl shadow p-6 space-y-4"
          >
            {/* TEAM HEADER */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl font-bold">{team.name}</div>
                <div className="text-sm text-zinc-500">U9 Team</div>
              </div>

              <Link href={`/roster?teamId=${team.id}`}>
                <button className="px-4 py-2 border rounded-lg text-sm font-semibold">
                  Players
                </button>
              </Link>
            </div>

            {/* TEAM LINKS */}
            <div className="bg-zinc-50 border rounded-xl p-4">
              <div className="font-semibold mb-3">Team Links</div>

              {/* Parent link */}
              <div className="mb-4">
                <div className="text-sm font-semibold">
                  Parent Registration Link
                </div>
                <div className="text-xs text-zinc-500 mb-2">
                  Share with parents to register their children
                </div>

                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_BASE_URL}/ParentRegistration?teamId=${team.id}`}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              {/* Player login link */}
              <div>
                <div className="text-sm font-semibold">
                  Player Chat Login Link
                </div>
                <div className="text-xs text-zinc-500 mb-2">
                  Share with players to access team chat
                </div>

                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_BASE_URL}/PlayerLogin?teamId=${team.id}`}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
