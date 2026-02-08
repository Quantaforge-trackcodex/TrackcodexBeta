import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Fixing Enterprise Access...");

  // 1. Ensure 'acme' enterprise exists
  let enterprise = await prisma.enterprise.findUnique({
    where: { slug: "acme" },
  });

  if (!enterprise) {
    console.log("Creating 'acme' enterprise...");
    enterprise = await prisma.enterprise.create({
      data: {
        name: "Acme Corp",
        slug: "acme",
        plan: "ENTERPRISE",
        status: "ACTIVE",
      },
    });
  } else {
    console.log("'acme' enterprise already exists.");
  }

  // 2. Add ALL users as members
  const users = await prisma.user.findMany();

  for (const user of users) {
    const isMember = await prisma.enterpriseMember.findUnique({
      where: {
        enterpriseId_userId: {
          enterpriseId: enterprise.id,
          userId: user.id,
        },
      },
    });

    if (!isMember) {
      console.log(`Adding user ${user.email} to 'acme'...`);
      await prisma.enterpriseMember.create({
        data: {
          enterpriseId: enterprise.id,
          userId: user.id,
          role: "MEMBER", // Default role
        },
      });
    } else {
      console.log(`User ${user.email} is already a member.`);
    }
  }

  console.log("Enterprise access fixed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
