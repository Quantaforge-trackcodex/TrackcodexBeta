/**
 * Test script for Git repository cloning functionality
 *
 * This script tests:
 * 1. Repository URL validation
 * 2. Repository cloning
 * 3. Workspace creation with Git import
 *
 * Usage: npx tsx backend/scripts/test-git-cloning.ts
 */

import { gitService } from "../services/gitService";

async function testGitCloning() {
  console.log("🧪 Testing Git Cloning Functionality\n");

  // Test 1: URL Validation
  console.log("Test 1: URL Validation");
  console.log("=".repeat(50));

  const testUrls = [
    "https://github.com/microsoft/vscode.git",
    "https://gitlab.com/gitlab-org/gitlab.git",
    "https://bitbucket.org/atlassian/python-bitbucket.git",
    "not-a-valid-url",
    "https://example.com/repo.git",
  ];

  for (const url of testUrls) {
    const isValid = gitService.isValidGitUrl(url);
    const info = await gitService.getRepositoryInfo(url);
    console.log(`\n  URL: ${url}`);
    console.log(`  Valid: ${isValid ? "✅" : "❌"}`);
    if (info.isValid) {
      console.log(`  Provider: ${info.provider || "unknown"}`);
      console.log(`  Owner: ${info.owner || "unknown"}`);
      console.log(`  Name: ${info.name || "unknown"}`);
    }
  }

  // Test 2: Clone a small repository
  console.log("\n\nTest 2: Clone Small Repository");
  console.log("=".repeat(50));

  const testRepoUrl = "https://github.com/octocat/Hello-World.git";
  const testWorkspaceId = `test-${Date.now()}`;

  console.log(`\n  Cloning: ${testRepoUrl}`);
  console.log(`  Workspace ID: ${testWorkspaceId}`);
  console.log(`  Status: Cloning...`);

  try {
    const clonedPath = await gitService.cloneRepository(
      testRepoUrl,
      testWorkspaceId,
    );
    console.log(`  Status: ✅ Success`);
    console.log(`  Path: ${clonedPath}`);

    // Get current branch
    const branch = await gitService.getCurrentBranch(testWorkspaceId);
    console.log(`  Branch: ${branch}`);

    // Clean up
    console.log(`\n  Cleaning up...`);
    await gitService.deleteWorkspace(testWorkspaceId);
    console.log(`  Status: ✅ Cleaned up`);
  } catch (error: any) {
    console.log(`  Status: ❌ Failed`);
    console.log(`  Error: ${error.message}`);
  }

  console.log("\n\n✨ Tests Complete!\n");
}

// Run tests
testGitCloning().catch(console.error);
