import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: { email: "test@example.com" },
    });

    if (existing) {
      console.log("Test user exists, updating password...");
      const hashedPassword = await bcrypt.hash("test123", 10);
      await prisma.user.update({
        where: { id: existing.id },
        data: { password: hashedPassword },
      });
      console.log("✅ Password updated to: test123");
      console.log("Email: test@example.com");
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash("test123", 10);

    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        username: "testuser",
        name: "Test User",
        password: hashedPassword,
        role: "user",
        profileCompleted: true,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    console.log("✅ Test user created successfully!");
    console.log("Email: test@example.com");
    console.log("Username: testuser");
    console.log("Password: test123");
    console.log("User ID:", user.id);
  } catch (error) {
    console.error("Error creating test user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
