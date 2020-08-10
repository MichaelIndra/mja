import {MigrationInterface, QueryRunner} from 'typeorm';

export class Loan1576658432966 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `loans` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `employee_id` varchar(255) NOT NULL, `created_by_id` varchar(255) NOT NULL, `type` varchar(255) NOT NULL DEFAULT \'LOAN\', `loan_date` datetime NOT NULL, `nominal` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('ALTER TABLE `employees` CHANGE `date_of_birth` `date_of_birth` varchar(255) NULL', undefined);
        await queryRunner.query('ALTER TABLE `loans` ADD CONSTRAINT `FK_c283021e393bbf9f04c4656b292` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `loans` ADD CONSTRAINT `FK_eaf20bfa98c325636b41a2f9513` FOREIGN KEY (`created_by_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `loans` DROP FOREIGN KEY `FK_eaf20bfa98c325636b41a2f9513`', undefined);
        await queryRunner.query('ALTER TABLE `loans` DROP FOREIGN KEY `FK_c283021e393bbf9f04c4656b292`', undefined);
        await queryRunner.query('ALTER TABLE `employees` CHANGE `date_of_birth` `date_of_birth` varchar(255) NOT NULL', undefined);
        await queryRunner.query('DROP TABLE `loans`', undefined);
    }

}
