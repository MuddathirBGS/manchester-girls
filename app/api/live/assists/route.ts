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

    /* 1️⃣ Create Match Event */
    await prisma.matchEvent.create({
      data: {
        playerId,
        sessionId,
        type: "ASSIST",
        value: 1,
      },
    });

    /* 2️⃣ Update Stat Table */
    await prisma.stat.upsert({
      where: { playerId },
      update: { assists: { increment: 1 } },
      create: {
        playerId,
        goals: 0,
        assists: 1,
        saves: 0,
      },
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("ASSIST ERROR:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}