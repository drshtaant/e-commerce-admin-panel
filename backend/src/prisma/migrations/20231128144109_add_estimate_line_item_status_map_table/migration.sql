-- CreateTable
CREATE TABLE `estimate_line_item_status_maps` (
    `id` CHAR(36) NOT NULL,
    `estimate_id` INTEGER NULL,
    `task_uid` VARCHAR(255) NULL,
    `status_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_estimate_line_item_status_maps_on_task_uid_and_estimate_id`(`task_uid`, `estimate_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
