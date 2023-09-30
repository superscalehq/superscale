/*
  Warnings:

  - You are about to drop the column `userId` on the `UserInvitation` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `UserInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserInvitation" DROP CONSTRAINT "UserInvitation_userId_fkey";

-- AlterTable
ALTER TABLE "UserInvitation" DROP COLUMN "userId",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserInvitation" ADD CONSTRAINT "UserInvitation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
