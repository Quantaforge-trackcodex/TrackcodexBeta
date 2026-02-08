/*
  Warnings:

  - You are about to drop the column `isSystem` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "name" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'DIRECT';

-- AlterTable
ALTER TABLE "ConversationParticipant" ALTER COLUMN "lastReadAt" DROP NOT NULL,
ALTER COLUMN "lastReadAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "isSystem",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'TEXT';
