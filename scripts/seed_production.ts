import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Global Hardware Sync (Seeding)...");

  // 1. Create System Admin
  const hashedPassword = await bcrypt.hash("trackcodex2026", 10);
  const systemUser = await prisma.user.upsert({
    where: { email: "admin@quantaforge.io" },
    update: {},
    create: {
      email: "admin@quantaforge.io",
      username: "quanta_admin",
      password: hashedPassword, // Matches schema.prisma line 17
      name: "Quanta Admin",
      avatar: "https://ui-avatars.com/api/?name=QA&background=0D8ABC&color=fff",
    },
  });

  console.log("✅ System Admin created/verified.");

  // 2. Seed Repositories
  const repos = [
    {
      id: "trackcodex-core",
      name: "trackcodex-core",
      description:
        "The high-performance engine powering real-time code analysis and hardware sync.",
      isPublic: true,
      language: "TypeScript",
      stars: 1205,
      forks: 240,
    },
    {
      id: "quantacode-ui",
      name: "quantacode-ui",
      description: "Professional IDE frontend for the TrackCodex ecosystem.",
      isPublic: true,
      language: "TypeScript",
      stars: 890,
      forks: 112,
    },
    {
      id: "aurora-ai-engine",
      name: "aurora-ai-engine",
      description:
        "Localized AI model inference and context extraction service.",
      isPublic: false,
      language: "Python",
      stars: 450,
      forks: 30,
    },
  ];

  for (const repo of repos) {
    await prisma.repository.upsert({
      where: { id: repo.id },
      update: repo,
      create: repo,
    });
  }
  console.log("✅ Repositories synchronized.");

  // 3. Seed Workspaces
  const workspaces = [
    {
      id: "default-workspace",
      name: "Production Environment",
      description: "Primary workspace for trackcodex-core development.",
      ownerId: systemUser.id,
      status: "Ready",
      visibility: "public",
    },
    {
      id: "frontend-lab",
      name: "Frontend Lab",
      description: "Fast-cycle testing for new UI components.",
      ownerId: systemUser.id,
      status: "Ready",
      visibility: "public",
    },
  ];

  for (const ws of workspaces) {
    await prisma.workspace.upsert({
      where: { id: ws.id },
      update: ws,
      create: ws,
    });
  }
  console.log("✅ Workspaces established.");

  // 4. Seed Jobs/Gigs
  const jobs = [
    {
      title: "Senior Distributed Systems Engineer",
      description:
        "Optimize the real-time buffer synchronization layer for global latency reduction.",
      budget: "$200k - $280k",
      type: "Full-time",
      status: "Open",
      techStack: ["Go", "TypeScript", "Redis"],
      creatorId: systemUser.id,
    },
    {
      title: "UI/UX Performance Lead",
      description:
        "Rebuild the file tree explorer for O(1) performance on million-file repos.",
      budget: "$150k - $190k",
      type: "Contract",
      status: "Open",
      techStack: ["React", "Web Workers", "Canvas"],
      creatorId: systemUser.id,
    },
  ];

  for (const job of jobs) {
    // Avoid double-shuffling jobs on re-run
    const exists = await prisma.job.findFirst({ where: { title: job.title } });
    if (!exists) {
      await prisma.job.create({ data: job });
    }
  }
  console.log("✅ Industry Jobs listed.");

  console.log("💎 Hardware Sync Complete! Database is now LIVE.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
