/*
  Warnings:

  - Made the column `slug` on table `Organization` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "slug" SET NOT NULL;
