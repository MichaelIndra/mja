import {MigrationInterface, QueryRunner} from 'typeorm';

export class ChangeColumnPictureAndPhoneAsNullableEmployee1574758943644 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `logs` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `entity` varchar(20) NOT NULL, `action` varchar(20) NOT NULL, `account_id` varchar(255) NULL, `meta` json NULL, UNIQUE INDEX `IDX_874897ac4b6729a705ff40f126` (`entity`), UNIQUE INDEX `IDX_807abb1f01d751e24c2a5fda8e` (`action`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('ALTER TABLE `employees` CHANGE `picture` `picture` varchar(255) NULL', undefined);
        await queryRunner.query('ALTER TABLE `employees` CHANGE `phone_no` `phone_no` varchar(255) NULL', undefined);
        await queryRunner.query('ALTER TABLE `logs` ADD CONSTRAINT `FK_3753a0b8dbd27a5f75b31cca706` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `logs` DROP FOREIGN KEY `FK_3753a0b8dbd27a5f75b31cca706`', undefined);
        await queryRunner.query('ALTER TABLE `employees` CHANGE `phone_no` `phone_no` varchar(255) NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `employees` CHANGE `picture` `picture` varchar(255) NOT NULL', undefined);
        await queryRunner.query('DROP INDEX `IDX_807abb1f01d751e24c2a5fda8e` ON `logs`', undefined);
        await queryRunner.query('DROP INDEX `IDX_874897ac4b6729a705ff40f126` ON `logs`', undefined);
        await queryRunner.query('DROP TABLE `logs`', undefined);
    }

}
