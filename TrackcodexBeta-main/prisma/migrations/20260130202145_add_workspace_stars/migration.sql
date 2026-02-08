-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "forkedFrom" TEXT,
ADD COLUMN     "forksCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "starsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'private';

-- CreateTable
CREATE TABLE "WorkspaceStar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceStar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkspaceStar_userId_idx" ON "WorkspaceStar"("userId");

-- CreateIndex
CREATE INDEX "WorkspaceStar_workspaceId_idx" ON "WorkspaceStar"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceStar_userId_workspaceId_key" ON "WorkspaceStar"("userId", "workspaceId");

-- AddForeignKey
ALTER TABLE "WorkspaceStar" ADD CONSTRAINT "WorkspaceStar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceStar" ADD CONSTRAINT "WorkspaceStar_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
