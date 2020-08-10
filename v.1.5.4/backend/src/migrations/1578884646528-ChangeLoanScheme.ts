import {MigrationInterface, QueryRunner} from 'typeorm';

export class ChangeLoanScheme1578884646528 implements MigrationInterface {
    name = 'ChangeLoanScheme1578884646528';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `loans` ADD `total_loan_before` int NOT NULL DEFAULT 0', undefined);
        await queryRunner.query('ALTER TABLE `loans` ADD `total_loan_current` int NOT NULL DEFAULT 0', undefined);
        await queryRunner.query('ALTER TABLE `loans` ADD `total_pay_before` int NOT NULL DEFAULT 0', undefined);
        await queryRunner.query('ALTER TABLE `loans` ADD `total_pay_current` int NOT NULL DEFAULT 0', undefined);
        await queryRunner.query('ALTER TABLE `loans` DROP COLUMN `loan_date`', undefined);
        await queryRunner.query('ALTER TABLE `loans` ADD `loan_date` timestamp NULL', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `loans` DROP COLUMN `loan_date`', undefined);
        await queryRunner.query('ALTER TABLE `loans` ADD `loan_date` datetime NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `loans` DROP COLUMN `total_pay_current`', undefined);
        await queryRunner.query('ALTER TABLE `loans` DROP COLUMN `total_pay_before`', undefined);
        await queryRunner.query('ALTER TABLE `loans` DROP COLUMN `total_loan_current`', undefined);
        await queryRunner.query('ALTER TABLE `loans` DROP COLUMN `total_loan_before`', undefined);
    }

}
