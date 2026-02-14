/**
 * Open VSX Registry API Proxy
 *
 * Proxies requests to open-vsx.org (or self-hosted instance).
 * Provides caching to avoid rate-limiting and improve latency.
 *
 * API Docs: https://open-vsx.org/swagger-ui/
 */

const OPENVSX_BASE = process.env.OPENVSX_URL || "https://open-vsx.org";
const CACHE_TTL_MS = 60_000; // 60 seconds

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        cache.delete(key);
        return null;
    }
    return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
    // Prune old entries
    if (cache.size > 500) {
        const oldest = [...cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
        for (let i = 0; i < 100; i++) cache.delete(oldest[i][0]);
    }
}

// ─── Types ───────────────────────────────────────────────────────

export interface OpenVSXExtension {
    namespace: string;
    name: string;
    displayName: string;
    description: string;
    version: string;
    publishedBy: { loginName: string };
    allVersions?: Record<string, string>;
    averageRating?: number;
    downloadCount?: number;
    reviewCount?: number;
    files?: Record<string, string>;
    categories?: string[];
    tags?: string[];
    timestamp?: string;
    url?: string;
    namespaceUrl?: string;
    reviewsUrl?: string;
    // Processed fields
    iconUrl?: string;
    downloadUrl?: string;
}

export interface SearchResult {
    offset: number;
    totalSize: number;
    extensions: OpenVSXExtension[];
}

// ─── Service ─────────────────────────────────────────────────────

export class OpenVSXService {
    private baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || OPENVSX_BASE;
    }

    /**
     * Sanitize extension metadata to replace VS Code branding.
     */
    private sanitizeExtension(ext: OpenVSXExtension): OpenVSXExtension {
        const replaceBranding = (text: string) => {
            if (!text) return text;
            return text
                .replace(/Visual Studio Code/g, "TrackCodex")
                .replace(/VS Code/g, "TrackCodex")
                .replace(/Code - OSS/g, "TrackCodex")
                .replace(/Microsoft Corporation/g, "Quantaforze LLC");
        };

        return {
            ...ext,
            displayName: replaceBranding(ext.displayName),
            description: replaceBranding(ext.description),
        };
    }

    /**
     * Search extensions on Open VSX registry.
     */
    async search(
        query: string,
        options: {
            category?: string;
            offset?: number;
            size?: number;
            sortBy?: "relevance" | "downloadCount" | "averageRating" | "timestamp";
            sortOrder?: "asc" | "desc";
        } = {}
    ): Promise<SearchResult> {
        const { category, offset = 0, size = 20, sortBy = "relevance", sortOrder = "desc" } = options;
        const cacheKey = `search:${query}:${category}:${offset}:${size}:${sortBy}:${sortOrder}`;

        const cached = getCached<SearchResult>(cacheKey);
        if (cached) return cached;

        const params = new URLSearchParams({
            query,
            offset: offset.toString(),
            size: size.toString(),
            sortBy,
            sortOrder,
        });

        if (category) params.set("category", category);

        const url = `${this.baseUrl}/api/-/search?${params}`;
        const response = await fetch(url, {
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Open VSX search failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as SearchResult;

        // Enrich with icon URLs and sanitize branding
        data.extensions = data.extensions.map((ext) => ({
            ...this.sanitizeExtension(ext),
            iconUrl: ext.files?.icon || `https://open-vsx.org/api/${ext.namespace}/${ext.name}/file/icon`,
        }));

        setCache(cacheKey, data);
        return data;
    }

    /**
     * Get a specific extension by namespace/name.
     */
    async getExtension(namespace: string, name: string): Promise<OpenVSXExtension> {
        const cacheKey = `ext:${namespace}/${name}`;
        const cached = getCached<OpenVSXExtension>(cacheKey);
        if (cached) return cached;

        const url = `${this.baseUrl}/api/${namespace}/${name}`;
        const response = await fetch(url, {
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Extension not found: ${namespace}.${name} (${response.status})`);
        }

        const data = await response.json() as OpenVSXExtension;
        data.iconUrl = data.files?.icon || undefined;
        data.downloadUrl = data.files?.download || undefined;

        const sanitized = this.sanitizeExtension(data);
        setCache(cacheKey, sanitized);
        return sanitized;
    }

    /**
     * Get extension versions.
     */
    async getVersions(namespace: string, name: string): Promise<Record<string, string>> {
        const ext = await this.getExtension(namespace, name);
        return ext.allVersions || {};
    }

    /**
     * Get download URL for a specific version.
     */
    async getDownloadUrl(namespace: string, name: string, version?: string): Promise<string> {
        const v = version || "latest";
        return `${this.baseUrl}/api/${namespace}/${name}/${v}/file/download`;
    }

    /**
     * Get popular/trending extensions.
     */
    async getPopular(size = 12): Promise<SearchResult> {
        return this.search("", {
            sortBy: "downloadCount",
            sortOrder: "desc",
            size,
        });
    }

    /**
     * Get extensions by category.
     */
    async getByCategory(category: string, size = 20): Promise<SearchResult> {
        return this.search("", { category, size, sortBy: "downloadCount" });
    }
}

export const openVSXService = new OpenVSXService();
