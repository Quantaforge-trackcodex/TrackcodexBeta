import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  try {
    const slug = "acme"; // Default slug expected by UI

    // Check if exists
    let ent = await prisma.enterprise.findUnique({
      where: { slug },
    });

    if (ent) {
      console.log(`Enterprise '${slug}' already exists.`);
    } else {
      // Create Acme Corp
      ent = await prisma.enterprise.create({
        data: {
          slug,
          name: "Acme Corp",
          plan: "ENTERPRISE",
          status: "ACTIVE",
          // Removed ownerId as per schema
        },
      });
      console.log("Created Enterprise:", ent);
    }

    // Now assign the first user as the OWNER
    const user = await prisma.user.findFirst();
    if (!user) {
      console.error(
        "No users found in database. Please register a user first.",
      );
      return;
    }

    const member = await prisma.enterpriseMember.findUnique({
      where: {
        enterpriseId_userId: {
          enterpriseId: ent!.id,
          userId: user.id,
        },
      },
    });

    if (!member) {
      await prisma.enterpriseMember.create({
        data: {
          enterpriseId: ent!.id,
          userId: user.id,
          role: "OWNER",
        },
      });
      console.log(`Added user ${user.email} as OWNER of ${slug}`);
    } else {
      console.log(`User ${user.email} is already a member.`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
