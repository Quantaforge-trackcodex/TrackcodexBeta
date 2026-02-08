import { PrismaClient } from "@prisma/client";
import { GitServer } from "./git/gitServer";
import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";

const prisma = new PrismaClient();
const gitServer = new GitServer();

export class RavenIndexer {
  /**
   * High-performance indexing of repository symbols.
   * Matches GitHub's Blackbird by creating a searchable symbol index.
   */
  static async indexRepository(repoId: string, sha: string) {
    console.log(`🦅 [Raven]: Indexing repository ${repoId} at ${sha}...`);

    const repoPath = gitServer.getRepoPath(repoId);
    const mirrorDir = path.join(process.cwd(), "storage", "mirrors", repoId);

    try {
      // 1. Ensure mirrors directory exists
      await fs.mkdir(path.join(process.cwd(), "storage", "mirrors"), {
        recursive: true,
      });

      // 2. Clone/Update
      if (
        await fs
          .access(mirrorDir)
          .then(() => true)
          .catch(() => false)
      ) {
        await this.spawnGit(["fetch", "--all"], mirrorDir);
        await this.spawnGit(["checkout", sha], mirrorDir);
      } else {
        await fs.mkdir(mirrorDir, { recursive: true });
        await this.spawnGit(["clone", repoPath, "."], mirrorDir);
        await this.spawnGit(["checkout", sha], mirrorDir);
      }

      // 3. Clear existing index for this repo
      await prisma.codeSymbol.deleteMany({ where: { repoId } });

      // 4. Traverse and Parse
      await this.traverseDirectory(mirrorDir, mirrorDir, repoId);

      console.log(`✅ [Raven]: Indexing complete for ${repoId}`);
    } catch (err) {
      console.error(`❌ [Raven]: Indexing failed for ${repoId}`, err);
    }
    // No finally rm mirrorDir - we keep it for serving content
  }

  private static async traverseDirectory(
    baseDir: string,
    currentDir: string,
    repoId: string,
  ) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);

      if (entry.isDirectory()) {
        if (entry.name === ".git" || entry.name === "node_modules") continue;
        await this.traverseDirectory(baseDir, fullPath, repoId);
      } else {
        await this.indexFile(fullPath, relativePath, repoId);
      }
    }
  }

  private static async indexFile(
    filePath: string,
    relativePath: string,
    repoId: string,
  ) {
    const ext = path.extname(filePath);
    if (![".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs"].includes(ext))
      return;

    const content = await fs.readFile(filePath, "utf-8");
    const lines = content.split("\n");
    const symbols: any[] = [];

    // Enhanced regex-based symbol extraction (Approximating tree-sitter)
    const rules = [
      // TypeScript / JavaScript
      { name: "CLASS", regex: /class\s+([A-Z][a-zA-Z0-9_]*)/g },
      { name: "INTERFACE", regex: /interface\s+([A-Z][a-zA-Z0-9_]*)/g },
      {
        name: "FUNCTION",
        regex: /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_]+)/g,
      },
      {
        name: "CONST_ARROW",
        regex: /const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g,
      },

      // Python
      { name: "PYTHON_CLASS", regex: /class\s+([a-zA-Z0-9_]+)(?:\(.*\))?:/g },
      { name: "PYTHON_DEF", regex: /def\s+([a-zA-Z0-9_]+)\s*\(/g },

      // Go
      { name: "GO_STRUCT", regex: /type\s+([a-zA-Z0-9_]+)\s+struct/g },
      {
        name: "GO_FUNC",
        regex: /func\s+(?:\([^)]+\)\s+)?([a-zA-Z0-9_]+)\s*\(/g,
      },

      // Rust
      { name: "RUST_STRUCT", regex: /struct\s+([a-zA-Z0-9_]+)/g },
      { name: "RUST_FN", regex: /fn\s+([a-zA-Z0-9_]+)/g },
      { name: "RUST_TRAIT", regex: /trait\s+([a-zA-Z0-9_]+)/g },

      // Java / C#
      {
        name: "JAVA_CLASS",
        regex: /(?:public|private|protected)\s+class\s+([a-zA-Z0-9_]+)/g,
      },
      {
        name: "JAVA_METHOD",
        regex:
          /(?:public|private|protected|static).*\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*{/g,
      },
    ];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (
        !trimmedLine ||
        trimmedLine.startsWith("//") ||
        trimmedLine.startsWith("#") ||
        trimmedLine.startsWith("/*")
      )
        return;

      for (const rule of rules) {
        let match;
        while ((match = rule.regex.exec(line)) !== null) {
          const type = rule.name.split("_")[0]; // Extract base type (CLASS, FUNCTION, etc.)
          symbols.push({
            repoId,
            name: match[1],
            type: ["PYTHON", "GO", "RUST", "JAVA", "CONST"].includes(type)
              ? rule.name.split("_")[1]
              : rule.name,
            path: relativePath,
            line: index + 1,
            signature: trimmedLine.substring(0, 500),
          });
        }
        rule.regex.lastIndex = 0;
      }
    });

    if (symbols.length > 0) {
      await prisma.codeSymbol.createMany({ data: symbols });
    }
  }

  private static spawnGit(args: string[], cwd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const p = spawn("git", args, { cwd });
      let out = "";
      p.stdout.on("data", (d) => (out += d));
      p.on("close", (code) =>
        code === 0 ? resolve(out) : reject(new Error(`Git exited ${code}`)),
      );
    });
  }
}
