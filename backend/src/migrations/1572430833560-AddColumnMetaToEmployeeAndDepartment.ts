import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnMetaToEmployeeAndDepartment1572430833560
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `departments` ADD `meta` json NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `employees` ADD `meta` json NULL',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `employees` DROP COLUMN `meta`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `departments` DROP COLUMN `meta`',
      undefined,
    );
  }
}
