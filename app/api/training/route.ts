import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId");

  const training = await prisma.session.findMany({
    where: {
      type: "TRAINING",
      ...(teamId ? { teamId } : {}),
    },
    orderBy: { date: "asc" },
  });

  return Response.json(training);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.teamId) {
      return Response.json(
        { error: "Missing teamId" },
        { status: 400 }
      );
    }

    const session = await prisma.session.create({
      data: {
        title: body.title,
        opponent: "",
        type: "TRAINING",
        location: body.location,
        date: new Date(body.date),
        time: body.time,
        kit: "",
        teamId: body.teamId, // ⭐ REQUIRED
      },
    });

    return Response.json(session);
  } catch (err: any) {
    console.error("TRAINING CREATE ERROR:", err);

    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
