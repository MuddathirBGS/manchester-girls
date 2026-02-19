import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();

    // 🔥 THIS is the key fix for Next 16
    const { id } = await context.params;

    if (!id) {
      return new NextResponse("Missing session id", { status: 400 });
    }

    const session = await prisma.session.update({
      where: { id },
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
        notes: body.notes,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return new NextResponse("Failed to update session", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.session.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return new NextResponse("Failed to delete session", { status: 500 });
  }
}
