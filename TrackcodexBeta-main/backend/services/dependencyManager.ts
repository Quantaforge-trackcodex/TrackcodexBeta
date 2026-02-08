import { Octokit } from "@octokit/rest";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

export interface DependencyIssue {
  name: string;
  current: string;
  wanted: string;
  latest: string;
  type: "outdated" | "security" | "unused";
  severity?: "low" | "moderate" | "high" | "critical";
}

export interface SecurityVulnerability {
  name: string;
  severity: "low" | "moderate" | "high" | "critical";
  via: string;
  fixAvailable: boolean;
  range: string;
}

export class DependencyManager {
  private octokit: Octokit | null = null;

  constructor(githubToken?: string) {
    if (githubToken) {
      this.octokit = new Octokit({ auth: githubToken });
    }
  }

  /**
   * Scan package.json for outdated dependencies
   */
  async scanOutdatedDependencies(
    projectPath: string,
  ): Promise<DependencyIssue[]> {
    try {
      const packageJsonPath = path.join(projectPath, "package.json");
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf-8"),
      );

      // Run npm outdated to get outdated packages
      const { stdout } = await execAsync("npm outdated --json", {
        cwd: projectPath,
      }).catch(() => ({ stdout: "{}" })); // npm outdated exits with code 1 if outdated packages exist

      const outdated = JSON.parse(stdout || "{}");
      const issues: DependencyIssue[] = [];

      for (const [name, info] of Object.entries(outdated as any)) {
        issues.push({
          name,
          current: info.current,
          wanted: info.wanted,
          latest: info.latest,
          type: "outdated",
        });
      }

      return issues;
    } catch (error) {
      console.error("Error scanning outdated dependencies:", error);
      return [];
    }
  }

  /**
   * Run npm audit to find security vulnerabilities
   */
  async scanSecurityVulnerabilities(
    projectPath: string,
  ): Promise<SecurityVulnerability[]> {
    try {
      const { stdout } = await execAsync("npm audit --json", {
        cwd: projectPath,
      }).catch((err) => ({ stdout: err.stdout || "{}" }));

      const auditResult = JSON.parse(stdout || "{}");
      const vulnerabilities: SecurityVulnerability[] = [];

      if (auditResult.vulnerabilities) {
        for (const [name, vuln] of Object.entries(
          auditResult.vulnerabilities as any,
        )) {
          vulnerabilities.push({
            name,
            severity: vuln.severity,
            via: Array.isArray(vuln.via) ? vuln.via.join(", ") : vuln.via,
            fixAvailable: !!vuln.fixAvailable,
            range: vuln.range,
          });
        }
      }

      return vulnerabilities;
    } catch (error) {
      console.error("Error scanning security vulnerabilities:", error);
      return [];
    }
  }

  /**
   * Detect unused dependencies by analyzing import statements
   */
  async detectUnusedDependencies(projectPath: string): Promise<string[]> {
    try {
      const packageJsonPath = path.join(projectPath, "package.json");
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf-8"),
      );

      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      // Get all source files
      const sourceFiles = await this.getAllSourceFiles(projectPath);

      // Read all import statements
      const importedPackages = new Set<string>();
      for (const file of sourceFiles) {
        const content = await fs.readFile(file, "utf-8");
        const imports =
          content.match(/(?:import|require)\s*\(?['"]([^'"]+)['"]\)?/g) || [];

        imports.forEach((imp) => {
          const match = imp.match(/['"]([^'"]+)['"]/);
          if (match) {
            const pkg = match[1].split("/")[0];
            if (pkg.startsWith("@")) {
              // Scoped package
              importedPackages.add(match[1].split("/").slice(0, 2).join("/"));
            } else {
              importedPackages.add(pkg);
            }
          }
        });
      }

      // Find dependencies not imported anywhere
      const unused: string[] = [];
      for (const dep of Object.keys(allDeps)) {
        if (!importedPackages.has(dep)) {
          unused.push(dep);
        }
      }

      return unused;
    } catch (error) {
      console.error("Error detecting unused dependencies:", error);
      return [];
    }
  }

  /**
   * Apply automated fixes for dependency issues
   */
  async applyFixes(
    projectPath: string,
    fixes: { type: "update" | "remove"; package: string; version?: string }[],
  ): Promise<{ success: boolean; message: string }> {
    try {
      const packageJsonPath = path.join(projectPath, "package.json");
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf-8"),
      );

      for (const fix of fixes) {
        if (fix.type === "update" && fix.version) {
          // Update dependency version
          if (packageJson.dependencies?.[fix.package]) {
            packageJson.dependencies[fix.package] = fix.version;
          }
          if (packageJson.devDependencies?.[fix.package]) {
            packageJson.devDependencies[fix.package] = fix.version;
          }
        } else if (fix.type === "remove") {
          // Remove unused dependency
          delete packageJson.dependencies?.[fix.package];
          delete packageJson.devDependencies?.[fix.package];
        }
      }

      // Write updated package.json
      await fs.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf-8",
      );

      // Run npm install to apply changes
      await execAsync("npm install", { cwd: projectPath });

      return {
        success: true,
        message: `Applied ${fixes.length} fixes successfully`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to apply fixes: ${error.message}`,
      };
    }
  }

  /**
   * Get all source files in the project
   */
  private async getAllSourceFiles(projectPath: string): Promise<string[]> {
    const files: string[] = [];
    const extensions = [".ts", ".tsx", ".js", ".jsx"];

    async function walk(dir: string) {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        // Skip node_modules and other common directories
        if (
          entry.name === "node_modules" ||
          entry.name === "dist" ||
          entry.name === ".git"
        ) {
          continue;
        }

        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    }

    await walk(projectPath);
    return files;
  }

  /**
   * Get GitHub Dependabot alerts for a repository
   */
  async getGitHubSecurityAlerts(owner: string, repo: string): Promise<any[]> {
    if (!this.octokit) {
      throw new Error("GitHub token required for security alerts");
    }

    try {
      const { data } = await this.octokit.dependabot.listAlertsForRepo({
        owner,
        repo,
        state: "open",
      });

      return data;
    } catch (error) {
      console.error("Error fetching GitHub security alerts:", error);
      return [];
    }
  }
}
