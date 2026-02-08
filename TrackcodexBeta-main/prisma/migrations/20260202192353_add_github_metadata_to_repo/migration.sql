/*
  Warnings:

  - A unique constraint covering the columns `[githubId]` on the table `Repository` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "githubId" INTEGER,
ADD COLUMN     "htmlUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Repository_githubId_key" ON "Repository"("githubId");
