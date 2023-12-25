-- AddForeignKey
ALTER TABLE `estimate_line_item_status_maps` ADD CONSTRAINT `estimate_line_item_status_maps_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `status_type`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
