/*
  Warnings:

  - A unique constraint covering the columns `[workspaceNumber]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "workspaceNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_workspaceNumber_key" ON "Workspace"("workspaceNumber");
