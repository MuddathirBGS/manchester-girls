import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const formData = await req.formData();
  const sessionId = formData.get("sessionId") as string;

  if (!sessionId) {
    return Response.json({ error: "Missing sessionId" }, { status: 400 });
  }

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      opponentScore: {
        increment: 1,
      },
    },
  });

  return Response.json({ success: true });
}
