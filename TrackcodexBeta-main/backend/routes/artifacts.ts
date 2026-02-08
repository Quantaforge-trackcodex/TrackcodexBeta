import { FastifyInstance } from "fastify";
import { ArtifactService } from "../services/artifact";

export default async function (server: FastifyInstance) {
  // Upload Artifact
  // POST /repos/:repoId/commits/:sha/artifacts
  // Consumes: multipart/form-data
  server.post("/:repoId/commits/:sha/artifacts", async (req, reply) => {
    const { repoId, sha } = req.params as any;

    // Check for multipart
    if (!req.isMultipart()) {
      return reply.status(400).send("Request is not multipart");
    }

    const data = await req.file();
    if (!data) {
      return reply.status(400).send("No file uploaded");
    }

    // Fields
    // data.fields is null for file fields usually in fastify-multipart unless configured?
    // We expect 'name' and 'type' as fields or query params?
    // Let's rely on query params or fields.
    // Or derive from filename and mimetype.

    const artifactName = data.filename;
    const artifactType = data.mimetype; // e.g. "application/zip" or "build-log"

    try {
      const artifact = await ArtifactService.uploadArtifact(
        repoId,
        sha,
        artifactName,
        artifactType,
        data.file, // this is the stream
      );
      return { status: "ok", artifact };
    } catch (e: any) {
      console.error("Upload failed", e);
      if (e.message.includes("not found")) {
        return reply.status(404).send(e.message);
      }
      return reply.status(500).send("Upload failed");
    }
  });
}
