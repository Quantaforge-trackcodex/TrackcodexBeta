
import { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";

const VSCODE_SETTINGS_PATH = path.join(process.cwd(), ".vscode", "settings.json");

export async function ideConfigRoutes(fastify: FastifyInstance) {
    fastify.post("/ide/theme", async (request, reply) => {
        const { theme } = request.body as { theme: "dark" | "light" };

        // Map internal theme type to VS Code theme names
        // Using standard themes that come with VS Code
        const vscodeTheme = theme === "dark" ? "Default Dark Modern" : "Default Light Modern";

        try {
            // Ensure .vscode directory exists
            const vscodeDir = path.dirname(VSCODE_SETTINGS_PATH);
            if (!fs.existsSync(vscodeDir)) {
                fs.mkdirSync(vscodeDir, { recursive: true });
            }

            // Read existing settings
            let settings = {};
            if (fs.existsSync(VSCODE_SETTINGS_PATH)) {
                try {
                    const content = fs.readFileSync(VSCODE_SETTINGS_PATH, "utf-8");
                    // Handle potential comments in JSON (simple strip or try parse)
                    // VS Code allows comments, but standard JSON.parse fails.
                    // For now, assume standard JSON or just overwrite if invalid.
                    // A robust solution would use 'clean-json' or similar.
                    // We'll simplisticly try parse, if fail, start empty to avoid crashing.
                    settings = JSON.parse(content);
                } catch (e) {
                    console.warn("Failed to parse existing settings.json, starting fresh", e);
                }
            }

            // Update theme
            settings = {
                ...settings,
                "workbench.colorTheme": vscodeTheme
            };

            // Write back
            fs.writeFileSync(VSCODE_SETTINGS_PATH, JSON.stringify(settings, null, 4));

            return { success: true, theme: vscodeTheme };
        } catch (err: any) {
            request.log.error(err);
            return reply.code(500).send({ error: "Failed to update IDE theme settings" });
        }
    });
}
