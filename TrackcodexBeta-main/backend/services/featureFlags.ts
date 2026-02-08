
import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

const prisma = new PrismaClient();

export type FeatureFlagName =
    | 'ENABLE_REGISTRATION'
    | 'ENABLE_GOOGLE_AUTH'
    | 'ENABLE_GITHUB_AUTH'
    | 'MAINTENANCE_MODE';

/**
 * Check if a feature is enabled.
 * Priority: 
 * 1. Database Flag (if exists)
 * 2. Environment Variable (if matched)
 * 3. Default (true)
 */
export async function isFeatureEnabled(flagName: FeatureFlagName): Promise<boolean> {
    try {
        // 1. Check DB
        const flag = await prisma.featureFlag.findUnique({
            where: { name: flagName }
        });

        if (flag) return flag.enabled;

        // 2. Check Env Defaults
        // Mapping typical env vars to flags
        if (flagName === 'ENABLE_REGISTRATION') return process.env.DISABLE_REGISTRATION !== 'true';
        if (flagName === 'ENABLE_GOOGLE_AUTH') return !!env.GOOGLE_CLIENT_ID;
        if (flagName === 'ENABLE_GITHUB_AUTH') return !!env.GITHUB_CLIENT_ID;

        return true;
    } catch (error) {
        // Fallback to safe defaults if DB fails
        console.error(`Error checking feature flag ${flagName}:`, error);
        return false;
    }
}

/**
 * Set a feature flag (Admin only usually)
 */
export async function setFeatureFlag(flagName: FeatureFlagName, enabled: boolean) {
    return prisma.featureFlag.upsert({
        where: { name: flagName },
        update: { enabled },
        create: { name: flagName, enabled }
    });
}
