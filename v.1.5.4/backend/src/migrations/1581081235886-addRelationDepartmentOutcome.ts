import {MigrationInterface, QueryRunner} from "typeorm";

export class addRelationDepartmentOutcome1581081235886 implements MigrationInterface {
    name = 'addRelationDepartmentOutcome1581081235886'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `outcomes` CHANGE `department` `department_id` text CHARACTER SET \"latin1\" COLLATE \"latin1_swedish_ci\" NULL", undefined);
        await queryRunner.query("ALTER TABLE `outcomes` DROP COLUMN `department_id`", undefined);
        await queryRunner.query("ALTER TABLE `outcomes` ADD `department_id` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `outcomes` ADD CONSTRAINT `FK_f40c1bfd416789316a91209e3b0` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `outcomes` DROP FOREIGN KEY `FK_f40c1bfd416789316a91209e3b0`", undefined);
        await queryRunner.query("ALTER TABLE `outcomes` DROP COLUMN `department_id`", undefined);
        await queryRunner.query("ALTER TABLE `outcomes` ADD `department_id` text CHARACTER SET \"latin1\" COLLATE \"latin1_swedish_ci\" NULL", undefined);
        await queryRunner.query("ALTER TABLE `outcomes` CHANGE `department_id` `department` text CHARACTER SET \"latin1\" COLLATE \"latin1_swedish_ci\" NULL", undefined);
    }

}
