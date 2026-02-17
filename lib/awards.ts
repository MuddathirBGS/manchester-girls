import prisma from "@/lib/prisma";

export async function getPlayerOfMonth(teamId: string) {
  const players = await prisma.player.findMany({
    where: { teamId },
    include: {
      stats: true,
      awardVotes: true,
    },
  });

  const score = (p: any) =>
    (p.stats?.goals || 0) * 5 +
    (p.stats?.assists || 0) * 3 +
    (p.stats?.saves || 0) * 2 +
    (p.awardVotes?.length || 0) * 4;

  return [...players].sort((a, b) => score(b) - score(a))[0] || null;
}

export async function getGoldenBoot(teamId: string) {
  const players = await prisma.player.findMany({
    where: { teamId },
    include: { stats: true },
  });

  return (
    [...players].sort(
      (a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0)
    )[0] || null
  );
}

export async function getTopSaver(teamId: string) {
  const players = await prisma.player.findMany({
    where: { teamId },
    include: { stats: true },
  });

  return (
    [...players].sort(
      (a, b) => (b.stats?.saves || 0) - (a.stats?.saves || 0)
    )[0] || null
  );
}
