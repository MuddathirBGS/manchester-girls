import prisma from "@/lib/prisma";

export async function GET() {
  const training = await prisma.session.findMany({
    where: {
      type: "TRAINING",
    },
    orderBy: { date: "asc" },
  });

  return Response.json(training);
}

export async function POST(req: Request) {
  const body = await req.json();

  const session = await prisma.session.create({
    data: {
      title: body.title,
      opponent: "",        // not used for training
      type: "TRAINING",    // 🔥 key part
      location: body.location,
      date: new Date(body.date),
      time: body.time,
      kit: "",             // not used
    },
  });

  return Response.json(session);
}
