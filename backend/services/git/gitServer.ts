import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { FastifyRequest, FastifyReply } from "fastify";
import * as git from "isomorphic-git";

/**
 * Native Git Server (Standalone Engine)
 * Wraps local 'git' commands and provides high-level SCM APIs via isomorphic-git.
 * Repositories are stored in: data/repos/:repoId.git
 */
export class GitServer {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir || path.join(process.cwd(), "data", "repos");
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  getRepoPath(repoId: string): string {
    const safeId = repoId.replace(/[^a-zA-Z0-9\-_.]/g, "");
    return path.join(this.baseDir, `${safeId}.git`);
  }

  async ensureRepoExists(repoId: string): Promise<boolean> {
    const repoPath = this.getRepoPath(repoId);
    if (!fs.existsSync(repoPath)) {
      try {
        fs.mkdirSync(repoPath, { recursive: true });
        // Enforce SHA-256 for all new repos (Crytographic Integrity System)
        await this.spawnGit(
          ["init", "--bare", "--object-format=sha256"],
          repoPath,
        );
        this.installHooks(repoPath);
        return true;
      } catch (e) {
        console.error("Failed to init repo", e);
        return false;
      }
    }
    // Ensure hooks are present even for existing repos (idempotent)
    this.installHooks(repoPath);
    return true;
  }

  /**
   * List files at a specific ref and path using isomorphic-git.
   */
  async listFiles(repoId: string, ref = "HEAD", dir = "") {
    const repoPath = this.getRepoPath(repoId);
    try {
      const filenames = await git.listFiles({
        fs: fs,
        gitdir: repoPath,
        ref: ref,
      });

      // Filter by directory if specified
      if (dir) {
        return filenames.filter((f) => f.startsWith(dir));
      }
      return filenames;
    } catch (e) {
      console.error("Error listing files", e);
      return [];
    }
  }

  /**
   * List files/folders at a path (non-recursive) for UI browsing.
   * Returns: { name, type: 'blob'|'tree', path, mode, sha }
   */
  async lsTree(repoId: string, ref = "HEAD", dirPath = "") {
    const repoPath = this.getRepoPath(repoId);
    try {
      // Use git ls-tree for browsing
      // Format: <mode> <type> <object> <file>
      // Args: -z (null terminated), --name-only? No we need type.
      // git ls-tree HEAD path/to/dir

      // Construct args
      const args = ["ls-tree", ref];
      if (dirPath) {
        args.push(`${dirPath}/`); // Ensure it looks inside the dir
      }
      // If dirPath is empty, it lists root.

      const output = await this.spawnGit(args, repoPath);

      // Parse output
      // 100644 blob a1b2...    file.txt
      // 040000 tree c3d4...    subdir

      const entries = output
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [meta, file] = line.split("\t");
          const [mode, type, sha] = meta.split(" ");

          // Handle path relative to browsing dir
          // ls-tree returns full path "src/index.ts". If we browsed "src", we want "index.ts".
          // BUT actually ls-tree output depends on args.
          // Let's just return the full path and name.

          return {
            name: path.basename(file), // Display name
            path: file, // Full path for linking
            type: type === "tree" ? "dir" : "file",
            mode,
            sha,
          };
        });

