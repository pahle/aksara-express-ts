/*
  Warnings:

  - Made the column `username` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "username" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
