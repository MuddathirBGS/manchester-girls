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
       1️⃣ CREATE MATCH EVENT
    =============================== */

    await prisma.matchEvent.create({
      data: {
        playerId,
        sessionId,
        type: "GOAL",
        value: 1,
      },
    });

    /* ===============================
       2️⃣ UPDATE SESSION SCORE
    =============================== */

    await prisma.session.update({
      where: { id: sessionId },
      data: {
        teamScore: { increment: 1 },
      },
    });

    /* ===============================
       3️⃣ UPDATE STAT TABLE (CACHE)
    =============================== */

    await prisma.stat.upsert({
      where: { playerId },
      update: { goals: { increment: 1 } },
      create: {
        playerId,
        goals: 1,
        assists: 0,
        saves: 0,
      },
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GOAL ERROR:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
