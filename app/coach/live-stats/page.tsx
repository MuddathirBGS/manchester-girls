export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import LiveStatsClient from "./LiveStatsClient";

const DYNOS_ID = "cmltjiw8a0000396i44vrndkn";
const DIVAS_ID = "cmltjixjz0001396i0ybecwvr";

async function getData(teamId: string) {
  const players = await prisma.player.findMany({
    where: { teamId },
    orderBy: { name: "asc" },
  });

  const sessions = await prisma.session.findMany({
    where: {
      teamId,
      type: { not: "TRAINING" },
    },
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