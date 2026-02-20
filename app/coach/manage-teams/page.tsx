import prisma from "@/lib/prisma";
import Link from "next/link";
import CoachSubNav from "../../components/CoachSubNav";

async function getTeams() {
  return prisma.team.findMany({
    orderBy: { name: "asc" },
  });
}

export default async function ManageTeamsPage() {
  const teams = await getTeams();

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
              Manage Teams
              <span className="block text-pink-500 text-lg font-medium mt-2">
                Team & Access Management
              </span>
            </h1>

            <p className="text-base text-zinc-500 max-w-xl">
              Create teams, manage players and share registration links.
            </p>
          </div>

          <div className="mt-8 border-t border-pink-200" />

          <div className="mt-6">
            <CoachSubNav />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold shadow-md transition">
            + Add New Team
          </button>

          <button className="px-5 py-3 bg-white border border-pink-200 text-zinc-700 rounded-lg font-semibold hover:bg-pink-50 transition">
            Invite Parent
          </button>
        </div>

        {/* EMPTY STATE */}
        {teams.length === 0 && (
          <p className="text-zinc-600 mt-6">
            No teams created yet.
          </p>
        )}

        {/* TEAM CARDS */}
        <div className="space-y-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-xl shadow-md border border-pink-200 p-6"
            >
              {/* TEAM HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <div>
                  <div className="text-xl font-semibold text-zinc-900">
                    {team.name}
                  </div>
                  <div className="text-sm text-zinc-500">
                    U9 Team
                  </div>
                </div>

                <Link href={`/roster?teamId=${team.id}`}>
                  <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-semibold transition">
                    View Players
                  </button>
                </Link>
              </div>

              {/* LINKS BLOCK */}
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-5 space-y-5">

                {/* Parent link */}
                <div>
                  <div className="text-sm font-semibold text-zinc-900">
                    Parent Registration Link
                  </div>
                  <div className="text-xs text-zinc-500 mb-2">
                    Share with parents to register their children
                  </div>

                  <input
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_BASE_URL}/ParentRegistration?teamId=${team.id}`}
                    className="w-full border border-pink-200 rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Player login link */}
                <div>
                  <div className="text-sm font-semibold text-zinc-900">
                    Player Chat Login Link
                  </div>
                  <div className="text-xs text-zinc-500 mb-2">
                    Share with players to access team chat
                  </div>

                  <input
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_BASE_URL}/PlayerLogin?teamId=${team.id}`}
                    className="w-full border border-pink-200 rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}