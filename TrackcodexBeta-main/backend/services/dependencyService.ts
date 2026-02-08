import { PrismaClient } from "@prisma/client";
import { GitServer } from "./git/gitServer";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const prisma = new PrismaClient();
const gitServer = new GitServer();

interface DependencyNode {
  name: string;
  version?: string;
  type: "runtime" | "dev" | "peer" | "optional";
}

interface DependencyGraph {
  totalCount: number;
  byType: Record<string, number>;
  packages: DependencyNode[];
  lastAnalyzed: string;
  manifests: string[];
}

export class DependencyService {
  /**
   * Analyzes repository dependencies by parsing package manifests.
   */
  static async analyzeDependencies(repoId: string): Promise<DependencyGraph> {
    const repoPath = gitServer.getRepoPath(repoId);

    if (!fs.existsSync(repoPath)) {
      throw new Error("Repository not found on disk");
    }

    const graph: DependencyGraph = {
      totalCount: 0,
      byType: {},
      packages: [],
      lastAnalyzed: new Date().toISOString(),
      manifests: [],
    };

    // Clone to temp directory for analysis
    const tempDir = path.join(process.cwd(), "temp", `analyze-${repoId}`);

    try {
      // Clean temp dir if exists
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }

      // Clone repo to temp
      await new Promise<void>((resolve, reject) => {
        const p = spawn("git", ["clone", repoPath, tempDir]);
        p.on("close", (code) =>
          code === 0 ? resolve() : reject(new Error(`Clone failed: ${code}`)),
        );
      });

      // Parse package.json (Node.js/npm)
      const packageJsonPath = path.join(tempDir, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        graph.manifests.push("package.json");
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf-8"),
        );

        if (packageJson.dependencies) {
          Object.entries(packageJson.dependencies).forEach(
            ([name, version]) => {
              graph.packages.push({
                name,
                version: version as string,
                type: "runtime",
              });
            },
          );
        }

        if (packageJson.devDependencies) {
          Object.entries(packageJson.devDependencies).forEach(
            ([name, version]) => {
              graph.packages.push({
                name,
                version: version as string,
                type: "dev",
              });
            },
          );
        }
      }

      // Parse requirements.txt (Python)
      const requirementsPath = path.join(tempDir, "requirements.txt");
      if (fs.existsSync(requirementsPath)) {
        graph.manifests.push("requirements.txt");
        const requirements = fs.readFileSync(requirementsPath, "utf-8");
        requirements.split("\n").forEach((line) => {
          line = line.trim();
          if (line && !line.startsWith("#")) {
            const match = line.match(/^([a-zA-Z0-9_-]+)([>=<~!]+.*)?$/);
            if (match) {
              graph.packages.push({
                name: match[1],
                version: match[2]?.replace(/[>=<~!]/g, "").trim(),
                type: "runtime",
              });
            }
          }
        });
      }

      // Parse Cargo.toml (Rust)
      const cargoPath = path.join(tempDir, "Cargo.toml");
      if (fs.existsSync(cargoPath)) {
        graph.manifests.push("Cargo.toml");
        const cargoContent = fs.readFileSync(cargoPath, "utf-8");
        const depSection = cargoContent.match(
          /\[dependencies\]([\s\S]*?)(\[|$)/,
        );
        if (depSection) {
          depSection[1].split("\n").forEach((line) => {
            const match = line.match(/^([a-zA-Z0-9_-]+)\s*=\s*"([^"]+)"/);
            if (match) {
              graph.packages.push({
                name: match[1],
                version: match[2],
                type: "runtime",
              });
            }
          });
        }
      }

      // Parse go.mod (Go)
      const goModPath = path.join(tempDir, "go.mod");
      if (fs.existsSync(goModPath)) {
        graph.manifests.push("go.mod");
        const goMod = fs.readFileSync(goModPath, "utf-8");
        const requireSection = goMod.match(/require\s*\(([\s\S]*?)\)/);
        if (requireSection) {
          requireSection[1].split("\n").forEach((line) => {
            const match = line.trim().match(/^([^\s]+)\s+v([^\s]+)/);
            if (match) {
              graph.packages.push({
                name: match[1],
                version: match[2],
                type: "runtime",
              });
            }
          });
        }
      }

      // Calculate stats
      graph.totalCount = graph.packages.length;
      graph.byType = graph.packages.reduce(
        (acc, pkg) => {
          acc[pkg.type] = (acc[pkg.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Store in database
      await prisma.repository.update({
        where: { id: repoId },
        data: { dependencies: graph as any },
      });

      console.log(
        `📊 Analyzed ${graph.totalCount} dependencies for repo ${repoId}`,
      );

      return graph;
    } finally {
      // Cleanup temp dir
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  }

  /**
   * Get cached dependency graph from database.
   */
  static async getDependencies(
    repoId: string,
  ): Promise<DependencyGraph | null> {
    const repo = await prisma.repository.findUnique({
      where: { id: repoId },
      select: { dependencies: true },
    });

    return repo?.dependencies as DependencyGraph | null;
  }
}
