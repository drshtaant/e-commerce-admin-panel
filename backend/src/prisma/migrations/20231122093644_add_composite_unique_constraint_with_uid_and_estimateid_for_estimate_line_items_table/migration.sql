/*
  Warnings:

  - A unique constraint covering the columns `[uid,estimate_id]` on the table `estimate_line_items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `estimate_line_items_uid_estimate_id_key` ON `estimate_line_items`(`uid`, `estimate_id`);
