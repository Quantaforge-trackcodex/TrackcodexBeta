-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileReadme" TEXT,
ADD COLUMN     "resumeFilename" TEXT,
ADD COLUMN     "resumeUploadedAt" TIMESTAMP(3),
ADD COLUMN     "resumeUrl" TEXT,
ADD COLUMN     "showReadme" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showResume" BOOLEAN NOT NULL DEFAULT false;
