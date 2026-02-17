import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { name: "asc" },
    });

    return Response.json(teams);
  } catch (err) {
    console.error("TEAMS ERROR:", err);
    return Response.json({ error: "Failed to load teams" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  const team = await prisma.team.create({
    data: {
      name: body.name,
    },
  });

  return Response.json(team);
}
