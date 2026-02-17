import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { playerId, teamId } = await req.json();

  const award = await prisma.coachAward.create({
    data: {
      playerId,
      teamId,
    },
  });

  return Response.json(award);
}
