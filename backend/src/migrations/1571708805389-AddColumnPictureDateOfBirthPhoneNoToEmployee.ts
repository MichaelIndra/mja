import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddColumnPictureDateOfBirthPhoneNoToEmployee1571708805389 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `employees` ADD `picture` varchar(255) NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `employees` ADD `date_of_birth` varchar(255) NOT NULL', undefined);
        await queryRunner.query('ALTER TABLE `employees` ADD `phone_no` varchar(255) NOT NULL', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `employees` DROP COLUMN `phone_no`', undefined);
        await queryRunner.query('ALTER TABLE `employees` DROP COLUMN `date_of_birth`', undefined);
        await queryRunner.query('ALTER TABLE `employees` DROP COLUMN `picture`', undefined);
    }

}
