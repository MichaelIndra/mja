import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddColumnSwitchableToGroup1576655997195 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `groups` ADD `switchable` tinyint NOT NULL DEFAULT 0', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `groups` DROP COLUMN `switchable`', undefined);
    }

}
