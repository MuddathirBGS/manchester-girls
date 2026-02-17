import prisma from "@/lib/prisma";

export async function GET() {
  const parents = await prisma.parent.findMany({
    orderBy: { name: "asc" },
  });

  return Response.json(parents);
}

export async function POST(req: Request) {
  const body = await req.json();

  const parent = await prisma.parent.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });

  return Response.json(parent);
}
