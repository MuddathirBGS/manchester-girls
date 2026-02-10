import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const { playerId, sessionId, status } = body;

  const record = await prisma.attendance.upsert({
    where: {
      playerId_sessionId: {
        playerId,
        sessionId,
      },
    },
    update: {
      status,
    },
    create: {
      playerId,
      sessionId,
      status,
    },
  });

  return Response.json(record);
}
