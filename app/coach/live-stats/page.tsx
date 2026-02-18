import prisma from "@/lib/prisma";
import TeamSelector from "./TeamSelector";
import LiveStatsClient from "./LiveStatsClient";

const DYNOS_ID = "cmlp8lhno00004lay76ixxb2n";
const DIVAS_ID = "cmlp8lji200014lays2jfga30";

async function getData(teamId: string) {
  const players = await prisma.player.findMany({
    where: { teamId },
    include: { stats: true },
    orderBy: { name: "asc" },
  });

  const sessions = await prisma.session.findMany({
    where: { teamId, type: { not: "TRAINING" } },
    orderBy: { date: "asc" },
  });

  return { players, sessions };
}

export default async function LiveStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string; session?: string }>;
}) {
  const params = await searchParams;

  const teamId = params.team || DYNOS_ID;
  const sessionId = params.session;

  const { players, sessions } = await getData(teamId);

  const selectedSession =
    sessions.find((s) => s.id === sessionId) || null;

  return (
    <LiveStatsClient
      players={players}
      sessions={sessions}
      selectedSession={selectedSession}
      teamId={teamId}
      DYNOS_ID={DYNOS_ID}
      DIVAS_ID={DIVAS_ID}
    />
  );
}
