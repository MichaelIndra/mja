import {MigrationInterface, QueryRunner} from "typeorm";

export class DefineUniqueMultipleColumnInPayslips1581590022548 implements MigrationInterface {
    name = 'DefineUniqueMultipleColumnInPayslips1581590022548'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE UNIQUE INDEX `UQ_PAYSLIP_DATA` ON `payslips` (`start_at`, `end_at`, `employee_id`)", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `UQ_PAYSLIP_DATA` ON `payslips`", undefined);
    }

}
