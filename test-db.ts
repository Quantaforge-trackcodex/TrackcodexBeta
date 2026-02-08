import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function test() {
  try {
    console.log("Testing DB connection...");
    await prisma.$connect();
    console.log("✅ DB Connected successfully!");
    const users = await prisma.user.count();
    console.log("User count:", users);
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ DB Connection failed:", err);
    process.exit(1);
  }
}
test();
