import prisma from "@/lib/prisma";

export async function GET() {
  const sessions = await prisma.session.findMany({
    orderBy: { date: "asc" },
    include: {
      attendances: true,   // 👈 THIS is the missing piece
    },
  });

  return Response.json(sessions);
}

export async function POST(req: Request) {
  const body = await req.json();

  const session = await prisma.session.create({
    data: {
      title: body.title,
      opponent: body.opponent,
      type: body.type,
      location: body.location,
      date: new Date(body.date),
      time: body.time,
      kit: body.kit,
    },
  });

  return Response.json(session);
}
