import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddColumnTokenResetPassword1576229740937 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `accounts` ADD `token_reset_password` varchar(255) NULL', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `accounts` DROP COLUMN `token_reset_password`', undefined);
    }

}
