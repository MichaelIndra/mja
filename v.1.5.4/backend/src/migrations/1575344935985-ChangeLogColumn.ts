import {MigrationInterface, QueryRunner} from 'typeorm';

export class ChangeLogColumn1575344935985 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP INDEX `IDX_874897ac4b6729a705ff40f126` ON `logs`', undefined);
        await queryRunner.query('DROP INDEX `IDX_807abb1f01d751e24c2a5fda8e` ON `logs`', undefined);
        await queryRunner.query('ALTER TABLE `logs` CHANGE `entity` `entity` varchar(50) NOT NULL', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `logs` CHANGE `entity` `entity` varchar(20) NOT NULL', undefined);
        await queryRunner.query('CREATE UNIQUE INDEX `IDX_807abb1f01d751e24c2a5fda8e` ON `logs` (`action`)', undefined);
        await queryRunner.query('CREATE UNIQUE INDEX `IDX_874897ac4b6729a705ff40f126` ON `logs` (`entity`)', undefined);
    }

}
