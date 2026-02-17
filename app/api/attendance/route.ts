import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId") || undefined;

  const sessions = await prisma.session.findMany({
    where: teamId ? { teamId } : {},
    orderBy: { date: "asc" },
    include: {
      attendances: true,
    },
  });

  // Add live attendance counts
  const sessionsWithCounts = sessions.map((s) => {
    const yes = s.attendances.filter((a) => a.status === "YES").length;
    const no = s.attendances.filter((a) => a.status === "NO").length;
    const pending = s.attendances.filter(
      (a) => a.status === "PENDING"
    ).length;

    return {
      ...s,
      yesCount: yes,
      noCount: no,
      pendingCount: pending,
      totalPlayers: s.attendances.length,
    };
  });

  return Response.json(sessionsWithCounts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.teamId) {
      return Response.json(
        { error: "teamId is required" },
        { status: 400 }
      );
    }

    // Ensure date is valid
    const sessionDate = new Date(body.date);

    if (isNaN(sessionDate.getTime())) {
      return Response.json(
        { error: "Invalid date provided" },
        { status: 400 }
      );
    }

    // 1️⃣ Create session
    const session = await prisma.session.create({
      data: {
        title: body.title,
        opponent: body.opponent || "",
        type: body.type || "MATCH",
        location: body.location,
        date: sessionDate,
        time: body.time,
        kit: body.kit || null,
        teamId: body.teamId,
      },
    });

    // 2️⃣ Get all players in that team
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
