#!/usr/bin/env node

/**
 * TrackCodex VS Code Web Builder
 * Compiles VS Code OSS Web edition with TrackCodex branding
 */

import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");
const VSCODE_ROOT = path.join(PROJECT_ROOT, ".vscode_engine");
const PRODUCT_CONFIG = path.join(VSCODE_ROOT, "product.trackcodex.json");
const VSCODE_PRODUCT = path.join(VSCODE_ROOT, "product.json");

console.log("🚀 TrackCodex VS Code Web Builder\n");

// Step 1: Verify VS Code source exists
if (!fs.existsSync(VSCODE_ROOT)) {
  console.error("❌ VS Code source not found at:", VSCODE_ROOT);
  console.log("Please clone VS Code OSS first:");
  console.log(
    "  git clone https://github.com/microsoft/vscode.git .vscode_engine",
  );
  process.exit(1);
}

// Step 2: Backup original product.json
if (!fs.existsSync(PRODUCT_CONFIG)) {
  console.error("❌ TrackCodex product config not found:", PRODUCT_CONFIG);
  process.exit(1);
}

console.log("✅ Found VS Code source");
console.log("✅ Found TrackCodex product config\n");

// Step 3: Apply TrackCodex product configuration
console.log("📝 Applying TrackCodex branding...");
const productBackup = VSCODE_PRODUCT + ".original";
if (!fs.existsSync(productBackup)) {
  fs.copyFileSync(VSCODE_PRODUCT, productBackup);
  console.log("   Backed up original product.json");
}
fs.copyFileSync(PRODUCT_CONFIG, VSCODE_PRODUCT);
console.log("✅ TrackCodex branding applied\n");

// Step 4: Install dependencies
console.log("📦 Installing VS Code dependencies...");
console.log("   This may take 5-10 minutes on first run...\n");

const npmInstall = spawn("npm", ["install"], {
  cwd: VSCODE_ROOT,
  stdio: "inherit",
  shell: true,
});

npmInstall.on("close", (code) => {
  if (code !== 0) {
    console.error("\n❌ npm install failed with code:", code);
    process.exit(code);
  }

  console.log("\n✅ Dependencies installed\n");

  // Step 5: Compile VS Code Web
  console.log("🔨 Compiling VS Code Web...");
  console.log("   This build takes 10-30 minutes on first run...");
  console.log("   Subsequent builds will be much faster.\n");

  const compile = spawn("npm", ["run", "compile-web"], {
    cwd: VSCODE_ROOT,
    stdio: "inherit",
    shell: true,
  });

  compile.on("close", (code) => {
    if (code !== 0) {
      console.error("\n❌ VS Code Web compilation failed with code:", code);
      process.exit(code);
    }

    console.log("\n✅ VS Code Web compiled successfully!\n");
    console.log(
      "📦 Output location:",
      path.join(VSCODE_ROOT, "out-vscode-web"),
    );
    console.log("\n🎉 Setup complete! You can now run:");
    console.log("   npm run serve:vscode");
    console.log("   npm run dev:desktop\n");
  });
});
