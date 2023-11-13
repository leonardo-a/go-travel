/*
  Warnings:

  - Added the required column `list_id` to the `travels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "travels" ADD COLUMN     "list_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "travels" ADD CONSTRAINT "travels_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
