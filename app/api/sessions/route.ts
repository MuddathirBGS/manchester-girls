import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId") || undefined;

  const sessions = await prisma.session.findMany({
    where: teamId ? { teamId } : {},
    orderBy: { date: "asc" },
    include: {
      attendances: true,
      team: true,

      // 🆕 include POTM player info (for display later)
      events: true,
    },
  });

  return Response.json(sessions);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1️⃣ Create the fixture/session
    const session = await prisma.session.create({
      data: {
        title: body.title,
        opponent: body.opponent,
        type: body.type,
        location: body.location,
        date: new Date(body.date),
        time: body.time,
        kit: body.kit,
        teamId: body.teamId,

        // 🆕 NEW FIELDS (safe defaults)
        meetTime: body.meetTime ?? null,
        notes: body.notes ?? null,
        poster: body.poster ?? null,
        photoUrl: body.photoUrl ?? null,
        coachPotmId: body.coachPotmId ?? null,
        parentPotmId: body.parentPotmId ?? null,
      },
    });

    // 2️⃣ Get all players from that team
    const players = await prisma.player.findMany({
      where: { teamId: body.teamId },
      select: { id: true },
    });

    // 3️⃣ Auto-create attendance records
    if (players.length > 0) {
      await prisma.attendance.createMany({
        data: players.map((p) => ({
          playerId: p.id,
          sessionId: session.id,
          status: "PENDING",
        })),
      });
    }

    return Response.json(session);
  } catch (err) {
    console.error("SESSION CREATE ERROR:", err);
    return Response.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
