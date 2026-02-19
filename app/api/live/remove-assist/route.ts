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
       1️⃣ FIND LAST ASSIST EVENT
    =============================== */

    const lastAssist = await prisma.matchEvent.findFirst({
      where: {
        playerId,
        sessionId,
        type: "ASSIST",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lastAssist) {
      return new Response(
        JSON.stringify({ ok: true }),
        { status: 200 }
      );
    }

    /* ===============================
       2️⃣ DELETE MATCH EVENT
    =============================== */

    await prisma.matchEvent.delete({
      where: { id: lastAssist.id },
    });

    /* ===============================
       3️⃣ UPDATE STAT CACHE
    =============================== */

    await prisma.stat.updateMany({
      where: { playerId },
      data: {
        assists: { decrement: 1 },
      },
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("REMOVE ASSIST ERROR:", error);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
