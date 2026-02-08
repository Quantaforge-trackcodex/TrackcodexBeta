import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REAL_JOBS = [
    {
        title: "Senior Billing Engineer",
        description: "Implement idempotency keys for terminal reader connections. Work with the Stripe Terminal team to ensure 99.999% reliability.",
        budget: "$180k - $240k",
        type: "Full-time",
        techStack: ["TypeScript", "React", "API Design"],
        creatorName: "Stripe Engineering",
        creatorAvatar: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
        repoId: "stripe/stripe-terminal-js"
    },
    {
        title: "Platform Integrity Engineer",
        description: "Optimize circuit breaker timeout propagation for 5G edge cases. Help Netflix maintain streaming quality during high-load events.",
        budget: "$220k - $310k",
        type: "Full-time",
        techStack: ["Java", "Spring", "Distributed Systems"],
        creatorName: "Netflix OSS",
        creatorAvatar: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png",
        repoId: "Netflix/Hystrix"
    },
    {
        title: "Frontend Infra Architect",
        description: "Refactor middleware runtime to support edge-cached WASM assets. Join the Vercel team building the next generation of the web.",
        budget: "$160k - $210k",
        type: "Contract",
        techStack: ["Rust", "Go", "Next.js"],
        creatorName: "Vercel",
        creatorAvatar: "https://assets.vercel.com/image/upload/q_auto/front/favicon/vercel/180x180.png",
        repoId: "vercel/next.js"
    }
];

async function main() {
    console.log('Seeding Real Jobs...');

    // Ensure we have a user to attach these to (or create a bot user)
    let botUser = await prisma.user.findFirst({ where: { username: 'enterprise_bot' } });
    if (!botUser) {
        botUser = await prisma.user.create({
            data: {
                username: 'enterprise_bot',
                email: 'bot@trackcodex.com',
                passwordHash: 'hashed_secret',
                name: 'Enterprise Bot',
                avatar: 'https://ui-avatars.com/api/?name=Bot'
            }
        });
    }

    for (const job of REAL_JOBS) {
        await prisma.job.create({
            data: {
                title: job.title,
                description: job.description,
                budget: job.budget,
                type: job.type,
                techStack: job.techStack,
                status: 'Open',
                creatorId: botUser.id,
                // In a real app we'd map this better, but for now we store metadata in description or new fields
                // Using existing 'org' relation would be better but keeping it simple for speed
                // We'll actually create 'Org' records for better realism if possible?
                // Let's stick to the Job model.
                // We can put the company name in the description or title for now to match UI
            }
        });
    }
    console.log('Seeded 3 Enterprise Jobs.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
