import prisma from "@/lib/prisma";

export async function getStatLeaders(teamId: string) {
  const players = await prisma.player.findMany({
    where: { teamId },
    include: { stats: true },
  });

  let topGoals = null;
  let topAssists = null;
  let topSaves = null;

  for (const p of players) {
    if (!p.stats) continue;

    if (!topGoals || p.stats.goals > topGoals.stats.goals)
      topGoals = p;

    if (!topAssists || p.stats.assists > topAssists.stats.assists)
      topAssists = p;

    if (!topSaves || p.stats.saves > topSaves.stats.saves)
      topSaves = p;
  }

  return {
    topGoals,
    topAssists,
    topSaves,
  };
}
