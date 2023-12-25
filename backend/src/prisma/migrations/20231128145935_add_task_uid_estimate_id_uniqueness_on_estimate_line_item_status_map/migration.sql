/*
  Warnings:

  - A unique constraint covering the columns `[task_uid,estimate_id]` on the table `estimate_line_item_status_maps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `estimate_line_item_status_maps_task_uid_estimate_id_key` ON `estimate_line_item_status_maps`(`task_uid`, `estimate_id`);
