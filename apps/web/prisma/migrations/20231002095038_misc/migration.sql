/*
  Warnings:

  - You are about to drop the column `status` on the `UserInvitation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserInvitation" DROP COLUMN "status";

-- DropEnum
DROP TYPE "UserInvitationStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");
