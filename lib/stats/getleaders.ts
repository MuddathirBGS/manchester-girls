import prisma from "@/lib/prisma";

export async function getLeaders(teamId: string) {
  const players = await prisma.player.findMany({
    where: { teamId },
    include: { stats: true },
  });

  let topGoals: any = null;
  let topAssists: any = null;
  let topSaves: any = null;

  for (const p of players) {
    if (!p.stats) continue;

    if (
      !topGoals ||
      (p.stats?.goals || 0) > (topGoals.stats?.goals || 0)
    ) {
      topGoals = p;
    }

    if (
      !topAssists ||
      (p.stats?.assists || 0) > (topAssists.stats?.assists || 0)
    ) {
      topAssists = p;
    }

    if (
      !topSaves ||
      (p.stats?.saves || 0) > (topSaves.stats?.saves || 0)
    ) {
      topSaves = p;
    }
  }

  return {
    topGoals,
    topAssists,
    topSaves,
  };
}
