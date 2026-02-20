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

  const trainingSessions = sessions.filter((s) => s.type === "TRAINING");
  const matchSessions = sessions.filter((s) => s.type !== "TRAINING");

  const calculateRate = (arr: SessionWithAttendance[]): number => {
    let yes = 0;
    let total = 0;

    arr.forEach((s) => {
      const y = s.attendances.filter((a) => a.status === "YES").length;
      const n = s.attendances.filter((a) => a.status === "NO").length;
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
        p.matchYes + p.matchNo + p.trainingYes + p.trainingNo;

      const yes = p.matchYes + p.trainingYes;

      const pct = total ? Math.round((yes / total) * 100) : 0;

      return { ...p, pct };
    })
    .sort((a, b) => b.pct - a.pct);

  const lowAttendance = leaderboard.filter((p) => p.pct < 75);

  const matchOnlyPlayers = leaderboard.filter(
    (p) => p.matchYes > 0 && p.trainingYes === 0
  );

  const trainingToMatchRatio =
    matchSessions.length > 0
      ? (trainingSessions.length / matchSessions.length).toFixed(2)
      : "0";

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="mb-12">
          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
              Attendance Dashboard
              <span className="block text-pink-500 text-lg font-medium mt-2">
                Team Attendance Overview
              </span>
            </h1>

            <p className="text-base text-zinc-500 max-w-xl">
              Track match and training attendance trends and participation.
            </p>
          </div>

          <div className="mt-8 border-t border-pink-200" />

          <div className="mt-6">
            <CoachSubNav teamId={teamId} />
          </div>
        </div>

        {/* TEAM SELECTOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <Link href={`/attendance?team=${DYNOS_ID}`}>
            <div
              className={`cursor-pointer p-6 rounded-xl shadow-md border transition ${
                teamId === DYNOS_ID
                  ? "border-pink-500 ring-2 ring-pink-300 bg-white"
                  : "bg-white border-pink-200"
              }`}
            >
              <div className="font-bold text-xl text-zinc-900">Dynos</div>
              <div className="text-sm text-zinc-500">U9</div>
            </div>
          </Link>

          <Link href={`/attendance?team=${DIVAS_ID}`}>
            <div
              className={`cursor-pointer p-6 rounded-xl shadow-md border transition ${
                teamId === DIVAS_ID
                  ? "border-pink-500 ring-2 ring-pink-300 bg-white"
                  : "bg-white border-pink-200"
              }`}
            >
              <div className="font-bold text-xl text-zinc-900">Divas</div>
              <div className="text-sm text-zinc-500">U9</div>
            </div>
          </Link>
        </div>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-12">
          <KPI label="Overall %" value={`${overallRate}%`} trend={overallTrend} />
          <KPI label="Match %" value={`${matchRate}%`} trend={matchTrend} />
          <KPI label="Training %" value={`${trainingRate}%`} trend={trainingTrend} />
          <KPI label="Matches" value={`${matchSessions.length}`} />
          <KPI label="Training Sessions" value={`${trainingSessions.length}`} />
          <KPI label="Training:Match Ratio" value={`${trainingToMatchRatio}`} />
        </div>

        {/* MATCHES */}
        {matchSessions.length > 0 && (
          <Section title="Matches">
            {matchSessions.map((s) => (
              <SessionCard key={s.id} session={s} type="match" />
            ))}
          </Section>
        )}

        {/* TRAINING */}
        {trainingSessions.length > 0 && (
          <Section title="Training Sessions">
            {trainingSessions.map((s) => (
              <SessionCard key={s.id} session={s} type="training" />
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

/* COMPONENTS */

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
    <div className="bg-white border border-pink-200 rounded-xl p-5 shadow-md">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-3xl font-bold text-zinc-900 mt-2">{value}</div>

      {trend && (
        <div
          className={`text-sm mt-2 font-semibold ${
            trend === "up"
              ? "text-green-600"
              : trend === "down"
              ? "text-red-500"
              : "text-zinc-500"
          }`}
        >
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
    <div className="mb-12">
      <h2 className="text-xl font-bold text-zinc-900 mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {children}
      </div>
    </div>
  );
}

function SessionCard({
  session,
  type,
}: {
  session: any;
  type: "match" | "training";
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
    <div className="bg-white rounded-xl shadow-md border border-pink-200 overflow-hidden transition">
      <div className={`h-2 ${type === "match" ? "bg-pink-500" : "bg-zinc-900"}`} />

      <div className="p-5">
        <h3 className={`font-semibold text-lg ${
          type === "match" ? "text-pink-600" : "text-zinc-900"
        }`}>
          {session.title}
        </h3>

        <div className="text-sm text-zinc-600 mt-1">
          📅 {new Date(session.date).toLocaleDateString("en-GB")}
        </div>

        {session.location && (
          <div className="text-sm text-zinc-600">
            📍 {session.location}
          </div>
        )}

        <div className="flex gap-6 mt-4 text-sm font-semibold">
          <div className="text-green-600">👥 {yes} Attending</div>
          <div className="text-red-500">{no} Not Attending</div>
          <div className="text-zinc-500">{maybe} No Response</div>
        </div>
      </div>
    </div>
  );
}