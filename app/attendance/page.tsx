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
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-rose-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* BACK BUTTON */}
        <Link
          href="/coach"
          className="text-sm font-semibold text-pink-600 hover:underline"
        >
          ← Back
        </Link>

        {/* HEADER */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
            Attendance Tracker
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            View team attendance performance across fixtures & training
          </p>
        </div>

        {/* TEAM SWITCH */}
        <div className="flex flex-wrap gap-3">
          <Link href={`/attendance?team=${DYNOS_ID}`}>
            <button
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                teamId === DYNOS_ID
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md"
                  : "bg-white border shadow-sm hover:shadow"
              }`}
            >
              Dynos (U9)
            </button>
          </Link>

          <Link href={`/attendance?team=${DIVAS_ID}`}>
            <button
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                teamId === DIVAS_ID
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md"
                  : "bg-white border shadow-sm hover:shadow"
              }`}
            >
              Divas (U9)
            </button>
          </Link>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-md border text-center">
            <div className="text-3xl font-extrabold text-green-600">
              {totalYes}
            </div>
            <div className="text-sm text-zinc-500 mt-1">Total Attended</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border text-center">
            <div className="text-3xl font-extrabold text-red-500">
              {totalNo}
            </div>
            <div className="text-sm text-zinc-500 mt-1">Not Attended</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border text-center">
            <div className="text-3xl font-extrabold text-pink-600">
              {rate}%
            </div>
            <div className="text-sm text-zinc-500 mt-1">Attendance Rate</div>
          </div>
        </div>

        {/* SESSIONS */}
        <div className="space-y-6">
          {sessions.map((s) => {
            const yes = s.attendances.filter(a => a.status === "YES").length;
            const no = s.attendances.filter(a => a.status === "NO").length;
            const maybe = s.attendances.filter(a => a.status === "MAYBE").length;

            return (
              <div
                key={s.id}
                className="
                  bg-white
                  rounded-2xl
                  shadow-md
                  border
                  overflow-hidden
                  hover:shadow-lg
                  transition
                "
              >
                {/* TOP STRIP */}
                <div className="h-1 bg-gradient-to-r from-pink-600 to-rose-600" />

                <div className="p-6">
                  {/* TITLE */}
                  <h2 className="font-bold text-lg text-black">
                    {s.title}
                  </h2>

                  <p className="text-sm text-zinc-500">
                    {new Date(s.date).toLocaleDateString()} • {s.location}
                  </p>

                  {/* COUNTS */}
                  <div className="flex flex-wrap gap-5 mt-3 text-sm font-semibold">
                    <div className="text-green-600">✔ {yes} Attending</div>
                    <div className="text-red-500">✘ {no} Not</div>
                    <div className="text-yellow-600">? {maybe} Maybe</div>
                  </div>

                  {/* PLAYERS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-5">
                    {s.attendances.map((a) => (
                      <div
                        key={a.id}
                        className="
                          border
                          rounded-xl
                          px-3
                          py-2
                          text-sm
                          flex
                          justify-between
                          bg-zinc-50
                        "
                      >
                        <span className="font-medium text-black">
                          {a.player.name}
                        </span>

                        <span
                          className={`
                            font-semibold
                            ${
                              a.status === "YES"
                                ? "text-green-600"
                                : a.status === "NO"
                                ? "text-red-500"
                                : "text-yellow-600"
                            }
                          `}
                        >
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
