/*
  Warnings:

  - You are about to drop the column `projectId` on the `ToDo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ToDo" DROP CONSTRAINT "ToDo_projectId_fkey";

-- AlterTable
ALTER TABLE "ToDo" DROP COLUMN "projectId";
