import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDepartmentFieldOnOutcome1580724438676 implements MigrationInterface {
    name = 'AddDepartmentFieldOnOutcome1580724438676'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `outcomes` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `employee_payslip` json NOT NULL, `created_by_id` varchar(255) NOT NULL, `department` text NULL, `start_at` timestamp NULL, `end_at` timestamp NULL, `nominal_per_period` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `outcomes` ADD CONSTRAINT `FK_074ca755d2cb94e50c17a346db5` FOREIGN KEY (`created_by_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `outcomes` DROP FOREIGN KEY `FK_074ca755d2cb94e50c17a346db5`", undefined);
        await queryRunner.query("DROP TABLE `outcomes`", undefined);
    }

}
