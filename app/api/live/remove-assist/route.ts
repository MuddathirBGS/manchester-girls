import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const formData = await req.formData();
  const playerId = formData.get("playerId") as string;

  if (!playerId) {
    return Response.json({ error: "Missing playerId" }, { status: 400 });
  }

  const stat = await prisma.stat.findUnique({
    where: { playerId },
  });

  if (!stat) {
    return Response.json({ ok: true });
  }

  await prisma.stat.update({
    where: { playerId },
    data: {
      assists: {
        decrement: stat.assists > 0 ? 1 : 0,
      },
    },
  });

  return Response.redirect(req.headers.get("referer") || "/coach/live-stats");
}
