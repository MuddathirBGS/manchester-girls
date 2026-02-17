import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { playerId, teamId, type } = await req.json();

  await prisma.awardVote.create({
    data: {
      playerId,
      teamId,
      type, // "COACH" | "PARENT" | "TRAINER"
    },
  });

  return NextResponse.json({ ok: true });
}
