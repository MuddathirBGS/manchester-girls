import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const formData = await req.formData();
  const sessionId = formData.get("sessionId") as string;

  if (!sessionId) {
    return Response.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      opponentScore: Math.max(0, session.opponentScore - 1),
    },
  });

  return Response.json({ success: true });
}
