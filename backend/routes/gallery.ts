
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

/**
 * VS Code Extension Gallery Proxy
 *
 * This route mimics the VS Code Marketplace Protocol used by the IDE.
 * It proxies requests to Open VSX's compatible endpoint but sanitizes the response
 * to remove "Visual Studio Code" branding from extension metadata.
 */
export async function galleryRoutes(fastify: FastifyInstance) {
    const OPENVSX_GALLERY_URL = "https://open-vsx.org/vscode/gallery/extensionquery";

    // ─── POST /api/gallery/extensionquery ─────────────────────────
    fastify.post("/extensionquery", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            // Proxy the request to Open VSX
            // We need to inspect and potentially modify the body to ensure we get desktop extensions
            let body = request.body as any;

            // Log incoming query for debugging (uncomment if needed)
            // console.log("🔍 Extension Query In:", JSON.stringify(body, null, 2));

            if (body && body.filters) {
                for (const filter of body.filters) {
                    if (filter.criteria) {
                        for (const criterion of filter.criteria) {
                            // override target platform if it is 'web'
                            // FilterType.TargetPlatform = 8
                            if (criterion.filterType === 8) {
                                if (criterion.value === 'web') {
                                    console.log("🔄 Overriding TargetPlatform: web -> win32-x64");
                                    criterion.value = 'win32-x64';
                                }
                            }
                        }
                    }
                }
            }

            try {
                const response = await fetch("https://open-vsx.org/vscode/gallery/extensionquery", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        // Spoof User-Agent to look like a desktop VS Code if needed,
                        // though Open VSX is usually permissive.
                        "User-Agent": "VSCode/1.96.2 (win32; x64) TrackCodex/1.0.0"
                    },
                    body: JSON.stringify(body),
                });

                if (!response.ok) {
                    return reply.status(response.status).send(await response.text());
                }

                const data = await response.json();

                // Sanitize the response (Rebranding)
                let jsonString = JSON.stringify(data);

                // 1. Replace Branding
                jsonString = jsonString.replace(/Visual Studio Code/g, "TrackCodex");
                jsonString = jsonString.replace(/VS Code/g, "TrackCodex");
                jsonString = jsonString.replace(/Microsoft/g, "Quantaforze");
                jsonString = jsonString.replace(/Code - OSS/g, "TrackCodex");

                const sanitizedData = JSON.parse(jsonString);
                return reply.send(sanitizedData);

            } catch (error) {
                request.log.error(error);
                return reply.status(500).send({ error: "Failed to fetch from Open VSX" });
            }
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Gallery proxy failed";
            console.error("Gallery proxy error:", e);
            return reply.code(500).send({ error: message });
        }
    });
}

function sanitizeGalleryResponse(data: any): any {
    if (!data || !data.results || !Array.isArray(data.results)) {
        return data;
    }

    const replaceBranding = (text: string) => {
        if (!text) return text;
        return text
            .replace(/Visual Studio Code/g, "TrackCodex")
            .replace(/VS Code/g, "TrackCodex")
            .replace(/Code - OSS/g, "TrackCodex")
            .replace(/Code - Insiders/g, "TrackCodex")
            .replace(/Microsoft Corporation/g, "Quantaforze LLC");
    };

    data.results.forEach((result: any) => {
        if (result.extensions && Array.isArray(result.extensions)) {
            result.extensions.forEach((ext: any) => {
                if (ext.displayName) {
                    ext.displayName = replaceBranding(ext.displayName);
                }
                if (ext.shortDescription) {
                    ext.shortDescription = replaceBranding(ext.shortDescription);
                }
                // versions[].files might contain readme/manifest url, but we can't easily proxy the content of those files 
                // without rewriting the URLs to point to another proxy.
                // For now, replacing displayName and shortDescription covers the hover card and list view.
            });
        }
    });

    return data;
}
