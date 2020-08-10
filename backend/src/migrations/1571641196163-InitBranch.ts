import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitBranch1571641196163 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `branchs` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(50) NOT NULL, `address` text NULL, `postal_code` varchar(6) NULL, `telp` varchar(15) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `accounts` ADD `branch_id` varchar(255) NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `departments` ADD `branch_id` varchar(255) NOT NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `accounts` ADD CONSTRAINT `FK_3ab689e515e134445a81873f87b` FOREIGN KEY (`branch_id`) REFERENCES `branchs`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `departments` ADD CONSTRAINT `FK_40b8818a0e3324c859199265503` FOREIGN KEY (`branch_id`) REFERENCES `branchs`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `departments` DROP FOREIGN KEY `FK_40b8818a0e3324c859199265503`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `accounts` DROP FOREIGN KEY `FK_3ab689e515e134445a81873f87b`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `departments` DROP COLUMN `branch_id`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `accounts` DROP COLUMN `branch_id`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `branchs`', undefined);
  }
}
