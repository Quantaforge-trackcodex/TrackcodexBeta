import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const enterprises = await prisma.enterprise.findMany({
    select: { slug: true, id: true, name: true, domain: true },
  });

  fs.writeFileSync(
    "enterprise_dump.json",
    JSON.stringify(enterprises, null, 2),
  );
  console.log(
    "Dumped " + enterprises.length + " enterprises to enterprise_dump.json",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
