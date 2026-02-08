import { SecurityService } from "./backend/services/securityService";
import { GitServer } from "./backend/services/git/gitServer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runVerification() {
  console.log("--- STARTING REAL FEATURE VERIFICATION ---");

  // 1. Get a Repo
  const repo = await prisma.repository.findFirst();
  if (!repo) {
    console.error("No repositories found in DB to test with.");
    return;
  }
  console.log(`Testing with Repo: ${repo.name} (${repo.id})`);

  // 2. Ensure Git Repo Exists for it
  const gitServer = new GitServer();
  await gitServer.ensureRepoExists(repo.id);

  // 3. Test SecurityService (Real Git Grep)
  try {
    console.log("Running Security Scan (Git Grep)...");
    // This will now run 'git grep' on the bare repo HEAD
    const alerts = await SecurityService.performFullScan(repo.id);
    console.log(`Security Scan completed. Found ${alerts.length} alerts.`);
    if (alerts.length > 0) {
      console.log("Sample Alert:", JSON.stringify(alerts[0], null, 2));
    }
  } catch (e) {
    console.error("Security Scan Failed:", e);
  }

  // 4. Test Insights logic (Prisma)
  try {
    console.log("Testing Insights DB Queries...");
    const prCount = await prisma.pullRequest.count({
      where: { repoId: repo.id },
    });
    console.log(`Total Pull Requests in DB: ${prCount}`);

    const issueCount = await prisma.issue.count({ where: { repoId: repo.id } });
    console.log(`Total Issues in DB: ${issueCount}`);
  } catch (e) {
    console.error("Insights Query Failed:", e);
  }

  console.log("--- VERIFICATION COMPLETE ---");
}

runVerification()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
