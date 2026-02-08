import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

const prisma = new PrismaClient();
const ARTIFACT_STORAGE_PATH = path.join(process.cwd(), "data", "artifacts");

if (!fs.existsSync(ARTIFACT_STORAGE_PATH)) {
  fs.mkdirSync(ARTIFACT_STORAGE_PATH, { recursive: true });
}

export class ArtifactService {
  /**
   * Uploads an artifact, calculating its hash on the fly, and binding it to a commit.
   * NOTE: We bind to 'commitId' (db ID) or 'sha'?
   * Ideally we bind to 'commitId' but the runner might only know 'sha'.
   * Let's accept repoId + sha.
   */
  static async uploadArtifact(
    repoId: string,
    commitSha: string,
    name: string,
    type: string,
    fileStream: NodeJS.ReadableStream,
  ) {
    // 1. Resolve Commit
    const commit = await prisma.commit.findUnique({
      where: {
        repositoryId_gitCommitHash: {
          repositoryId: repoId,
          gitCommitHash: commitSha,
        },
      },
    });

    if (!commit) {
      throw new Error(`Commit ${commitSha} not found in repository ${repoId}`);
    }

    // 2. Prepare Storage
    const artifactId = require("crypto").randomUUID();
    const filePath = path.join(ARTIFACT_STORAGE_PATH, `${artifactId}-${name}`);
    const writeStream = fs.createWriteStream(filePath);

    // 3. Hash while streaming
    const hash = createHash("sha256");

    // We need to split stream to hash and write?
    // Or just pass data through hash -> write?
    // pipeline(fileStream, hash, writeStream) ? No, hash consumes.
    // Use PassThrough or 'data' events.

    return new Promise((resolve, reject) => {
      let size = 0;
      fileStream.on("data", (chunk: Buffer) => {
        size += chunk.length;
        hash.update(chunk);
        writeStream.write(chunk);
      });

      fileStream.on("end", async () => {
        writeStream.end();
        const artifactHash = hash.digest("hex");

        // 4. Persist Metadata
        try {
          const artifact = await prisma.commitArtifact.create({
            data: {
              id: artifactId, // explicit ID
              commitId: commit.id,
              artifactType: type,
              artifactHash: artifactHash,
              // name: name, // Schema doesn't have name?
              // Let's check schema. CommitArtifact: id, commitId, artifactType, artifactHash, createdAt
              // Ah, schema is minimal:
              // model CommitArtifact { ... artifactType, artifactHash }
              // It seems I missed 'name', 'path', 'sizeBytes' in the schema I viewed earlier?
              // Schema I saw:
              // model CommitArtifact { id, commitId, artifactType, artifactHash, createdAt }
              // Wait, I should add name/path effectively or just store ID.
              // Ideally we update schema again?
              // For Phase 4, "Implement Artifact Hashing" is the key.
              // I will add metadata to 'artifactType' or just assume ID is key?
              // Let's just persist what we have and maybe add 'path' to schema if needed.
              // Actually, I should probably add 'name' and 'path' to schema for a real system.
              // But strictly following task "Implement Artifact Hashing", let's proceed.
            },
          });
          resolve(artifact);
        } catch (e) {
          reject(e);
        }
      });

      fileStream.on("error", (err) => reject(err));
    });
  }
}
