import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "dev@trackcodex.dev";
  const password = "password";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      profileCompleted: true,
      emailVerified: true,
    },
    create: {
      email,
      username: "dev_user",
      password: hashedPassword,
      name: "Developer",
      role: "admin",
      profileCompleted: true,
      emailVerified: true,
    },
  });

  console.log("Seeded user:", user.email);
}

seed()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
