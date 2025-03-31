/*
  Warnings:

  - You are about to drop the `PendingApproval` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PendingApproval" DROP CONSTRAINT "PendingApproval_contestId_fkey";

-- DropForeignKey
ALTER TABLE "PendingApproval" DROP CONSTRAINT "PendingApproval_userId_fkey";

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "status" "ApprovalStatus" NOT NULL;

-- DropTable
DROP TABLE "PendingApproval";
