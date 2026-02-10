import prisma from "@/lib/prisma";

export async function GET() {
  const user = await prisma.user.create({
    data: {
      name: "Coach Mike",
      email: "coach@test.com",
      password: "1234",
      role: "COACH",
      team: "U12"
    }
  });

  return Response.json(user);
}
