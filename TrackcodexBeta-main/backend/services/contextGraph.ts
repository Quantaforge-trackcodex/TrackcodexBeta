import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

export interface CodeContext {
  fileName: string;
  content: string;
  relevance: number;
}

export class ContextGraph {
  private static workspacesDir = path.join(process.cwd(), "workspaces");

  /**
   * Retrieves relevant code context from a workspace based on a query.
   * Currently uses a keyword-based search (MVP for Graph Intelligence).
   */
  static async getRelevantContext(
    workspaceId: string,
    query: string,
  ): Promise<CodeContext[]> {
    const workspacePath = path.join(this.workspacesDir, workspaceId);
    if (!existsSync(workspacePath)) {
      return [];
    }

    try {
      const files = await this.scanDirectory(workspacePath);
      const relevantFiles: CodeContext[] = [];

      for (const file of files) {
        // Skip binary and large files
        if (this.isBinaryOrLarge(file)) continue;

        const content = await fs.readFile(file, "utf-8");
        const relevance = this.calculateRelevance(content, query, file);

        if (relevance > 0) {
          relevantFiles.push({
            fileName: path.relative(workspacePath, file),
            content: content.slice(0, 2000), // Limit snippet size
            relevance,
          });
        }
      }

      // Return top 5 most relevant snippets
      return relevantFiles
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 5);
    } catch (error) {
      console.error("Context Expansion Error:", error);
      return [];
    }
  }

  private static async scanDirectory(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map((res) => {
        const resPath = path.resolve(dir, res.name);
        return res.isDirectory() ? this.scanDirectory(resPath) : [resPath];
      }),
    );
    return Array.prototype.concat(...files);
  }

  private static isBinaryOrLarge(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    const binaryExts = [
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".pdf",
      ".zip",
      ".exe",
      ".dll",
      ".node",
    ];
    if (binaryExts.includes(ext)) return true;

    // In a real scenario, we'd check file size too
    return false;
  }

  private static calculateRelevance(
    content: string,
    query: string,
    filePath: string,
  ): number {
    let score = 0;
    const keywords = query.toLowerCase().split(/\s+/);

    // Boost if keyword in filename
    const fileName = path.basename(filePath).toLowerCase();
    keywords.forEach((kw) => {
      if (fileName.includes(kw)) score += 5;
      if (content.toLowerCase().includes(kw)) score += 1;
    });

    return score;
  }
}
