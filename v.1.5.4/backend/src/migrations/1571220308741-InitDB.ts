import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitDB1571220308741 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `groups` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(50) NOT NULL, `base_salary` varchar(15) NULL, `week_salary` varchar(15) NULL, `day_salary` varchar(15) NULL, `schedule` json NOT NULL, `department_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `positions` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(50) NOT NULL, `bonus` varchar(15) NULL, `area_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `areas` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(50) NOT NULL, `bonus` varchar(15) NULL, `department_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `departments` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(50) NOT NULL, UNIQUE INDEX `IDX_8681da666ad9699d568b3e9106` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `payslips` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `employee_id` varchar(50) NOT NULL, `base_salary` varchar(15) NOT NULL, `day_salary` varchar(15) NOT NULL, `deduction` json NOT NULL, `reward` json NOT NULL, `report_date` varchar(20) NOT NULL, `meta` json NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `leaves` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `employee_id` varchar(255) NOT NULL, `description` text NOT NULL, `date_start` datetime NOT NULL, `date_end` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `reward_deductions` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `employee_id` varchar(50) NOT NULL, `name` varchar(50) NOT NULL, `type` varchar(255) NOT NULL, `description` text NOT NULL, `date` varchar(20) NOT NULL, `value` varchar(15) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `account_permissions` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `account_id` varchar(255) NOT NULL, `permission_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `permissions` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `role_permissions` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `role_id` varchar(255) NOT NULL, `permission_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `roles` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `description` varchar(255) NULL, UNIQUE INDEX `IDX_648e3f5447f725579d7d4ffdfb` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `account_roles` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `account_id` varchar(255) NOT NULL, `role_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `accounts` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `first_name` varchar(255) NOT NULL, `last_name` varchar(255) NULL, `avatar` varchar(255) NULL, `username` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, UNIQUE INDEX `IDX_477e3187cedfb5a3ac121e899c` (`username`), UNIQUE INDEX `IDX_ee66de6cdc53993296d1ceb8aa` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `employees` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `nik` varchar(20) NOT NULL, `name` varchar(50) NOT NULL, `address` text NULL, `date_entry` datetime NOT NULL, `active` tinyint NOT NULL DEFAULT 0, `active_date` datetime NULL, `department_id` varchar(255) NULL, `group_id` varchar(255) NULL, `created_by` varchar(255) NULL, UNIQUE INDEX `IDX_489786f7733ad24dbb649035d7` (`nik`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `attendances` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `employee_id` varchar(255) NOT NULL, `time_check_in` datetime NOT NULL, `time_check_out` datetime NOT NULL, `time_check_out_for_break` datetime NOT NULL, `time_check_in_for_break` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `reports` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `id_Report` varchar(255) NOT NULL, `date` datetime NOT NULL, `nik` varchar(255) NOT NULL, `time_of_entry` datetime NOT NULL, `time_of_out` datetime NOT NULL, `time_start_break` datetime NOT NULL, `time_end_break` datetime NOT NULL, `description` varchar(255) NOT NULL, UNIQUE INDEX `IDX_514dfbc386e1b1db0c05706d5a` (`id_Report`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `requests` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `id_request` varchar(255) NOT NULL, `date` datetime NOT NULL, `nik` varchar(255) NOT NULL, `time_of_entry` datetime NOT NULL, `time_of_out` datetime NOT NULL, `time_start_break` datetime NOT NULL, `time_end_break` datetime NOT NULL, `description` varchar(255) NOT NULL, UNIQUE INDEX `IDX_7156ff6b08f1dd0be0f43590f4` (`id_request`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `rules` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(50) NOT NULL, `type` varchar(255) NOT NULL, `description` text NOT NULL, `value` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `schedules` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `id_schedule` varchar(255) NOT NULL, `time_of_entry` datetime NOT NULL, `time_of_out` datetime NOT NULL, `time_start_break` datetime NOT NULL, `time_end_break` datetime NOT NULL, UNIQUE INDEX `IDX_d102c541b911421a988e4ef8a0` (`id_schedule`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('ALTER TABLE `groups` ADD CONSTRAINT `FK_59a5caf58073e782a8ee5138be7` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `positions` ADD CONSTRAINT `FK_3c2f9aeb61cc5886d5dc1c643ba` FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `areas` ADD CONSTRAINT `FK_0440b4b861f59957aea8c4276d9` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD CONSTRAINT `FK_3ca6cde51127cd649278d038ca9` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `leaves` ADD CONSTRAINT `FK_29d5827b1f3a86dc19288ec69a5` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `reward_deductions` ADD CONSTRAINT `FK_10e1e917012c90b8c6a10fd4235` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `account_permissions` ADD CONSTRAINT `FK_21707749b5e26ea1d72ff458fc8` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `account_permissions` ADD CONSTRAINT `FK_7bba5aa59faae241e2816f93d07` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `role_permissions` ADD CONSTRAINT `FK_178199805b901ccd220ab7740ec` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `role_permissions` ADD CONSTRAINT `FK_17022daf3f885f7d35423e9971e` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `account_roles` ADD CONSTRAINT `FK_0e94d53a5ed46deaae79475e427` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `account_roles` ADD CONSTRAINT `FK_70186a37bf7b84898bd08f61fba` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `employees` ADD CONSTRAINT `FK_678a3540f843823784b0fe4a4f2` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `employees` ADD CONSTRAINT `FK_4d493f3a20ddc4d8faf6078bf95` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `employees` ADD CONSTRAINT `FK_43d76ca7eecf9373241e2e890fb` FOREIGN KEY (`created_by`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `attendances` ADD CONSTRAINT `FK_43dca8b4751d7449a38b583991c` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `attendances` DROP FOREIGN KEY `FK_43dca8b4751d7449a38b583991c`', undefined);
        await queryRunner.query('ALTER TABLE `employees` DROP FOREIGN KEY `FK_43d76ca7eecf9373241e2e890fb`', undefined);
        await queryRunner.query('ALTER TABLE `employees` DROP FOREIGN KEY `FK_4d493f3a20ddc4d8faf6078bf95`', undefined);
        await queryRunner.query('ALTER TABLE `employees` DROP FOREIGN KEY `FK_678a3540f843823784b0fe4a4f2`', undefined);
        await queryRunner.query('ALTER TABLE `account_roles` DROP FOREIGN KEY `FK_70186a37bf7b84898bd08f61fba`', undefined);
        await queryRunner.query('ALTER TABLE `account_roles` DROP FOREIGN KEY `FK_0e94d53a5ed46deaae79475e427`', undefined);
        await queryRunner.query('ALTER TABLE `role_permissions` DROP FOREIGN KEY `FK_17022daf3f885f7d35423e9971e`', undefined);
        await queryRunner.query('ALTER TABLE `role_permissions` DROP FOREIGN KEY `FK_178199805b901ccd220ab7740ec`', undefined);
        await queryRunner.query('ALTER TABLE `account_permissions` DROP FOREIGN KEY `FK_7bba5aa59faae241e2816f93d07`', undefined);
        await queryRunner.query('ALTER TABLE `account_permissions` DROP FOREIGN KEY `FK_21707749b5e26ea1d72ff458fc8`', undefined);
        await queryRunner.query('ALTER TABLE `reward_deductions` DROP FOREIGN KEY `FK_10e1e917012c90b8c6a10fd4235`', undefined);
        await queryRunner.query('ALTER TABLE `leaves` DROP FOREIGN KEY `FK_29d5827b1f3a86dc19288ec69a5`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP FOREIGN KEY `FK_3ca6cde51127cd649278d038ca9`', undefined);
        await queryRunner.query('ALTER TABLE `areas` DROP FOREIGN KEY `FK_0440b4b861f59957aea8c4276d9`', undefined);
        await queryRunner.query('ALTER TABLE `positions` DROP FOREIGN KEY `FK_3c2f9aeb61cc5886d5dc1c643ba`', undefined);
        await queryRunner.query('ALTER TABLE `groups` DROP FOREIGN KEY `FK_59a5caf58073e782a8ee5138be7`', undefined);
        await queryRunner.query('DROP INDEX `IDX_d102c541b911421a988e4ef8a0` ON `schedules`', undefined);
        await queryRunner.query('DROP TABLE `schedules`', undefined);
        await queryRunner.query('DROP TABLE `rules`', undefined);
        await queryRunner.query('DROP INDEX `IDX_7156ff6b08f1dd0be0f43590f4` ON `requests`', undefined);
        await queryRunner.query('DROP TABLE `requests`', undefined);
        await queryRunner.query('DROP INDEX `IDX_514dfbc386e1b1db0c05706d5a` ON `reports`', undefined);
        await queryRunner.query('DROP TABLE `reports`', undefined);
        await queryRunner.query('DROP TABLE `attendances`', undefined);
        await queryRunner.query('DROP INDEX `IDX_489786f7733ad24dbb649035d7` ON `employees`', undefined);
        await queryRunner.query('DROP TABLE `employees`', undefined);
        await queryRunner.query('DROP INDEX `IDX_ee66de6cdc53993296d1ceb8aa` ON `accounts`', undefined);
        await queryRunner.query('DROP INDEX `IDX_477e3187cedfb5a3ac121e899c` ON `accounts`', undefined);
        await queryRunner.query('DROP TABLE `accounts`', undefined);
        await queryRunner.query('DROP TABLE `account_roles`', undefined);
        await queryRunner.query('DROP INDEX `IDX_648e3f5447f725579d7d4ffdfb` ON `roles`', undefined);
        await queryRunner.query('DROP TABLE `roles`', undefined);
        await queryRunner.query('DROP TABLE `role_permissions`', undefined);
        await queryRunner.query('DROP TABLE `permissions`', undefined);
        await queryRunner.query('DROP TABLE `account_permissions`', undefined);
        await queryRunner.query('DROP TABLE `reward_deductions`', undefined);
        await queryRunner.query('DROP TABLE `leaves`', undefined);
        await queryRunner.query('DROP TABLE `payslips`', undefined);
        await queryRunner.query('DROP INDEX `IDX_8681da666ad9699d568b3e9106` ON `departments`', undefined);
        await queryRunner.query('DROP TABLE `departments`', undefined);
        await queryRunner.query('DROP TABLE `areas`', undefined);
        await queryRunner.query('DROP TABLE `positions`', undefined);
        await queryRunner.query('DROP TABLE `groups`', undefined);
    }

}
