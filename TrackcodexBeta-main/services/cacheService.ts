type CacheEntry = {
    data: any;
    timestamp: number;
};

class CacheService {
    private cache: Map<string, CacheEntry> = new Map();
    private defaultTTL = 1000 * 60 * 5; // 5 minutes

    async getOrFetch<T>(key: string, fetcher: () => Promise<T>, ttl: number = this.defaultTTL): Promise<T> {
        const entry = this.cache.get(key);
        const now = Date.now();

        if (entry && (now - entry.timestamp < ttl)) {
            console.log(`[Cache] Serving ${key} from cache`);
            return entry.data;
        }

        console.log(`[Cache] Fetching ${key} from network`);
        const data = await fetcher();
        this.cache.set(key, { data, timestamp: now });
        return data;
    }

    invalidate(key: string) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }
}

export const cacheService = new CacheService();
