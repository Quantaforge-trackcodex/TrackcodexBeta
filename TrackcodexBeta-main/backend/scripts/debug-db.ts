import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function debug() {
  try {
    const all = await prisma.enterprise.findMany();
    console.log("ALL ENTERPRISES IN DB:");
    console.log(JSON.stringify(all, null, 2));

    const acme = await prisma.enterprise.findUnique({
      where: { slug: "acme" },
    });
    console.log("Direct lookup for 'acme':", acme);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

debug();
