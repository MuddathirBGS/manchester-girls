import prisma from "@/lib/prisma";

export async function getVoteWinner(teamId: string, type: string) {
  const votes = await prisma.awardVote.groupBy({
    by: ["playerId"],
    where: { teamId, type },
    _count: { playerId: true },
    orderBy: {
      _count: { playerId: "desc" },
    },
    take: 1,
  });

  if (!votes.length) return null;

  return prisma.player.findUnique({
    where: { id: votes[0].playerId },
  });
}