      return entries;
    } catch (e) {
      // If checking HEAD on empty repo, it throws. Return empty.
      return [];
    }
  }

  /**
   * Get file content using isomorphic-git bin parsing.
   */
  async getFileContent(repoId: string, oid: string) {
    const repoPath = this.getRepoPath(repoId);
    try {
      const { object } = await git.readObject({
        fs,
        gitdir: repoPath,
        oid,
      });
      return object;
    } catch (e) {
      console.error("Error reading object", e);
      return null;
    }
  }

  /**
   * Smart HTTP Handlers
   */
  async handleInfoRefs(
    req: FastifyRequest,
    reply: FastifyReply,
    repoId: string,
  ) {
    const service = (req.query as any).service;
    if (!service) return reply.status(400).send("Service parameter missing");

    const repoPath = this.getRepoPath(repoId);
    if (!fs.existsSync(repoPath))
      return reply.status(404).send("Repository not found");

    reply.header("Content-Type", `application/x-${service}-advertisement`);
    reply.header("Cache-Control", "no-cache");

    const prefix = `# service=${service}\n`;
    const hexLen = (prefix.length + 4).toString(16).padStart(4, "0");
    reply.raw.write(`${hexLen}${prefix}0000`);

    const gitProc = spawn(
      "git",
      [service.replace("git-", ""), "--stateless-rpc", "--advertise-refs", "."],
      { cwd: repoPath },
    );

    gitProc.stdout.pipe(reply.raw);
  }

  async handleService(
    req: FastifyRequest,
    reply: FastifyReply,
    repoId: string,
    service: string,
  ) {
    const repoPath = this.getRepoPath(repoId);
    if (!fs.existsSync(repoPath))
      return reply.status(404).send("Repository not found");

    reply.header("Content-Type", `application/x-${service}-result`);
    reply.header("Cache-Control", "no-cache");

    const gitProc = spawn(
      "git",
      [service.replace("git-", ""), "--stateless-rpc", "."],
      {
        cwd: repoPath,
        env: { ...process.env, TRACKCODEX_REPO_ID: repoId },
      },
    );

    req.raw.pipe(gitProc.stdin);
    gitProc.stdout.pipe(reply.raw);

    if (service === "git-receive-pack") {
      gitProc.on("close", (code) => {
        if (code === 0) this.handlePostReceive(repoId);
      });
    }
  }

  private installHooks(repoPath: string) {
    const hookPath = path.join(repoPath, "hooks", "pre-receive");
    // Hook script calls back to the running backend
    const script = `#!/bin/sh
      while read oldrev newrev refname; do
        curl -f -s -X POST -H "Content-Type: application/json" \\
          -d "{\\"oldrev\\":\\"$oldrev\\", \\"newrev\\":\\"$newrev\\", \\"refname\\":\\"$refname\\", \\"repoId\\":\\"$TRACKCODEX_REPO_ID\\"}" \\
          http://localhost:4000/git/internal/hooks/pre-receive || exit 1
      done
    `;
    try {
      fs.writeFileSync(hookPath, script, { mode: 0o755 });
    } catch (e) {
      console.error("Failed to install hooks", e);
    }
  }

  async getCommitData(repoId: string, sha: string) {
    // Helper to read commit raw data for verification
    return await this.spawnGit(
      ["cat-file", "-p", sha],
      this.getRepoPath(repoId),
    );
  }

  private async handlePostReceive(repoId: string) {
    console.log(
      `⚡ [GitServer] Post-receive for ${repoId}. Handling integrations...`,
    );
    try {
      const { WorkflowService } = await import("../workflowService");
      const { RavenIndexer } = await import("../ravenIndexer");
      const { CryptographicService } = await import("../integrity");

      const log = await this.spawnGit(
        ["rev-parse", "HEAD"],
        this.getRepoPath(repoId),
      );
      const sha = log.trim();

      // 1. Cryptographic Ingestion (Critical Integrity Step)
      try {
        const repoPath = this.getRepoPath(repoId);
        await CryptographicService.ingestCommit(repoPath, sha);
      } catch (err) {
        console.error("CRITICAL: Failed to ingest commit for integrity", err);
      }

      // 2. CI/CD
      // async trigger to not block
      WorkflowService.triggerWorkflows(repoId, "push", sha).catch((e) =>
        console.error("Workflow trigger failed", e),
      );

      // 3. Search Indexing
      RavenIndexer.indexRepository(repoId, sha).catch((err) =>
        console.error("Raven indexing failed", err),
      );
    } catch (e) {
      console.error("Failed to handle post-receive", e);
    }
  }

  public spawnGit(args: string[], cwd: string): Promise<string> {
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
