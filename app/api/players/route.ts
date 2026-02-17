import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET players
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId");

  const players = await prisma.player.findMany({
    where: teamId ? { teamId } : {},
    orderBy: { name: "asc" },
  });

  return NextResponse.json(players);
}

// CREATE player
export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("PLAYER CREATE BODY:", body);

    if (!body.name) {
      return NextResponse.json(
        { error: "Missing name" },
        { status: 400 }
      );
    }

    if (!body.teamId) {
      return NextResponse.json(
        { error: "Missing teamId" },
        { status: 400 }
      );
    }

    if (!body.parentId) {
      return NextResponse.json(
        { error: "Missing parentId" },
        { status: 400 }
      );
    }

    const player = await prisma.player.create({
      data: {
        name: body.name,
        number: body.number || null,
        position: body.position || null,
        teamId: body.teamId,
        parentId: body.parentId,
      },
    });

    return NextResponse.json(player);
  } catch (err: any) {
    console.error("PLAYER CREATE ERROR:", err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
