/*
  Warnings:

  - You are about to drop the `AdminCreatedUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdminCreatedUser" DROP CONSTRAINT "AdminCreatedUser_branchId_fkey";

-- DropForeignKey
ALTER TABLE "AdminCreatedUser" DROP CONSTRAINT "AdminCreatedUser_instituteId_fkey";

-- DropTable
DROP TABLE "AdminCreatedUser";
