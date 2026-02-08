import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function ensureProfileExists() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, username: true, name: true },
    });

    console.log(`Found ${users.length} users`);

    for (const user of users) {
      // Check if profile exists
      const profile = await prisma.profile.findUnique({
        where: { userId: user.id },
      });

      if (!profile) {
        console.log(`Creating profile for user: ${user.username}`);
        await prisma.profile.create({
          data: {
            userId: user.id,
            bio: "",
            location: "",
            website: "",
            company: "",
            followersCount: 0,
            followingCount: 0,
          },
        });
        console.log(`✅ Profile created for ${user.username}`);
      } else {
        console.log(
          `✅ Profile exists for ${user.username} (followers: ${profile.followersCount}, following: ${profile.followingCount})`,
        );
      }
    }

    console.log("\n✅ All users have profiles!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

ensureProfileExists();
