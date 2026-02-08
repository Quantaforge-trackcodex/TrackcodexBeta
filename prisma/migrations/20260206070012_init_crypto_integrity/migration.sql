/*
  Warnings:

  - A unique constraint covering the columns `[eventHash]` on the table `ActivityLog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "eventHash" TEXT,
ADD COLUMN     "previousEventHash" TEXT;

-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "hashAlgorithm" TEXT NOT NULL DEFAULT 'SHA256';

-- CreateTable
CREATE TABLE "UserKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "keyType" TEXT NOT NULL DEFAULT 'SSH',
    "fingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commit" (
    "id" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "gitCommitHash" TEXT NOT NULL,
    "verificationHash" TEXT NOT NULL,
    "authorId" TEXT,
    "signatureStatus" TEXT NOT NULL DEFAULT 'UNSIGNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Commit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommitArtifact" (
    "id" TEXT NOT NULL,
    "commitId" TEXT NOT NULL,
    "artifactType" TEXT NOT NULL,
    "artifactHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommitArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserKey_fingerprint_key" ON "UserKey"("fingerprint");

-- CreateIndex
CREATE INDEX "UserKey_userId_idx" ON "UserKey"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Commit_verificationHash_key" ON "Commit"("verificationHash");

-- CreateIndex
CREATE UNIQUE INDEX "Commit_repositoryId_gitCommitHash_key" ON "Commit"("repositoryId", "gitCommitHash");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityLog_eventHash_key" ON "ActivityLog"("eventHash");

-- AddForeignKey
ALTER TABLE "UserKey" ADD CONSTRAINT "UserKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitArtifact" ADD CONSTRAINT "CommitArtifact_commitId_fkey" FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
