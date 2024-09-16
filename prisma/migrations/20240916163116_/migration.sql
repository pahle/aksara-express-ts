/*
  Warnings:

  - You are about to drop the column `image` on the `Destination` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Destination` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "image",
DROP COLUMN "price",
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "prices" TEXT[];
