-- AlterTable
ALTER TABLE "Commit" ADD COLUMN     "message" TEXT,
ADD COLUMN     "parentHashes" TEXT[],
ADD COLUMN     "treeHash" TEXT;
