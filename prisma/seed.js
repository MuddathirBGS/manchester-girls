const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding teams...");

  await prisma.team.upsert({
    where: { name: "Dynos" },
    update: {},
    create: { name: "Dynos" },
  });

  await prisma.team.upsert({
    where: { name: "Divas" },
    update: {},
    create: { name: "Divas" },
  });

  console.log("✅ Teams seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
