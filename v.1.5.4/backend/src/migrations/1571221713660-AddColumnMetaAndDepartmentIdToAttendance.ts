import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnMetaAndDepartmentIdToAttendance1571221713660
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `attendances` ADD `department_id` varchar(255) NOT NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `attendances` ADD `meta` json NOT NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `attendances` ADD CONSTRAINT `FK_ed8db20d82e9c9f02094ccd4506` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `attendances` DROP FOREIGN KEY `FK_ed8db20d82e9c9f02094ccd4506`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `attendances` DROP COLUMN `meta`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `attendances` DROP COLUMN `department_id`',
      undefined,
    );
  }
}
