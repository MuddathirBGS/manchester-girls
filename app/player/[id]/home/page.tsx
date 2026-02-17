import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default async function PlayerHome({ params }: Props) {
  const { id } = params;

  if (!id) return notFound();

  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      team: true,
      attendances: {
        include: {
          session: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      stats: true,                // ✅ FIXED (was Stat)
      feedbacks: {                // ✅ FIXED (was Feedback)
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!player) return notFound();

  const yesCount = player.attendances.filter((a) => a.status === "YES").length;
  const noCount = player.attendances.filter((a) => a.status === "NO").length;
  const maybeCount = player.attendances.filter((a) => a.status === "MAYBE").length;

  const stats = player.stats;          // ✅ FIXED
  const feedback = player.feedbacks?.[0];   // ✅ FIXED

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-xl p-6 shadow">
          <h1 className="text-3xl font-bold">{player.name}</h1>

          <div className="mt-2 space-y-1 text-sm opacity-90">
            <div>#{player.number}</div>
            <div>{player.position}</div>
            <div>{player.team?.name}</div>
          </div>
        </div>

        {/* ATTENDANCE STATS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{yesCount}</div>
            <div className="text-sm text-zinc-500">Attending</div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{noCount}</div>
            <div className="text-sm text-zinc-500">Not Attending</div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{maybeCount}</div>
            <div className="text-sm text-zinc-500">Maybe</div>
          </div>
        </div>

        {/* STATS */}
        {stats && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold mb-4">Season Stats</h2>

            <div className="grid grid-cols-3 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.goals}</div>
                <div className="text-xs text-zinc-500">Goals</div>
              </div>

              <div>
                <div className="text-2xl font-bold">{stats.assists}</div>
                <div className="text-xs text-zinc-500">Assists</div>
              </div>

              <div>
                <div className="text-2xl font-bold">{stats.saves}</div>
                <div className="text-xs text-zinc-500">Saves</div>
              </div>
            </div>
          </div>
        )}

        {/* COACH FEEDBACK */}
        {feedback && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold mb-4">Latest Coach Feedback</h2>

            <div className="space-y-2 text-sm">
              {feedback.strengths && <p><b>Strengths:</b> {feedback.strengths}</p>}
              {feedback.improve && <p><b>To Improve:</b> {feedback.improve}</p>}
              {feedback.coachNote && <p><b>Note:</b> {feedback.coachNote}</p>}
            </div>
          </div>
        )}

        {/* ATTENDANCE LIST */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold mb-4">Attendance Record</h2>

          {player.attendances.length === 0 && (
            <p className="text-zinc-500">No sessions yet.</p>
          )}

          {player.attendances.map((a) => (
            <div
              key={a.id}
              className="border-b py-3 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{a.session.title}</div>
                <div className="text-xs text-zinc-500">
                  {new Date(a.session.date).toLocaleDateString()}
                </div>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    a.status === "YES"
                      ? "bg-green-100 text-green-700"
                      : a.status === "NO"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                `}
              >
                {a.status}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
