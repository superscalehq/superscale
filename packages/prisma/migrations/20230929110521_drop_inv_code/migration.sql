/*
  Warnings:

  - You are about to drop the column `code` on the `UserInvitation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UserInvitation_code_key";

-- AlterTable
ALTER TABLE "UserInvitation" DROP COLUMN "code";
