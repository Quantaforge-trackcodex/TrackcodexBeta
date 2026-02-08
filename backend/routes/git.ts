import { FastifyInstance } from "fastify";
import { GitServer } from "../services/git/gitServer";
import { verifyGitAuth } from "../middleware/gitAuth";

const gitServer = new GitServer();

export default async function (server: FastifyInstance) {
  // Discovery
  server.get(
    "/:repoId.git/info/refs",
    { preHandler: verifyGitAuth },
    async (req, reply) => {
      const { repoId } = req.params as any;
      return gitServer.handleInfoRefs(req, reply, repoId);
    },
  );

  // Services (Fetch/Push)
  server.post(
    "/:repoId.git/:service",
    { preHandler: verifyGitAuth },
    async (req, reply) => {
      const { repoId, service } = req.params as any;
      return gitServer.handleService(req, reply, repoId, service);
    },
  );
  // Internal Hooks (Called by local git hooks)
  server.post("/internal/hooks/pre-receive", async (req, reply) => {
    const { repoId, oldrev, newrev, refname } = req.body as any;

    // 1. Allow branch deletion (newrev=0000...)
    if (newrev.startsWith("0000")) return { status: "ok" };

    // 2. Fetch commit data
    const commitRaw = await gitServer.getCommitData(repoId, newrev);

    // 3. Parse Signature and Author
    const hasSignature = commitRaw.includes("gpgsig");

    // Parse Author Email: "author Name <email@domain.com> 1234567890 +0000"
    const authorLine = commitRaw
      .split("\n")
      .find((line) => line.startsWith("author "));
    const authorEmailMatch = authorLine ? authorLine.match(/<([^>]+)>/) : null;
    const authorEmail = authorEmailMatch ? authorEmailMatch[1] : null;

    if (!hasSignature) {
      return reply
        .status(403)
        .send(
          `Integrity Check Failed: Commit must be signed. (Author: ${authorEmail})`,
        );
    }

    if (authorEmail) {
      // Import Prisma
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      // Find user by email (assuming User has email, or we check UserKey directly if linked)
      // Schema: UserKey linked to User. User has email?
      // Let's assume UserKey has a look up or we find User first.
      const user = await prisma.user.findUnique({
        where: { email: authorEmail },
      });
      if (!user) {
        // If user not found in system, strict mode might reject.
        // But maybe they are a collaborator?
        // For now, allow if we can't find user (maybe external contributor?)
        // BUT Policy says "Users MUST have a registered key".
        return reply
          .status(403)
          .send(
            `Integrity Check Failed: Author ${authorEmail} is not a registered user.`,
          );
      }

      const keys = await prisma.userKey.findMany({
        where: { userId: user.id },
      });
      if (keys.length === 0) {
        return reply
          .status(403)
          .send(
            `Integrity Check Failed: Author ${authorEmail} has no registered signing keys.`,
          );
      }

      // Key exists. (Verification pending full impl)
    }

    // TODO: Extract signature and verify against DB keys using CryptographicService
    // For Phase 3 step 2.1.3, we verify author authenticity.
    // We need to extract the key ID from the signature and check UserKey table.

    // For now, enforcing presence of signature is a good start.
    // I will add the real verification call once parsed.

    return { status: "ok" };
  });
}
