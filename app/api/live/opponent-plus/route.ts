import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Missing sessionId" }),
        { status: 400 }
      );
    }

    /* ===============================
       1️⃣ INCREMENT SESSION SCORE
    =============================== */

    await prisma.session.update({
      where: { id: sessionId },
      data: {
        opponentScore: { increment: 1 },
      },
    });

    /* ===============================
       2️⃣ CREATE MATCH EVENT
    =============================== */

    await prisma.matchEvent.create({
      data: {
        sessionId,
        type: "OPPONENT_GOAL",
        value: 1,
      },
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("OPPONENT PLUS ERROR:", error);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
