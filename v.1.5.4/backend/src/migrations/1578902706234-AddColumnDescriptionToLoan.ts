import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddColumnDescriptionToLoan1578902706234 implements MigrationInterface {
    name = 'AddColumnDescriptionToLoan1578902706234';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `loans` ADD `description` text NULL', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `loans` DROP COLUMN `description`', undefined);
    }

}
