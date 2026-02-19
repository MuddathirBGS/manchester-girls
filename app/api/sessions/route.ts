import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId") || undefined;

    const sessions = await prisma.session.findMany({
      where: teamId ? { teamId } : {},
      orderBy: { date: "asc" },
      include: {
        attendances: true,
        team: true,
        events: true,
      },
    });

    return NextResponse.json(sessions);
  } catch (error: any) {
    console.error("GET SESSIONS ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

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
        meetTime: body.meetTime ?? null,
        notes: body.notes ?? null,
        poster: body.poster ?? null,
        photoUrl: body.photoUrl ?? null,
        coachPotmId: body.coachPotmId ?? null,
        parentPotmId: body.parentPotmId ?? null,
      },
    });

    const players = await prisma.player.findMany({
      where: { teamId: body.teamId },
      select: { id: true },
    });

    if (players.length > 0) {
      await prisma.attendance.createMany({
        data: players.map((p) => ({
          playerId: p.id,
          sessionId: session.id,
          status: "PENDING",
        })),
      });
    }

    return NextResponse.json(session);
  } catch (err: any) {
    console.error("SESSION CREATE ERROR:", err);

    return NextResponse.json(
      { error: err?.message || "Failed to create session" },
      { status: 500 }
    );
  }
}
