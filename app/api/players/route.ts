import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET players
export async function GET() {
  const players = await prisma.player.findMany();

  return NextResponse.json(players);
}

// CREATE player
export async function POST(req: Request) {
  const body = await req.json();

  const player = await prisma.player.create({
    data: {
      name: body.name,
      number: body.number,
      position: body.position,
      parentId: body.parentId,
      teamId: body.teamId,   // ✅ correct relation field
    },
  });

  return NextResponse.json(player);
}
