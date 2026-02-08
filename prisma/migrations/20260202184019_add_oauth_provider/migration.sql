-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "repoId" TEXT;

-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "settings" JSONB DEFAULT '{}';

-- CreateIndex
CREATE INDEX "ActivityLog_repoId_idx" ON "ActivityLog"("repoId");

-- CreateIndex
CREATE INDEX "ActivityLog_workspaceId_idx" ON "ActivityLog"("workspaceId");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repository"("id") ON DELETE SET NULL ON UPDATE CASCADE;
