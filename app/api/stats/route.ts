import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const { playerId, goals, assists, saves } = body;

  const stat = await prisma.stat.upsert({
    where: { playerId },
    update: {
      goals,
      assists,
      saves,
    },
    create: {
      playerId,
      goals,
      assists,
      saves,
    },
  });

  return Response.json(stat);
}
