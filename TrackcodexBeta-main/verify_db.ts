import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const email = "test@example.com";
  const user = await prisma.user.upsert({
    where: { email },
    update: { username: "test_user_updated" },
    create: {
      email,
      username: "test_user",
    },
  });
  console.log("VERIFIED: User created/updated:", user.email);
}

run()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
