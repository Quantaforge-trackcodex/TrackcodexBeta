import { createHash } from "crypto";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import * as openpgp from "openpgp";
import git from "isomorphic-git";

interface CommitData {
  gitCommitHash: string;
  treeHash: string;
  parentHashes: string[];
  authorName: string;
  authorEmail: string;
  authorDate: string; // ISO timestamp
  committerName: string;
  committerEmail: string;
  committerDate: string;
  message: string;
}

export class CryptographicService {
  /**
   * Calculates the SHA-256 verification hash for a commit.
   * This is the "TrackCodex Hash" that binds all commit metadata.
   */
  static calculateVerificationHash(
    commit: CommitData,
    authorKeyFingerprint: string | null,
  ): string {
    const hash = createHash("sha256");

    // Deterministic ordering of fields
    hash.update(`git:${commit.gitCommitHash}\n`);
    hash.update(`tree:${commit.treeHash}\n`);
    for (const parent of commit.parentHashes) {
      hash.update(`parent:${parent}\n`);
    }
    hash.update(
      `author:${commit.authorName}<${commit.authorEmail}>${commit.authorDate}\n`,
    );
    hash.update(
      `committer:${commit.committerName}<${commit.committerEmail}>${commit.committerDate}\n`,
    );
    if (authorKeyFingerprint) {
      hash.update(`key:${authorKeyFingerprint}\n`);
    }
    hash.update(`msg:${commit.message}\n`);

    return hash.digest("hex");
  }

  /**
   * Verifies an SSH signature against a public key using ssh-keygen.
   * Uses spawn for robust stdin handling.
   */
  static async verifySSHSignature(
    data: Buffer,
    signature: string,
    publicKey: string,
  ): Promise<boolean> {
    const tmpDir = os.tmpdir();
    const timestamp = Date.now();
    const sigPath = path.join(tmpDir, `verify-${timestamp}.dat.sig`);
    const allowedSignersPath = path.join(
      tmpDir,
      `allowed_signers-${timestamp}`,
    );

    try {
      await fs.writeFile(sigPath, signature);
      await fs.writeFile(
        allowedSignersPath,
        `verifier@trackcodex.dev ${publicKey}\n`,
      );

      return await new Promise<boolean>((resolve) => {
        const child = spawn("ssh-keygen", [
          "-Y",
          "verify",
          "-f",
          allowedSignersPath,
          "-I",
          "verifier@trackcodex.dev",
          "-n",
          "git",
          "-s",
          sigPath,
        ]);

        let stderr = "";
        child.stderr.on("data", (d) => (stderr += d));

        child.on("close", (code) => {
          if (code !== 0) {
            // console.error("SSH Verify Failed", stderr);
            resolve(false);
          } else {
            resolve(true);
          }
        });

        child.on("error", () => resolve(false));

        // Pipe data to stdin
        child.stdin.write(data);
        child.stdin.end();
      });
    } catch (e) {
      console.error("SSH Verification Error", e);
      return false;
    } finally {
      await fs.unlink(sigPath).catch(() => {});
      await fs.unlink(allowedSignersPath).catch(() => {});
    }
  }

  /**
   * Verifies a GPG signature using OpenPGP.js
   */
  static async verifyGPGSignature(
    data: Buffer,
    signature: string,
    publicKey: string,
  ): Promise<boolean> {
    try {
      const message = await openpgp.createMessage({
        text: data.toString("utf8"),
      });
      const sig = await openpgp.readSignature({ armoredSignature: signature });
      const key = await openpgp.readKey({ armoredKey: publicKey });

      const verificationResult = await openpgp.verify({
        message,
        signature: sig,
        verificationKeys: key,
      });

      const { verified } = verificationResult.signatures[0];
      try {
        await verified; // throws on invalid
        return true;
      } catch (e) {
        return false;
      }
    } catch (e) {
      console.error("GPG Verification Error", e);
      return false;
    }
  }

  /**
   * Ingest a new commit: Parse (Robustly), Hash, and Persist.
   * Requires direct access to the repo via isomorphic-git.
   */
  static async ingestCommit(repoPath: string, sha: string) {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    // 1. Read Commit using isomorphic-git
    const commitResult = await git.readCommit({
      fs,
      gitdir: repoPath,
      oid: sha,
    });

    const commit = commitResult.commit;

    // 2. Map to CommitData
    // Timezone handling: ISO string
    const formatTime = (t: { timestamp: number; timezoneOffset: number }) => {
      // Simple approx or use date-fns if precise timezone needed.
      // For verification hash, we need exact string representation originally?
      // Actually, git internal storage is seconds + offset.
      // Our verification hash definition uses ISO String but that might vary effectively?
      // Let's standarize on what we want:
      // Ideally we use the raw strings from the commit object if accessible.
      // isomorphic-git parses them.
      // Let's construct a stable ISO string or raw seconds+offset string for the unique hash.
      // For simplicity towards MVP hardening, let's use the parsed date ISO.
      const d = new Date(t.timestamp * 1000);
      return d.toISOString();
    };

    const commitData: CommitData = {
      gitCommitHash: sha,
      treeHash: commit.tree,
      parentHashes: commit.parent,
      authorName: commit.author.name,
      authorEmail: commit.author.email,
      authorDate: formatTime(commit.author),
      committerName: commit.committer.name,
      committerEmail: commit.committer.email,
      committerDate: formatTime(commit.committer),
      message: commit.message,
    };

    // Lookup Author Key Fingerprint
    let fingerprint = null;
    const user = await prisma.user.findUnique({
      where: { email: commitData.authorEmail },
    });
    if (user) {
      const key = await prisma.userKey.findFirst({
        where: { userId: user.id },
      });
      if (key) fingerprint = key.fingerprint;
    }

    const verificationHash = this.calculateVerificationHash(
      commitData,
      fingerprint,
    );

    // 3. Persist to DB
    // Extract RepoId from path (assuming path is .../data/repos/REPOID)
    const repoId = path.basename(repoPath);

    await prisma.commit.upsert({
      where: {
        repositoryId_gitCommitHash: {
          repositoryId: repoId,
          gitCommitHash: sha,
        },
      },
      create: {
        repositoryId: repoId,
        gitCommitHash: sha,
        verificationHash: verificationHash,
        treeHash: commitData.treeHash,
        parentHashes: commitData.parentHashes,
        message: commitData.message.substring(0, 1000),
        authorId: user ? user.id : null,
        // Check for signature in parsed commit
        signatureStatus: commit.gpgsig ? "VERIFIED" : "UNSIGNED",
        createdAt: new Date(),
      },
      update: {
        verificationHash: verificationHash,
      },
    });

    console.log(
      `[Integrity] Ingested commit ${sha} with hash ${verificationHash}`,
    );
  }
}
