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
        type: "SAVE",
        value: 1,
      },
    });

    /* ===============================
       2️⃣ UPDATE STAT CACHE
    =============================== */

    await prisma.stat.upsert({
      where: { playerId },
      update: {
        saves: { increment: 1 },
      },
      create: {
        playerId,
        goals: 0,
        assists: 0,
        saves: 1,
      },
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("SAVE ADD ERROR:", error);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
