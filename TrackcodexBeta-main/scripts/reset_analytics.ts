import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Purging Analytics Data...');
    await prisma.dailyContribution.deleteMany({});
    await prisma.activityLog.deleteMany({});
    console.log('Analytics Tables Cleared. User starts fresh.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
