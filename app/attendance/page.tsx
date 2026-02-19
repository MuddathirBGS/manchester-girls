import prisma from "@/lib/prisma";
import Link from "next/link";
import CoachSubNav from "@/app/components/CoachSubNav";

const DYNOS_ID = "cmltjiw8a0000396i44vrndkn";
const DIVAS_ID = "cmltjixjz0001396i0ybecwvr";

async function getData(teamId: string) {
  return prisma.session.findMany({
    where: { teamId },
    include: {
      attendances: {
        include: { player: true },
      },
    },
    orderBy: { date: "desc" },
  });
}

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  const params = await searchParams;
  const teamId = params.team || DYNOS_ID;

  const sessions = await getData(teamId);

  type SessionWithAttendance = typeof sessions[number];

  /* ================================
     SPLIT SESSION TYPES
     (MATCH COACH PAGE LOGIC EXACTLY)
  ================================= */

  const trainingSessions = sessions.filter(
    (s) => s.type === "TRAINING"
  );

  const matchSessions = sessions.filter(
    (s) => s.type !== "TRAINING"
  );

  /* ================================
     RATE CALCULATION
  ================================= */

  const calculateRate = (
    arr: SessionWithAttendance[]
  ): number => {
    let yes = 0;
    let total = 0;

    arr.forEach((s) => {
      const y = s.attendances.filter(
        (a) => a.status === "YES"
      ).length;

      const n = s.attendances.filter(
        (a) => a.status === "NO"
      ).length;

      yes += y;
      total += y + n;
    });

    return total ? Math.round((yes / total) * 100) : 0;
  };

  const overallRate = calculateRate(sessions);
  const matchRate = calculateRate(matchSessions);
  const trainingRate = calculateRate(trainingSessions);

  const getTrend = (arr: SessionWithAttendance[]) => {
    const last3 = arr.slice(0, 3);
    const prev3 = arr.slice(3, 6);

    const recent = calculateRate(last3);
    const previous = calculateRate(prev3);

    if (recent > previous) return "up";
    if (recent < previous) return "down";
    return "same";
  };

  const overallTrend = getTrend(sessions);
  const matchTrend = getTrend(matchSessions);
  const trainingTrend = getTrend(trainingSessions);

  /* ================================
     PLAYER ANALYTICS
  ================================= */

  const playerStats: Record<
    string,
    {
      id: string;
      name: string;
      matchYes: number;
      matchNo: number;
      trainingYes: number;
      trainingNo: number;
    }
  > = {};

  sessions.forEach((s) => {
    s.attendances.forEach((a) => {
      if (!playerStats[a.player.id]) {
        playerStats[a.player.id] = {
          id: a.player.id,
          name: a.player.name,
          matchYes: 0,
          matchNo: 0,
          trainingYes: 0,
          trainingNo: 0,
        };
      }

      if (s.type !== "TRAINING") {
        if (a.status === "YES") playerStats[a.player.id].matchYes++;
        if (a.status === "NO") playerStats[a.player.id].matchNo++;
      }

      if (s.type === "TRAINING") {
        if (a.status === "YES") playerStats[a.player.id].trainingYes++;
        if (a.status === "NO") playerStats[a.player.id].trainingNo++;
      }
    });
  });

  const leaderboard = Object.values(playerStats)
    .map((p) => {
      const total =
        p.matchYes +
        p.matchNo +
        p.trainingYes +
        p.trainingNo;

      const yes = p.matchYes + p.trainingYes;

      const pct = total
        ? Math.round((yes / total) * 100)
        : 0;

      return { ...p, pct };
    })
    .sort((a, b) => b.pct - a.pct);

  const lowAttendance = leaderboard.filter(
    (p) => p.pct < 75
  );

  const matchOnlyPlayers = leaderboard.filter(
    (p) =>
      p.matchYes > 0 &&
      p.trainingYes === 0
  );

  const trainingToMatchRatio =
    matchSessions.length > 0
      ? (trainingSessions.length /
          matchSessions.length).toFixed(2)
      : "0";

  /* ================================
     RENDER
  ================================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-rose-100 p-6">
      <div className="max-w-7xl mx-auto space-y-10">

        <Link
          href="/coach"
          className="text-sm font-semibold text-pink-600"
        >
          ← Back
        </Link>

         
                 {/* HEADER */}
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                   <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
                     Attendance Counts
                   </h1>
         <CoachSubNav teamId={teamId} />
         
                   
                 </div>

        {/* TEAM SWITCH */}
        <div className="flex gap-3">
          <Link href={`/attendance?team=${DYNOS_ID}`}>
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                teamId === DYNOS_ID
                  ? "bg-pink-600 text-white"
                  : "bg-zinc-200"
              }`}
            >
              Dynos (U9)
            </button>
          </Link>

          <Link href={`/attendance?team=${DIVAS_ID}`}>
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                teamId === DIVAS_ID
                  ? "bg-pink-600 text-white"
                  : "bg-zinc-200"
              }`}
            >
              Divas (U9)
            </button>
          </Link>
        </div>

        {/* KPI GRID */}
        <div className="grid md:grid-cols-6 gap-6">

          <KPI label="Overall %" value={`${overallRate}%`} trend={overallTrend} />
          <KPI label="Match %" value={`${matchRate}%`} trend={matchTrend} />
          <KPI label="Training %" value={`${trainingRate}%`} trend={trainingTrend} />
          <KPI label="Matches" value={`${matchSessions.length}`} />
          <KPI label="Training Sessions" value={`${trainingSessions.length}`} />
          <KPI label="Training:Match Ratio" value={`${trainingToMatchRatio}`} />

        </div>

        {/* MATCH LIST */}
        {matchSessions.length > 0 && (
          <Section title="Matches">
            {matchSessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </Section>
        )}

        {/* TRAINING LIST */}
        {trainingSessions.length > 0 && (
          <Section title="Training Sessions">
            {trainingSessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </Section>
        )}

      </div>
    </div>
  );
}

/* ================================
   COMPONENTS
================================= */

function KPI({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="text-4xl font-bold mt-2">{value}</div>
      {trend && (
        <div className="text-sm mt-1">
          {trend === "up"
            ? "↑ Improving"
            : trend === "down"
            ? "↓ Declining"
            : "→ Stable"}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function SessionCard({
  session,
}: {
  session: any;
}) {
  const yes = session.attendances.filter(
    (a: any) => a.status === "YES"
  ).length;

  const no = session.attendances.filter(
    (a: any) => a.status === "NO"
  ).length;

  const maybe = session.attendances.filter(
    (a: any) => a.status === "MAYBE"
  ).length;

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h3 className="font-bold">{session.title}</h3>
      <p className="text-sm text-zinc-500">
        {new Date(session.date).toLocaleDateString("en-GB")} • {session.location}
      </p>

      <div className="flex gap-6 mt-3 text-sm font-semibold">
        <div className="text-green-600">{yes} Attending</div>
        <div className="text-red-500">{no} Not Attending</div>
        <div className="text-zinc-500">{maybe} No Response</div>
      </div>
    </div>
  );
}
