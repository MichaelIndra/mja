import {MigrationInterface, QueryRunner} from 'typeorm';

export class DeleteColumnDateEntryFromEmployee1572852968259 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `employees` DROP COLUMN `date_entry`', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `employees` ADD `date_entry` datetime NOT NULL', undefined);
    }

}
