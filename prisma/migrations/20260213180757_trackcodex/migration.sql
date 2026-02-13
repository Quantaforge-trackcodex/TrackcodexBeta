-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSkillScore" (
    "userId" TEXT NOT NULL,
    "coding" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bugDetection" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "security" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "collaboration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "architecture" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consistency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "communityImpact" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastCalculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSkillScore_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "SkillRawMetrics" (
    "userId" TEXT NOT NULL,
    "commitsPushed" INTEGER NOT NULL DEFAULT 0,
    "prCreated" INTEGER NOT NULL DEFAULT 0,
    "prMerged" INTEGER NOT NULL DEFAULT 0,
    "linesChanged" INTEGER NOT NULL DEFAULT 0,
    "mergeSuccessRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "prApprovalRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "rejectionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "revertRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "testCoverageGain" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "bugsReported" INTEGER NOT NULL DEFAULT 0,
    "bugsFixed" INTEGER NOT NULL DEFAULT 0,
    "bugAccuracy" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "securityIssuesReported" INTEGER NOT NULL DEFAULT 0,
    "vulnerabilitiesFixed" INTEGER NOT NULL DEFAULT 0,
    "commentsPosted" INTEGER NOT NULL DEFAULT 0,
    "prReviewsGiven" INTEGER NOT NULL DEFAULT 0,
    "crossRepoContribs" INTEGER NOT NULL DEFAULT 0,
    "reposCreated" INTEGER NOT NULL DEFAULT 0,
    "workspacesCreated" INTEGER NOT NULL DEFAULT 0,
    "largeFeaturesMerged" INTEGER NOT NULL DEFAULT 0,
    "designDocsCreated" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "weeklyActiveDays" INTEGER NOT NULL DEFAULT 0,
    "starsReceived" INTEGER NOT NULL DEFAULT 0,
    "forks" INTEGER NOT NULL DEFAULT 0,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "karma" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillRawMetrics_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "ActivityEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repoId" TEXT,
    "workspaceId" TEXT,

    CONSTRAINT "ActivityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadarSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scores" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RadarSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityEvent_userId_type_idx" ON "ActivityEvent"("userId", "type");

-- CreateIndex
CREATE INDEX "ActivityEvent_timestamp_idx" ON "ActivityEvent"("timestamp");

-- CreateIndex
CREATE INDEX "RadarSnapshot_userId_createdAt_idx" ON "RadarSnapshot"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkillScore" ADD CONSTRAINT "UserSkillScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillRawMetrics" ADD CONSTRAINT "SkillRawMetrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadarSnapshot" ADD CONSTRAINT "RadarSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserSkillScore"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
