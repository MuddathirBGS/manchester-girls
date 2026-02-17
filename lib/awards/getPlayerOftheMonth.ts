import prisma from "@/lib/prisma";

export async function getPlayerOfTheMonth(teamId: string) {
  const players = await prisma.player.findMany({
    where: { teamId },
    include: { stats: true },
  });

  let winner: any = null;
  let bestScore = -1;

  for (const p of players) {
    const goals = p.stats?.goals || 0;
    const assists = p.stats?.assists || 0;
    const saves = p.stats?.saves || 0;

    // weight system
    const score =
      goals * 5 +
      assists * 3 +
      saves * 2;

    if (score > bestScore) {
      bestScore = score;
      winner = p;
    }
  }

  return winner;
}
