import prisma from "@/lib/prisma";
import Link from "next/link";

const DYNOS_ID = "cmlp8lhno00004lay76ixxb2n";
const DIVAS_ID = "cmlp8lji200014lays2jfga30";

async function getData(teamId: string) {
  const sessions = await prisma.session.findMany({
    where: { teamId },
    include: {
      attendances: {
        include: {
          player: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return sessions;
}

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  const { team } = await searchParams;
  const teamId = team || DYNOS_ID;

  const sessions = await getData(teamId);

  // TOTALS
  let totalYes = 0;
  let totalNo = 0;

  sessions.forEach((s) => {
    s.attendances.forEach((a) => {
      if (a.status === "YES") totalYes++;
      if (a.status === "NO") totalNo++;
    });
  });

  const total = totalYes + totalNo;
  const rate = total ? Math.round((totalYes / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <h1 className="text-3xl font-bold">Attendance Tracker</h1>

        {/* TEAM SWITCH */}
        <div className="flex gap-3">
          <Link href={`/attendance?team=${DYNOS_ID}`}>
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                teamId === DYNOS_ID
                  ? "bg-pink-500 text-white"
                  : "bg-white border"
              }`}
            >
              Dynos (U9)
            </button>
          </Link>

          <Link href={`/attendance?team=${DIVAS_ID}`}>
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                teamId === DIVAS_ID
                  ? "bg-pink-500 text-white"
                  : "bg-white border"
              }`}
            >
              Divas (U9)
            </button>
          </Link>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-green-600">{totalYes}</div>
            <div className="text-sm text-zinc-500">Total Attended</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-red-500">{totalNo}</div>
            <div className="text-sm text-zinc-500">Not Attended</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-blue-500">{rate}%</div>
            <div className="text-sm text-zinc-500">Attendance Rate</div>
          </div>
        </div>

        {/* SESSIONS */}
        <div className="space-y-6">
          {sessions.map((s) => {
            const yes = s.attendances.filter(a => a.status === "YES").length;
            const no = s.attendances.filter(a => a.status === "NO").length;
            const maybe = s.attendances.filter(a => a.status === "MAYBE").length;

            return (
              <div key={s.id} className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-bold text-lg">{s.title}</h2>
                <p className="text-sm text-zinc-500">
                  {new Date(s.date).toLocaleDateString()} – {s.location}
                </p>

                <div className="flex gap-6 mt-3 text-sm">
                  <div className="text-green-600">✔ {yes} Attending</div>
                  <div className="text-red-600">✘ {no} Not</div>
                  <div className="text-yellow-600">? {maybe} Maybe</div>
                </div>

                {/* PLAYERS */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {s.attendances.map((a) => (
                    <div
                      key={a.id}
                      className="border rounded-lg px-3 py-2 text-sm flex justify-between"
                    >
                      <span>{a.player.name}</span>
                      <span>{a.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
