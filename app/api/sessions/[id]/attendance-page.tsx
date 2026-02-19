import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default async function SessionAttendancePage({ params }: Props) {
  const session = await prisma.session.findUnique({
    where: { id: params.id },
    include: {
      team: {
        include: {
          players: {
            include: {
              attendances: {
                where: { sessionId: params.id },
              },
            },
          },
        },
      },
    },
  });

  if (!session) return notFound();

  const players = session.team.players;

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-1">{session.title}</h1>
        <p className="text-sm text-zinc-600 mb-4">
          {new Date(session.date).toLocaleDateString()} • {session.time}
        </p>

        <h2 className="font-semibold mb-4">
          {session.team.name} — Attendance
        </h2>

        {/* PLAYER LIST */}
        <div className="space-y-2">
          {players.map((player) => {
            const attendance = player.attendances[0];
            const status = attendance?.status || "NONE";

            return (
              <div
                key={player.id}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <div className="font-semibold">{player.name}</div>
                  <div className="text-xs text-zinc-500">
                    #{player.number} • {player.position}
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      status === "YES"
                        ? "bg-green-100 text-green-700"
                        : status === "NO"
                        ? "bg-red-100 text-red-700"
                        : status === "MAYBE"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-zinc-100 text-zinc-500"
                    }
                  `}
                >
                  {status === "NONE" ? "No response" : status}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
