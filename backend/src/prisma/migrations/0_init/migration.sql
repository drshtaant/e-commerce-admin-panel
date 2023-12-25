-- CreateTable
CREATE TABLE `accruals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `work_statement_id` INTEGER NULL,
    `name` VARCHAR(255) NULL,
    `month` INTEGER NULL,
    `year` INTEGER NULL,
    `hours` DECIMAL(12, 2) NULL,
    `closed` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `addressable_type` VARCHAR(255) NULL,
    `addressable_id` INTEGER NULL,
    `line1` VARCHAR(255) NULL,
    `line2` VARCHAR(255) NULL,
    `line3` VARCHAR(255) NULL,
    `line4` VARCHAR(255) NULL,
    `line5` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `country` VARCHAR(255) NULL,
    `postal_code` INTEGER NULL,
    `country_sub_division_code` VARCHAR(255) NULL,
    `address_type` VARCHAR(255) NULL,
    `quickbooks_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_addresses_on_addressable_id`(`addressable_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ar_internal_metadata` (
    `key` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `background_jobs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `job_type` VARCHAR(255) NULL,
    `job_id` INTEGER NULL,
    `status` INTEGER NULL,
    `employee_id` INTEGER NULL,
    `start_at` DATETIME(0) NULL,
    `end_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budgets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `total_amount` DECIMAL(12, 2) NULL,
    `fromdate` DATE NULL,
    `todate` DATE NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `work_statement_id` INTEGER NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `capacity_indicators` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_role` VARCHAR(255) NULL,
    `week` INTEGER NULL,
    `unallocated_hours` FLOAT NULL,
    `available_hours` FLOAT NULL,
    `status` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `change_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `dollar_budget` FLOAT NULL,
    `impact_on_cost` FLOAT NULL,
    `impact_on_deadline` DATE NULL,
    `milestone_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_change_requests_on_milestone_id`(`milestone_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `sku` VARCHAR(255) NULL,
    `department_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `active` BOOLEAN NULL DEFAULT true,

    INDEX `index_classifications_on_department_id`(`department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_name` VARCHAR(255) NULL,
    `account_type` VARCHAR(255) NULL,
    `headquarter_location` VARCHAR(255) NULL,
    `quickbooks_id` INTEGER NULL,
    `status` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_account_id` INTEGER NULL,
    `name` VARCHAR(255) NULL,
    `details` TEXT NULL,
    `quickbooks_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_company_departments_on_company_account_id`(`company_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `components` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jira_id` INTEGER NULL,
    `service_id` INTEGER NULL,
    `project_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,

    INDEX `index_components_on_project_id`(`project_id`),
    INDEX `index_components_on_service_id`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `components_issues` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `component_id` INTEGER NULL,
    `issue_id` INTEGER NULL,

    INDEX `index_components_issues_on_component_id`(`component_id`),
    INDEX `index_components_issues_on_issue_id`(`issue_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `components_work_logs` (
    `component_id` INTEGER NULL,
    `work_log_id` INTEGER NULL,

    INDEX `index_components_work_logs_on_component_id`(`component_id`),
    INDEX `index_components_work_logs_on_work_log_id`(`work_log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_department_id` INTEGER NULL,
    `first_name` VARCHAR(255) NULL,
    `middle_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(255) NULL,
    `title` VARCHAR(255) NULL,
    `suffix` VARCHAR(255) NULL,
    `quickbooks_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_contacts_on_company_department_id`(`company_department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `details` TEXT NULL,
    `quickbooks_id` BIGINT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `organization_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `designations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `department_id` INTEGER NULL,
    `title` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `location_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `non_exempt` BOOLEAN NULL DEFAULT false,

    INDEX `index_designations_on_department_id`(`department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_skills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NULL,
    `service_id` INTEGER NULL,
    `skill_type` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `skill_id` INTEGER NULL,
    `skill_note` TEXT NULL,

    INDEX `index_employee_skills_on_employee_id`(`employee_id`),
    INDEX `index_employee_skills_on_service_id`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL DEFAULT '',
    `encrypted_password` VARCHAR(255) NOT NULL DEFAULT '',
    `reset_password_token` VARCHAR(255) NULL,
    `reset_password_sent_at` DATETIME(0) NULL,
    `remember_created_at` DATETIME(0) NULL,
    `sign_in_count` INTEGER NOT NULL DEFAULT 0,
    `current_sign_in_at` DATETIME(0) NULL,
    `last_sign_in_at` DATETIME(0) NULL,
    `current_sign_in_ip` VARCHAR(255) NULL,
    `last_sign_in_ip` VARCHAR(255) NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `office_phone` VARCHAR(255) NULL,
    `cell_phone` VARCHAR(255) NULL,
    `internal_department_id` INTEGER NULL,
    `organization_id` INTEGER NULL,
    `jira_username` VARCHAR(255) NULL,
    `status` VARCHAR(255) NULL DEFAULT 'blocked',
    `gender` VARCHAR(255) NULL,
    `dob` DATE NULL,
    `skype` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `provider` VARCHAR(255) NULL,
    `uid` VARCHAR(255) NULL,
    `group` VARCHAR(255) NULL,
    `bio` TEXT NULL,
    `image` VARCHAR(255) NULL,
    `personal_email` VARCHAR(255) NULL,
    `joining_date` DATE NULL,
    `designation_id` INTEGER NULL,
    `location_id` INTEGER NULL,
    `is_supervisor` BOOLEAN NULL DEFAULT false,
    `middle_name` VARCHAR(255) NULL,
    `jira_account_id` VARCHAR(255) NULL,
    `keka_employee_id` VARCHAR(255) NULL,

    UNIQUE INDEX `index_employees_on_email`(`email`),
    UNIQUE INDEX `index_employees_on_reset_password_token`(`reset_password_token`),
    INDEX `index_employees_on_jira_username`(`jira_username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees_projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NULL,
    `project_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NULL,
    `role_id` INTEGER NULL,

    INDEX `index_employees_roles_on_employee_id`(`employee_id`),
    INDEX `index_employees_roles_on_role_id`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees_tours` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NULL,
    `tour_id` INTEGER NULL,
    `active` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees_work_statements` (
    `employee_id` INTEGER NULL,
    `work_statement_id` INTEGER NULL,

    INDEX `index_employees_work_statements_on_employee_id`(`employee_id`),
    INDEX `index_employees_work_statements_on_work_statement_id`(`work_statement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estimate_line_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `linked_to` VARCHAR(255) NULL,
    `notes` TEXT NULL,
    `hours` FLOAT NULL,
    `parent_id` INTEGER NULL,
    `type` VARCHAR(255) NULL,
    `uid` VARCHAR(255) NULL,
    `estimate_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `duration` INTEGER NULL,

    INDEX `index_estimate_line_items_on_estimate_id`(`estimate_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estimate_resources` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estimate_id` INTEGER NULL,
    `employee_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `project_role` VARCHAR(255) NULL,
    `hourly_rate` DECIMAL(12, 2) NULL,
    `resource_role` VARCHAR(255) NULL,

    INDEX `index_estimate_resources_on_employee_id`(`employee_id`),
    INDEX `index_estimate_resources_on_estimate_id`(`estimate_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estimates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sheet_url` VARCHAR(255) NULL,
    `sheet_name` VARCHAR(255) NULL,
    `project_name` VARCHAR(255) NULL,
    `status` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `last_synced_at` DATETIME(0) NULL,
    `jira_project_key` VARCHAR(255) NULL,
    `contract_type` INTEGER NULL DEFAULT 0,
    `budget` DECIMAL(12, 2) NULL,
    `start_date` DATE NULL,
    `company_department_id` INTEGER NULL,
    `pool_type` INTEGER NULL,

    INDEX `index_estimates_on_jira_project_key`(`jira_project_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estimo_estimate_resource_versions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `estimate_resource_id` INTEGER NULL,
    `column` VARCHAR(255) NULL,
    `from_date` DATE NULL,
    `to_date` DATE NULL,
    `column_value` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_accrual_intervals` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `interval_type` INTEGER NULL,
    `interval_start` DATE NULL,
    `active` BOOLEAN NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_accrual_versions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `item_type` VARCHAR(255) NOT NULL,
    `item_id` INTEGER NOT NULL,
    `event` VARCHAR(255) NOT NULL,
    `whodunnit` VARCHAR(255) NULL,
    `object` LONGTEXT NULL,
    `object_changes` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `comments` TEXT NULL,
    `manual` BOOLEAN NULL,
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `index_finance_accrual_versions_on_item_type_and_item_id`(`item_type`, `item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_accruals` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `revenue` DECIMAL(12, 2) NULL,
    `snapshot_id` INTEGER NULL,
    `project_accrual_id` INTEGER NULL,
    `hours` FLOAT NULL,
    `active` BOOLEAN NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `accrual_interval_id` INTEGER NULL,

    INDEX `index_finance_accruals_on_project_accrual_id`(`project_accrual_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_budgeted_accruals` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `interval_type` INTEGER NULL,
    `interval_start` DATE NULL,
    `amount` DECIMAL(12, 2) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_cash_balances` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `interval_type` INTEGER NULL,
    `interval_start` DATE NULL,
    `cash_value` DECIMAL(12, 2) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_hubspot_deal_accruals` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `deal_id` INTEGER NULL,
    `snapshot_id` INTEGER NULL,
    `accrual_interval_id` INTEGER NULL,
    `monthly_revenue` DECIMAL(12, 2) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_hubspot_deal_stages` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `hubspot_stage_name` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_hubspot_deal_versions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `deal_id` INTEGER NULL,
    `column` VARCHAR(255) NULL,
    `column_value` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_hubspot_deals` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `hubspot_deal_id` VARCHAR(255) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `duration_in_months` INTEGER NULL,
    `stage_id` INTEGER NULL,
    `account_manager_id` INTEGER NULL,
    `type` VARCHAR(255) NULL,
    `budgeted_revenue` DECIMAL(12, 2) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_invoices` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `value` DECIMAL(12, 2) NULL,
    `accrual_id` INTEGER NULL,
    `invoice_date` DATE NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `invoice_no` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_project_accrual_versions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `project_accrual_id` INTEGER NULL,
    `column` VARCHAR(255) NULL,
    `from_date` DATE NULL,
    `to_date` DATE NULL,
    `column_value` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_project_accruals` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `contract_type` INTEGER NULL,
    `estimate_id` INTEGER NULL,
    `account_manager_id` INTEGER NULL,
    `project_manager_id` INTEGER NULL,
    `contract_months` INTEGER NULL,
    `start_date` DATE NULL,
    `active` BOOLEAN NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `jira_code` VARCHAR(255) NULL,
    `company_department_id` INTEGER NULL,
    `end_date` DATE NULL,
    `budgeted_revenue` DECIMAL(12, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance_snapshots` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `active` BOOLEAN NULL,
    `interval_type` INTEGER NULL,
    `interval_start` DATE NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fiscal_adjustments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `snapshot_id` INTEGER NULL,
    `value` DECIMAL(8, 2) NULL DEFAULT 0.00,
    `notes` TEXT NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_fiscal_adjustments_on_snapshot_id`(`snapshot_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fiscal_datapoints` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fiscal_snapshots` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datapoint_id` INTEGER NULL,
    `value` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `year` VARCHAR(255) NULL,
    `month` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_fiscal_snapshots_on_datapoint_id`(`datapoint_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fix_versions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `jira_id` INTEGER NULL,
    `project_id` INTEGER NULL,
    `start_date` DATE NULL,
    `release_date` DATE NULL,
    `released` BOOLEAN NULL,
    `overdue` BOOLEAN NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_fix_versions_on_project_id`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fix_versions_work_statements` (
    `fix_version_id` INTEGER NULL,
    `work_statement_id` INTEGER NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gcal_events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guid` VARCHAR(255) NULL,
    `employee_id` INTEGER NULL,
    `acceptance_status` VARCHAR(255) NULL,
    `starts_at` DATETIME(0) NULL,
    `ends_at` DATETIME(0) NULL,
    `summary` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `holidays` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `holiday_date` DATE NULL,
    `recurring` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `active` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `holidays_locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `holiday_id` INTEGER NULL,
    `location_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoice_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quickbooks_id` INTEGER NULL,
    `invoice_id` INTEGER NULL,
    `quantity` FLOAT NULL,
    `taxable` BOOLEAN NULL,
    `service_id` INTEGER NULL,
    `internal_department_id` INTEGER NULL,
    `memo` TEXT NULL,
    `transaction_type` VARCHAR(255) NULL,
    `detail_type` VARCHAR(255) NULL,
    `service_text` VARCHAR(255) NULL,
    `internal_department_text` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `rate` DECIMAL(12, 2) NULL,
    `amount` DECIMAL(12, 2) NULL,
    `amount_received` DECIMAL(12, 2) NULL,

    INDEX `index_invoice_items_on_internal_department_id`(`internal_department_id`),
    INDEX `index_invoice_items_on_invoice_id`(`invoice_id`),
    INDEX `index_invoice_items_on_service_id`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_number` VARCHAR(255) NULL,
    `invoice_date` DATE NULL,
    `company_account_id` INTEGER NULL,
    `work_statement_id` INTEGER NULL,
    `quickbooks_id` INTEGER NULL,
    `term_id` INTEGER NULL,
    `ref_no` VARCHAR(255) NULL,
    `po_no` VARCHAR(255) NULL,
    `sent` BOOLEAN NULL DEFAULT false,
    `due_date` DATE NULL,
    `customer_memo` TEXT NULL,
    `currency` VARCHAR(255) NULL,
    `private_note` TEXT NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `balance` DECIMAL(12, 2) NULL,
    `total_amount` DECIMAL(12, 2) NULL,
    `total_tax` DECIMAL(12, 2) NULL,
    `sub_total` DECIMAL(12, 2) NULL,
    `balance_without_tax` DECIMAL(12, 2) NULL,
    `tax_percent` DECIMAL(5, 2) NULL,

    INDEX `index_invoices_on_company_account_id`(`company_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoices_payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` INTEGER NULL,
    `payment_id` INTEGER NULL,

    INDEX `index_invoices_payments_on_invoice_id`(`invoice_id`),
    INDEX `index_invoices_payments_on_payment_id`(`payment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `involved_contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contact_id` INTEGER NULL,
    `work_statement_id` INTEGER NULL,
    `contact_type` VARCHAR(255) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_involved_contacts_on_contact_id`(`contact_id`),
    INDEX `index_involved_contacts_on_work_statement_id`(`work_statement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `involved_departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `department_id` INTEGER NULL,
    `service_id` INTEGER NULL,
    `involvable_id` INTEGER NULL,
    `involvable_type` VARCHAR(255) NULL,
    `hours` FLOAT NULL DEFAULT 0,
    `hourly_rate` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `discounted_hours` FLOAT NULL DEFAULT 0,
    `discounted_price` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `price` FLOAT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `location_id` INTEGER NULL,
    `project_role_id` INTEGER NULL,

    INDEX `index_involved_departments_on_department_id`(`department_id`),
    INDEX `index_involved_departments_on_involvable_id`(`involvable_id`),
    INDEX `index_involved_departments_on_service_id`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `issue_sources` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `source_id` INTEGER NULL,
    `source_type` VARCHAR(255) NULL,
    `issue_jira_id` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `issues` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jira_key` VARCHAR(255) NULL,
    `jira_id` VARCHAR(255) NULL,
    `summary` VARCHAR(255) NULL,
    `description` LONGTEXT NULL,
    `subtask` BOOLEAN NULL,
    `parent_issue_key` VARCHAR(255) NULL,
    `priority` VARCHAR(255) NULL,
    `status` VARCHAR(255) NULL,
    `resolution` VARCHAR(255) NULL,
    `original_estimate_hours` INTEGER NULL,
    `hours_spent` INTEGER NULL,
    `project_id` INTEGER NULL,
    `work_statement_id` INTEGER NULL,
    `assignee_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `fix_version_id` INTEGER NULL,
    `issuetype` VARCHAR(255) NULL,
    `estimate_line_item_uid` VARCHAR(255) NULL,

    UNIQUE INDEX `index_issues_on_jira_key`(`jira_key`),
    INDEX `index_issues_on_assignee_id`(`assignee_id`),
    INDEX `index_issues_on_project_id`(`project_id`),
    INDEX `index_issues_on_work_statement_id`(`work_statement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_applications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NULL,
    `reason` TEXT NULL,
    `from_date` DATE NULL,
    `to_date` DATE NULL,
    `hours` INTEGER NULL,
    `status` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `leave_type_id` INTEGER NULL,
    `keka_leave_id` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_approvals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `leave_application_id` INTEGER NULL,
    `status` VARCHAR(255) NULL,
    `employee_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `comment` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leaves` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `balance_days` DECIMAL(10, 0) NULL,
    `balance_hours` DECIMAL(10, 2) NULL,
    `employee_id` INTEGER NULL,
    `leave_type_id` INTEGER NULL,
    `calendar_year` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `line_item_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `task_date` DATE NULL,
    `hours` DECIMAL(6, 2) NULL,
    `holiday_for` VARCHAR(255) NULL,
    `estimate_line_item_id` INTEGER NULL,
    `employee_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `estimate_resource_id` INTEGER NULL,
    `resource_allocation_id` INTEGER NULL,

    INDEX `index_line_item_details_on_employee_id`(`employee_id`),
    INDEX `index_line_item_details_on_estimate_line_item_id`(`estimate_line_item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `street_address` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `state` VARCHAR(255) NULL,
    `zip` INTEGER NULL,
    `country` VARCHAR(255) NULL,
    `currency` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `time_zone` VARCHAR(255) NULL DEFAULT 'UTC',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations_organizations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` INTEGER NULL,
    `organization_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lokem_features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `module_id` INTEGER NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `description` TEXT NULL,
    `policy_name` VARCHAR(255) NULL,

    INDEX `index_lokem_features_on_module_id`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lokem_modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lokem_permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `feature_id` INTEGER NULL,
    `access_level` VARCHAR(255) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `role_id` INTEGER NULL,

    INDEX `index_lokem_permissions_on_feature_id`(`feature_id`),
    INDEX `index_lokem_permissions_on_role_id`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lokem_permitted_locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `permission_id` INTEGER NULL,
    `location_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lokem_role_assignments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_id` INTEGER NULL,
    `assignable_id` INTEGER NULL,
    `assignable_type` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_lokem_role_assignments_on_assignable_id`(`assignable_id`),
    INDEX `index_lokem_role_assignments_on_role_id`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lokem_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `milestones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `expected_billing_date` DATE NULL,
    `actual_billing_date` DATE NULL,
    `work_statement_id` INTEGER NULL,
    `type` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_milestones_on_work_statement_id`(`work_statement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NULL,
    `message` TEXT NULL,
    `sent_at` DATETIME(0) NULL,
    `scheduled_for` DATETIME(0) NULL,
    `sent_mode` VARCHAR(255) NULL,
    `source_id` INTEGER NULL,
    `source_type` VARCHAR(255) NULL,
    `reason` VARCHAR(255) NULL,
    `attachment` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_access_grants` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `resource_owner_id` INTEGER NULL,
    `application_id` BIGINT NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_in` INTEGER NOT NULL,
    `redirect_uri` TEXT NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `revoked_at` DATETIME(0) NULL,
    `scopes` VARCHAR(255) NOT NULL DEFAULT '',

    UNIQUE INDEX `index_oauth_access_grants_on_token`(`token`),
    INDEX `fk_rails_330c32d8d9`(`resource_owner_id`),
    INDEX `index_oauth_access_grants_on_application_id`(`application_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_access_tokens` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `resource_owner_id` INTEGER NULL,
    `application_id` BIGINT NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `refresh_token` VARCHAR(255) NULL,
    `expires_in` INTEGER NULL,
    `revoked_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `scopes` VARCHAR(255) NULL,
    `previous_refresh_token` VARCHAR(255) NOT NULL DEFAULT '',

    UNIQUE INDEX `index_oauth_access_tokens_on_token`(`token`),
    UNIQUE INDEX `index_oauth_access_tokens_on_refresh_token`(`refresh_token`),
    INDEX `fk_rails_ee63f25419`(`resource_owner_id`),
    INDEX `index_oauth_access_tokens_on_application_id`(`application_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_applications` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `uid` VARCHAR(255) NOT NULL,
    `secret` VARCHAR(255) NOT NULL,
    `redirect_uri` TEXT NOT NULL,
    `scopes` VARCHAR(255) NOT NULL DEFAULT '',
    `confidential` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `index_oauth_applications_on_uid`(`uid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organizations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `active` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` INTEGER NULL,
    `qb_payment_id` INTEGER NULL,
    `paid_amount` DECIMAL(12, 2) NULL,
    `payment_method` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_payment_details_on_invoice_id`(`invoice_id`),
    INDEX `index_payment_details_on_qb_payment_id`(`qb_payment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `work_statement_id` INTEGER NULL,
    `actual_billing_date` DATE NULL,
    `amount` FLOAT NULL,
    `dollar_to_bill` FLOAT NULL,
    `percentage_to_bill` INTEGER NULL,
    `payable_type` VARCHAR(255) NULL,
    `payable_id` INTEGER NULL,
    `status` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_payment_schedules_on_payable_id`(`payable_id`),
    INDEX `index_payment_schedules_on_work_statement_id`(`work_statement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `amount` FLOAT NULL,
    `expected_date` DATE NULL,
    `actual_date` DATE NULL,
    `status` VARCHAR(255) NULL,
    `milestone_id` INTEGER NULL,
    `payable_type` VARCHAR(255) NULL,
    `payable_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `expected_invoice_date` DATE NULL,

    INDEX `index_payments_on_milestone_id`(`milestone_id`),
    INDEX `index_payments_on_payable_id`(`payable_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `source_id` INTEGER NULL,
    `source_type` VARCHAR(255) NULL,
    `start_at` DATETIME(0) NULL,
    `end_at` DATETIME(0) NULL,
    `task_description` TEXT NULL,
    `employee_id` INTEGER NULL,
    `hours` DECIMAL(8, 4) NULL,
    `last_synced_at` DATETIME(0) NULL,
    `tempo_plan_item_id` INTEGER NULL,
    `issue_id` INTEGER NULL,
    `project_id` INTEGER NULL,

    INDEX `index_plan_items_on_employee_id`(`employee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `programs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `company_id` INTEGER NULL,
    `company_department_id` INTEGER NULL,
    `yearly_budget` DECIMAL(12, 2) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_codes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(255) NULL,
    `code_type` VARCHAR(255) NULL,
    `project_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `last_sync_at` DATETIME(0) NULL,
    `foreign_id` VARCHAR(255) NULL,

    INDEX `index_project_codes_on_code`(`code`),
    INDEX `index_project_codes_on_project_id`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_leaves` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NULL,
    `leave_application_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NULL,
    `work_statement_id` INTEGER NULL,
    `project_role_id` INTEGER NULL,
    `membership_start_date` DATE NULL,
    `membership_end_date` DATE NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `project_id` INTEGER NULL,

    INDEX `index_project_members_on_employee_id`(`employee_id`),
    INDEX `index_project_members_on_project_role_id`(`project_role_id`),
    INDEX `index_project_members_on_work_statement_id`(`work_statement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_owners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ownable_type` VARCHAR(255) NULL,
    `ownable_id` INTEGER NULL,
    `employee_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `work_statement_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `service_id` INTEGER NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `project_type` VARCHAR(255) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `company_department_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `logo_url` VARCHAR(255) NULL,
    `program_id` INTEGER NULL,

    INDEX `index_projects_on_company_department_id`(`company_department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qb_payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quickbooks_id` INTEGER NULL,
    `paid_on` DATE NULL,
    `total_amount` DECIMAL(12, 2) NULL,
    `currency` VARCHAR(255) NULL,
    `exchange_rate` DECIMAL(8, 2) NULL,
    `private_note` TEXT NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qualifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NULL,
    `course` VARCHAR(255) NULL,
    `specialization` VARCHAR(255) NULL,
    `institution` VARCHAR(255) NULL,
    `grade` VARCHAR(255) NULL,
    `completion_year` SMALLINT NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resource_allocations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estimate_resource_id` INTEGER NULL,
    `estimate_line_item_id` INTEGER NULL,
    `billed_hours` DECIMAL(10, 2) NULL,
    `write_off` DECIMAL(10, 2) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_resource_allocations_on_estimate_line_item_id`(`estimate_line_item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resource_budgetings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `billed_hours` FLOAT NULL,
    `unbilled_hours` FLOAT NULL,
    `cost_rate` FLOAT NULL,
    `sell_rate` FLOAT NULL,
    `designation` VARCHAR(255) NULL,
    `estimate_line_item_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_resource_budgetings_on_estimate_line_item_id`(`estimate_line_item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schema_migrations` (
    `version` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `unique_schema_migrations`(`version`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_designations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `designation_id` INTEGER NULL,
    `service_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_service_designations_on_designation_id`(`designation_id`),
    INDEX `index_service_designations_on_service_id`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `department_id` INTEGER NULL,
    `quickbooks_id` BIGINT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `sku` VARCHAR(255) NULL,
    `classification_id` INTEGER NULL,

    INDEX `index_services_on_department_id`(`department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` VARCHAR(255) NOT NULL,
    `data` TEXT NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    UNIQUE INDEX `index_sessions_on_session_id`(`session_id`),
    INDEX `index_sessions_on_updated_at`(`updated_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `skill_name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supervisors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NULL,
    `supervisor_id` INTEGER NULL,
    `type` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NULL,
    `team_id` INTEGER NULL,
    `active` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `department_id` INTEGER NULL,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `active` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tempo_sync_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NULL,
    `status` VARCHAR(255) NULL,
    `requested_by` INTEGER NULL,
    `requested_at` DATETIME(0) NULL,
    `started_at` DATETIME(0) NULL,
    `ended_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `encrypted_token` TEXT NULL,
    `encrypted_secret` TEXT NULL,
    `realm_id` VARCHAR(255) NULL,
    `expiry_date` DATE NULL,
    `encrypted_raw_token` TEXT NULL,
    `token_type` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `secret_code` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tours` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `versions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_type` VARCHAR(191) NOT NULL,
    `item_id` INTEGER NOT NULL,
    `event` VARCHAR(255) NOT NULL,
    `whodunnit` VARCHAR(255) NULL,
    `object` LONGTEXT NULL,
    `created_at` DATETIME(0) NULL,
    `object_changes` LONGTEXT NULL,
    `initial_expected_invoice_date` DATE NULL,
    `expected_invoice_date_changed` BOOLEAN NULL DEFAULT false,
    `comments` TEXT NULL,
    `manual` BOOLEAN NULL DEFAULT false,

    INDEX `index_versions_on_item_type_and_item_id`(`item_type`, `item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `work_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `work_statement_id` INTEGER NULL,
    `work_date` DATE NULL,
    `hours` DECIMAL(8, 2) NULL,
    `tempo_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `issue_id` INTEGER NULL,
    `fix_version_id` INTEGER NULL,
    `project_member_id` INTEGER NULL,
    `jira_author` VARCHAR(255) NULL,
    `billed_hours` DECIMAL(8, 2) NULL,
    `jira_account_id` VARCHAR(255) NULL,
    `employee_id` INTEGER NULL,

    UNIQUE INDEX `index_work_logs_on_tempo_id`(`tempo_id`),
    INDEX `index_work_logs_on_employee_id`(`employee_id`),
    INDEX `index_work_logs_on_issue_id`(`issue_id`),
    INDEX `index_work_logs_on_jira_author`(`jira_author`),
    INDEX `index_work_logs_on_work_statement_id`(`work_statement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `work_statements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NULL,
    `name` VARCHAR(255) NULL,
    `price` FLOAT NULL,
    `start_date` DATE NULL,
    `projected_end_date` DATE NULL,
    `actual_end_date` DATE NULL,
    `status` VARCHAR(255) NULL,
    `contract_type` VARCHAR(255) NULL,
    `change_request` BOOLEAN NULL,
    `master_work_statement_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `index_work_statements_on_project_id`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estimate_line_items` ADD CONSTRAINT `estimate_line_items_estimate_id_fkey` FOREIGN KEY (`estimate_id`) REFERENCES `estimates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estimate_resources` ADD CONSTRAINT `estimate_resources_estimate_id_fkey` FOREIGN KEY (`estimate_id`) REFERENCES `estimates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estimate_resources` ADD CONSTRAINT `estimate_resources_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `oauth_access_grants` ADD CONSTRAINT `fk_rails_330c32d8d9` FOREIGN KEY (`resource_owner_id`) REFERENCES `employees`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `oauth_access_grants` ADD CONSTRAINT `fk_rails_b4b53e07b8` FOREIGN KEY (`application_id`) REFERENCES `oauth_applications`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `oauth_access_tokens` ADD CONSTRAINT `fk_rails_732cb83ab7` FOREIGN KEY (`application_id`) REFERENCES `oauth_applications`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `oauth_access_tokens` ADD CONSTRAINT `fk_rails_ee63f25419` FOREIGN KEY (`resource_owner_id`) REFERENCES `employees`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `resource_allocations` ADD CONSTRAINT `resource_allocations_estimate_resource_id_fkey` FOREIGN KEY (`estimate_resource_id`) REFERENCES `estimate_resources`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resource_allocations` ADD CONSTRAINT `resource_allocations_estimate_line_item_id_fkey` FOREIGN KEY (`estimate_line_item_id`) REFERENCES `estimate_line_items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

