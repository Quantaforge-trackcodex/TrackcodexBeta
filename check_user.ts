import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:password@127.0.0.1:5434/trackcodex",
    },
  },
});

async function checkUser() {
  console.log("Current ENV DATABASE_URL:", process.env.DATABASE_URL);
  const email = "dev@trackcodex.dev";
  console.log(`Checking user: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      loginAttempts: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    console.log("User not found.");
    return;
  }

  console.log("User found:");
  console.log(`- ID: ${user.id}`);
  console.log(`- Username: ${user.username}`);
  console.log(`- Account Locked: ${user.accountLocked}`);
  console.log(`- Profile Completed: ${user.profileCompleted}`);
  console.log(`- Password hash exists: ${!!user.password}`);
  console.log("- Recent Login Attempts:");
  user.loginAttempts.forEach((attempt) => {
    console.log(
      `  [${attempt.createdAt.toISOString()}] Success: ${attempt.success}, Reason: ${attempt.failureReason}, IP: ${attempt.ipAddress}`,
    );
  });
}

checkUser()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
