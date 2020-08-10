import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUniqueDepartmentAndBranchName1572559196742
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'DROP INDEX `IDX_8681da666ad9699d568b3e9106` ON `departments`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `branchs` ADD UNIQUE INDEX `IDX_9553b92c0e363ae6c45f4e3125` (`name`)',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `branchs` DROP INDEX `IDX_9553b92c0e363ae6c45f4e3125`',
      undefined,
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_8681da666ad9699d568b3e9106` ON `departments` (`name`)',
      undefined,
    );
  }
}
