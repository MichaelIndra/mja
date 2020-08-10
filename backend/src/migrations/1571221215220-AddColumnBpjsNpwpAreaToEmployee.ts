import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddColumnBpjsNpwpAreaToEmployee1571221215220 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `employees` ADD `area_id` varchar(255) NULL', undefined);
        await queryRunner.query('ALTER TABLE `employees` ADD `position_id` varchar(255) NULL', undefined);
        await queryRunner.query('ALTER TABLE `employees` ADD `bpjs_id` varchar(20) NULL', undefined);
        await queryRunner.query('ALTER TABLE `employees` ADD `npwp_id` varchar(20) NULL', undefined);
        await queryRunner.query('ALTER TABLE `employees` ADD CONSTRAINT `FK_37fe5168e0e0d65295042d47ea4` FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `employees` ADD CONSTRAINT `FK_8b14204e8af5e371e36b8c11e1b` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `employees` DROP FOREIGN KEY `FK_8b14204e8af5e371e36b8c11e1b`', undefined);
        await queryRunner.query('ALTER TABLE `employees` DROP FOREIGN KEY `FK_37fe5168e0e0d65295042d47ea4`', undefined);
        await queryRunner.query('ALTER TABLE `employees` DROP COLUMN `npwp_id`', undefined);
        await queryRunner.query('ALTER TABLE `employees` DROP COLUMN `bpjs_id`', undefined);
        await queryRunner.query('ALTER TABLE `employees` DROP COLUMN `position_id`', undefined);
        await queryRunner.query('ALTER TABLE `employees` DROP COLUMN `area_id`', undefined);
    }

}
