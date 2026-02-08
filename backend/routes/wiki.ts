import { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";
import { requireRepoPermission, RepoLevel } from "../middleware/repoAuth";

const WIKI_BASE_DIR = path.join(process.cwd(), "data", "wikis");

if (!fs.existsSync(WIKI_BASE_DIR)) {
  fs.mkdirSync(WIKI_BASE_DIR, { recursive: true });
}

export async function wikiRoutes(fastify: FastifyInstance) {
  // LIST PAGES
  fastify.get(
    "/repositories/:id/wiki/pages",
    { preHandler: requireRepoPermission(RepoLevel.READ) },
    async (request) => {
      const { id: repoId } = request.params as { id: string };
      const wikiDir = path.join(WIKI_BASE_DIR, repoId);

      if (!fs.existsSync(wikiDir)) {
        // Initialize default Home page if not exists
        fs.mkdirSync(wikiDir, { recursive: true });
        fs.writeFileSync(
          path.join(wikiDir, "Home.md"),
          "# Welcome to the Wiki\n\nEdit this page to get started.",
        );
      }

      const files = fs.readdirSync(wikiDir).filter((f) => f.endsWith(".md"));
      return files.map((f) => ({
        slug: f.replace(".md", ""),
        title: f.replace(".md", "").replace(/-/g, " "),
      }));
    },
  );

  // GET PAGE CONTENT
  fastify.get(
    "/repositories/:id/wiki/pages/:slug",
    { preHandler: requireRepoPermission(RepoLevel.READ) },
    async (request, reply) => {
      const { id: repoId, slug } = request.params as {
        id: string;
        slug: string;
      };
      const filePath = path.join(WIKI_BASE_DIR, repoId, `${slug}.md`);

      if (!fs.existsSync(filePath)) {
        return reply.code(404).send({ error: "Page not found" });
      }

      const content = fs.readFileSync(filePath, "utf-8");
      return { slug, content };
    },
  );

  // UPDATE/CREATE PAGE
  fastify.put(
    "/repositories/:id/wiki/pages/:slug",
    { preHandler: requireRepoPermission(RepoLevel.WRITE) },
    async (request) => {
      const { id: repoId, slug } = request.params as {
        id: string;
        slug: string;
      };
      const { content } = request.body as { content: string };

      const wikiDir = path.join(WIKI_BASE_DIR, repoId);
      if (!fs.existsSync(wikiDir)) {
        fs.mkdirSync(wikiDir, { recursive: true });
      }

      const filePath = path.join(wikiDir, `${slug}.md`);
      fs.writeFileSync(filePath, content);

      return { success: true, slug };
    },
  );
}
