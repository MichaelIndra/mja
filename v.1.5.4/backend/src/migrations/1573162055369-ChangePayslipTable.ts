import {MigrationInterface, QueryRunner} from 'typeorm';

export class ChangePayslipTable1573162055369 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `day_salary`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `report_date`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `deduction`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `reward`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `meta`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `start_at` datetime NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `end_at` datetime NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `print_at` datetime NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `employee_meta` json NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `total_day` varchar(15) NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `daily_base_salary` varchar(15) NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `total_base_daily` varchar(15) NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `total_base` varchar(15) NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `total_reward` varchar(15) NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `total_deduction` varchar(15) NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `total` varchar(15) NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `payslip_meta` json NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `created_by_id` varchar(50) NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `account_id` varchar(255) NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD CONSTRAINT `FK_0a5fec177873e44b64f26fc2e34` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `payslips` DROP FOREIGN KEY `FK_0a5fec177873e44b64f26fc2e34`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `account_id`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `created_by_id`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `payslip_meta`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `total`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `total_deduction`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `total_reward`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `total_base`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `total_base_daily`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `daily_base_salary`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `total_day`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `employee_meta`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `print_at`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `end_at`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `start_at`', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `meta` json NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `reward` json NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `deduction` json NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `report_date` varchar(20) NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `payslips` ADD `day_salary` varchar(15) NOT NULL', undefined);
    }

}
