import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/* ================================
   GET PLAYERS
================================ */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    const players = await prisma.player.findMany({
      where: teamId ? { teamId } : {},
      orderBy: { name: "asc" },
      include: {
        stats: true,
        awardVotes: true,
      },
    });

    return NextResponse.json(players);
  } catch (error: any) {
    console.error("GET PLAYERS ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Server error while fetching players" },
      { status: 500 }
    );
  }
}

/* ================================
   CREATE PLAYER
================================ */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name)
      return NextResponse.json({ error: "Missing name" }, { status: 400 });

    if (!body.teamId)
      return NextResponse.json({ error: "Missing teamId" }, { status: 400 });

    if (!body.parentId)
      return NextResponse.json({ error: "Missing parentId" }, { status: 400 });

    // Ensure they are strings
    const teamId: string = String(body.teamId);
    const parentId: string = String(body.parentId);

    const player = await prisma.player.create({
      data: {
        name: body.name,
        number: body.number ?? null,
        position: body.position ?? null,
        teamId,
        parentId,
      },
      include: {
        stats: true,
        awardVotes: true,
      },
    });

    return NextResponse.json(player);
  } catch (error: any) {
    console.error("PLAYER CREATE ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Server error while creating player" },
      { status: 500 }
    );
  }
}
