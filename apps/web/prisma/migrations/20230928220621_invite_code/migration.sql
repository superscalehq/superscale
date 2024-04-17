/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `UserInvitation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `UserInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserInvitation" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserInvitation_code_key" ON "UserInvitation"("code");
