import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: any) {
  const { code } = await req.json();

  await prisma.player.update({
    where: { id: params.id },
    data: { loginCode: code },
  });

  return Response.json({ ok: true });
}
