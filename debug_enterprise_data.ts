import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const enterprises = await prisma.enterprise.findMany({
    select: { slug: true, id: true, name: true },
  });
  console.log("ENTERPRISE_LIST_START");
  enterprises.forEach((e) =>
    console.log(`Slug: ${e.slug}, Name: ${e.name}, ID: ${e.id}`),
  );
  console.log("ENTERPRISE_LIST_END");
}
main().finally(() => prisma.$disconnect());
