import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { playerId, sessionId } = await req.json();

    if (!playerId || !sessionId) {
      return new Response(
        JSON.stringify({ error: "Missing data" }),
        { status: 400 }
      );
    }

    /* ===============================
       1️⃣ FIND LAST GOAL EVENT
    =============================== */

    const lastGoal = await prisma.matchEvent.findFirst({
      where: {
        playerId,
        sessionId,
        type: "GOAL",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lastGoal) {
      return new Response(
        JSON.stringify({ ok: true }),
        { status: 200 }
      );
    }

    /* ===============================
       2️⃣ DELETE MATCH EVENT
    =============================== */

    await prisma.matchEvent.delete({
      where: { id: lastGoal.id },
    });

    /* ===============================
       3️⃣ DECREMENT SESSION SCORE
    =============================== */

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { teamScore: true },
    });

    if (session && session.teamScore > 0) {
      await prisma.session.update({
        where: { id: sessionId },
        data: {
          teamScore: { decrement: 1 },
        },
      });
    }

    /* ===============================
       4️⃣ UPDATE STAT CACHE
    =============================== */

    await prisma.stat.updateMany({
      where: { playerId },
      data: {
        goals: { decrement: 1 },
      },
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("REMOVE GOAL ERROR:", error);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
