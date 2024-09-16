/*
  Warnings:

  - Added the required column `address` to the `Destination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "facilities" TEXT[];
