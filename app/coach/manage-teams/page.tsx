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
    <div className="min-h-screen bg-[#f7f1f4]">
      {/* PAGE HEADER */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-4">
        <Link href="/coach">
          <div className="text-sm text-pink-600 mb-2 cursor-pointer hover:underline">
            ← Back
          </div>
        </Link>

       
               {/* HEADER */}
               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                 <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
                   Coach Dashboard
                 </h1>
        {/* 🔥 SECONDARY NAV */}
      <CoachSubNav />
       
                 
               </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-10 space-y-8">

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold shadow-sm">
            + Add New Team
          </button>

          <button className="px-5 py-3 bg-white border rounded-xl font-semibold shadow-sm hover:shadow">
            Invite Parent
          </button>
        </div>

        {/* EMPTY STATE */}
        {teams.length === 0 && (
          <p className="text-zinc-600 mt-6">No teams created yet.</p>
        )}

        {/* TEAM CARDS */}
        <div className="space-y-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6"
            >
              {/* TEAM HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <div>
                  <div className="text-xl font-bold">{team.name}</div>
                  <div className="text-sm text-zinc-500">U9 Team</div>
                </div>

                <Link href={`/roster?teamId=${team.id}`}>
                  <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-semibold">
                    View Players
                  </button>
                </Link>
              </div>

              {/* LINKS BLOCK */}
              <div className="bg-zinc-50 border rounded-xl p-5 space-y-5">
                {/* Parent link */}
                <div>
                  <div className="text-sm font-semibold">
                    Parent Registration Link
                  </div>
                  <div className="text-xs text-zinc-500 mb-2">
                    Share with parents to register their children
                  </div>

                  <input
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_BASE_URL}/ParentRegistration?teamId=${team.id}`}
                    className="w-full border rounded-lg p-2 text-sm bg-white"
                  />
                </div>

                {/* Player login link */}
                <div>
                  <div className="text-sm font-semibold">
                    Player Chat Login Link
                  </div>
                  <div className="text-xs text-zinc-500 mb-2">
                    Share with players to access team chat
                  </div>

                  <input
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_BASE_URL}/PlayerLogin?teamId=${team.id}`}
                    className="w-full border rounded-lg p-2 text-sm bg-white"
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
