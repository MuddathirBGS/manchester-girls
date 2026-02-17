export async function getPlayerOfMonth(teamId: string) {
  const players = await prisma.player.findMany({
    where: { teamId },
    include: {
      stats: true,
      attendances: true,
      awardVotes: true,
    },
  });

  let winner = null;
  let topScore = 0;

  for (const p of players) {
    const goals = p.stats?.goals || 0;
    const assists = p.stats?.assists || 0;
    const saves = p.stats?.saves || 0;

    const statScore =
      goals * 5 +
      assists * 3 +
      saves * 2;

    const coachVotes = p.awardVotes.filter(v => v.type === "COACH").length;
    const parentVotes = p.awardVotes.filter(v => v.type === "PARENT").length;

    const total =
      statScore +
      coachVotes * 25 +
      parentVotes * 10;

    if (total > topScore) {
      topScore = total;
      winner = p;
    }
  }

  return winner;
}
