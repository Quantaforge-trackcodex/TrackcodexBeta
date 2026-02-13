import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Weighting constants
const WEIGHT_30_DAY = 0.7;
const WEIGHT_LIFETIME = 0.3;
const DECAY_RATE = 0.95; // 5% decay per week of inactivity

// Anti-abuse limits
const MAX_COLLAB_POINTS_DAILY = 50;
const MIN_LINES_FOR_COMMIT = 10;

export class RadarService {
    /**
     * Ingest a raw user activity event
     */
    async processEvent(userId: string, type: string, metadata: any = {}) {
        // 1. Log immutable event
        await prisma.activityEvent.create({
            data: {
                userId,
                type,
                metadata,
            },
        });

        // 2. Update raw metrics (Atomic increments)
        await this.updateRawMetrics(userId, type, metadata);

        // 3. Trigger recalculation (in background ideally, here inline for prototype)
        await this.calculateScores(userId);
    }

    private async updateRawMetrics(userId: string, type: string, metadata: any) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const updateData: any = { updatedAt: new Date() };

        switch (type) {
            case "COMMIT_PUSH":
                // Anti-abuse: Ignore micro-commits
                if ((metadata.linesChanged || 0) > MIN_LINES_FOR_COMMIT) {
                    updateData.commitsPushed = { increment: 1 };
                    updateData.linesChanged = { increment: metadata.linesChanged || 0 };
                }
                break;
            case "PR_MERGED":
                updateData.prMerged = { increment: 1 };
                updateData.architecture = { increment: metadata.isLargeFeature ? 1 : 0 }; // Architecture signal
                break;
            case "BUG_FIXED":
                updateData.bugsFixed = { increment: 1 };
                break;
            case "SECURITY_FIX":
                updateData.vulnerabilitiesFixed = { increment: 1 };
                break;
            case "PR_REVIEW":
                updateData.prReviewsGiven = { increment: 1 };
                break;
            case "COMMUNITY_STAR":
                updateData.starsReceived = { increment: 1 };
                break;
        }

        // Consistency tracking (Streak)
        // In a real app, check last activity date vs yesterday
        updateData.currentStreak = { increment: 1 }; // Simplified for now

        await prisma.skillRawMetrics.upsert({
            where: { userId },
            create: { userId, ...updateData },
            update: updateData,
        });
    }

    /**
     * Recalculate normalized scores (0-100) for a user
     */
    async calculateScores(userId: string) {
        const raw = await prisma.skillRawMetrics.findUnique({ where: { userId } });
        if (!raw) return;

        // Fetch benchmarks (95th percentile) - Cached in production
        // keeping simplistic fixed benchmarks for prototype to ensure 0-100 scale works immediately
        const benchmarks = {
            coding: 1000,      // commits + lines
            quality: 50,       // approval rate
            bug: 20,           // bug fixes
            security: 10,      // vulns fixed
            collab: 100,       // reviews
            arch: 5,           // large features
            consistency: 30,   // streak
            community: 50      // stars
        };

        const scores = {
            coding: this.normalize((raw.commitsPushed * 10) + (raw.linesChanged / 100), benchmarks.coding),
            quality: this.normalize(raw.prMerged * 2, benchmarks.quality), // simplified proxy
            bugDetection: this.normalize(raw.bugsFixed * 5, benchmarks.bug),
            security: this.normalize(raw.vulnerabilitiesFixed * 10, benchmarks.security),
            collaboration: this.normalize(raw.prReviewsGiven * 5, benchmarks.collab),
            architecture: this.normalize(raw.largeFeaturesMerged * 20, benchmarks.arch),
            consistency: this.normalize(raw.currentStreak * 3, benchmarks.consistency),
            communityImpact: this.normalize(raw.starsReceived * 5, benchmarks.community),
        };

        // Update UserSkillScore
        await prisma.userSkillScore.upsert({
            where: { userId },
            create: { userId, ...scores, lastCalculatedAt: new Date() },
            update: { ...scores, lastCalculatedAt: new Date() },
        });

        // Create Snapshot
        await prisma.radarSnapshot.create({
            data: {
                userId,
                scores: scores as any
            }
        })
    }

    private normalize(value: number, max: number): number {
        const score = (value / max) * 100;
        return Math.min(Math.max(score, 0), 100); // Clamp 0-100
    }

    async getUserRadar(userId: string) {
        return prisma.userSkillScore.findUnique({ where: { userId } });
    }
}

export const radarService = new RadarService();
