import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const form = await req.formData();
  const playerId = form.get("playerId") as string;

  const stat = await prisma.stat.findUnique({
    where: { playerId },
  });

  if (stat) {
    await prisma.stat.update({
      where: { playerId },
      data: { saves: { increment: 1 } },
    });
  } else {
    await prisma.stat.create({
      data: { playerId, saves: 1 },
    });
  }

  return Response.redirect("/coach/live-stats");
}
