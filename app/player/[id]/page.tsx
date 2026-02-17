import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PlayerPage({ params }: Props) {
  const { id } = await params;

  if (!id) return notFound();

  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      team: true,
      stats: true,
      attendances: {
        include: { session: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!player) return notFound();

  const goals = player.stats?.goals || 0;
  const assists = player.stats?.assists || 0;
  const saves = player.stats?.saves || 0;

  const performanceScore =
    goals * 5 +
    assists * 3 +
    saves * 2;

  // --- TEAM LEADERSHIP CHECKS ---
  const teamPlayers = await prisma.player.findMany({
    where: { teamId: player.teamId || undefined },
    include: { stats: true },
  });

  const maxGoals = Math.max(...teamPlayers.map(p => p.stats?.goals || 0));
  const maxAssists = Math.max(...teamPlayers.map(p => p.stats?.assists || 0));
  const maxSaves = Math.max(...teamPlayers.map(p => p.stats?.saves || 0));

  const isTopScorer = goals === maxGoals && goals > 0;
  const isAssistLeader = assists === maxAssists && assists > 0;
  const isSaveLeader = saves === maxSaves && saves > 0;

  // --- MONTHLY VOTE LOCK ---
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  // Check if ANY coach vote already exists this month for this team
  const existingVoteThisMonth = await prisma.awardVote.findFirst({
    where: {
      teamId: player.teamId || undefined,
      type: "COACH",
      createdAt: {
        gte: startOfMonth,
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-800">
              {player.name}
            </h1>

            <p className="text-zinc-500 text-sm">
              #{player.number} • {player.position}
            </p>

            <p className="text-zinc-500 text-sm">
              {player.team?.name}
            </p>
          </div>
        </div>

        {/* AWARD BADGES */}
        <div className="flex flex-wrap gap-2 mb-6">
          {isTopScorer && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold">
              🥇 Golden Boot Leader
            </span>
          )}

          {isAssistLeader && (
            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
              🎯 Assist Leader
            </span>
          )}

          {isSaveLeader && (
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">
              🧤 Save Leader
            </span>
          )}

          {performanceScore > 0 && (
            <span className="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full font-semibold">
              ⭐ Player of the Month Contender
            </span>
          )}
        </div>

        {/* PERFORMANCE CARDS */}
        <div className="grid grid-cols-3 gap-3 md:gap-5 mb-6">
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <div className="text-xs text-zinc-500">Goals</div>
            <div className="text-2xl font-bold text-orange-600">
              {goals}
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-xs text-zinc-500">Assists</div>
            <div className="text-2xl font-bold text-blue-600">
              {assists}
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-xs text-zinc-500">Saves</div>
            <div className="text-2xl font-bold text-green-600">
              {saves}
            </div>
          </div>
        </div>

        {/* PLAYER OF THE MONTH SCORE */}
        <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white rounded-xl p-5 mb-8 shadow">
          <div className="text-sm opacity-90">
            Player Performance Score
          </div>
          <div className="text-3xl font-bold">
            {performanceScore}
          </div>
          <div className="text-xs opacity-80">
            Used to calculate Player of the Month automatically
          </div>
        </div>

        {/* COACH ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3 mb-8">

          <Link
            href={`/coach/player/${player.id}/feedback`}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
          >
            Add Feedback
          </Link>

          <Link
            href={`/coach/player/${player.id}/stats`}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-600 transition"
          >
            Edit Stats
          </Link>

          {/* COACH VOTE — ONE PER MONTH */}
          {existingVoteThisMonth ? (
            <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-semibold">
              🏆 Coach Vote Submitted (This Month)
            </div>
          ) : (
            <form
              action={async () => {
                "use server";

                if (!player.teamId) return;

                const startOfMonth = new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  1
                );

                const alreadyVoted = await prisma.awardVote.findFirst({
                  where: {
                    teamId: player.teamId,
                    type: "COACH",
                    createdAt: { gte: startOfMonth },
                  },
                });

                if (alreadyVoted) return;

                await prisma.awardVote.create({
                  data: {
                    playerId: player.id,
                    teamId: player.teamId,
                    type: "COACH",
                  },
                });
              }}
            >
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                🏆 Vote Coach Player
              </button>
            </form>
          )}
        </div>

        {/* ATTENDANCE */}
        <h2 className="font-bold text-lg mb-3 text-zinc-800">
          Attendance
        </h2>

        {player.attendances.length === 0 && (
          <p className="text-zinc-500">No sessions yet.</p>
        )}

        <div className="space-y-2">
          {player.attendances.map((a) => (
            <div
              key={a.id}
              className="flex justify-between items-center border rounded-lg px-4 py-2"
            >
              <span className="text-sm text-zinc-700">
                {a.session.title}
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
