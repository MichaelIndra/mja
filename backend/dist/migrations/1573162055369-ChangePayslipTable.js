"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class ChangePayslipTable1573162055369 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `day_salary`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `report_date`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `deduction`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `reward`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `meta`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `start_at` datetime NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `end_at` datetime NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `print_at` datetime NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `employee_meta` json NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `total_day` varchar(15) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `daily_base_salary` varchar(15) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `total_base_daily` varchar(15) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `total_base` varchar(15) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `total_reward` varchar(15) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `total_deduction` varchar(15) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `total` varchar(15) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `payslip_meta` json NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `created_by_id` varchar(50) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `account_id` varchar(255) NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD CONSTRAINT `FK_0a5fec177873e44b64f26fc2e34` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `payslips` DROP FOREIGN KEY `FK_0a5fec177873e44b64f26fc2e34`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `account_id`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `created_by_id`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `payslip_meta`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `total`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `total_deduction`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `total_reward`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `total_base`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `total_base_daily`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `daily_base_salary`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `total_day`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `employee_meta`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `print_at`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `end_at`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` DROP COLUMN `start_at`', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `meta` json NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `reward` json NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `deduction` json NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `report_date` varchar(20) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `payslips` ADD `day_salary` varchar(15) NOT NULL', undefined);
        });
    }
}
exports.ChangePayslipTable1573162055369 = ChangePayslipTable1573162055369;
//# sourceMappingURL=1573162055369-ChangePayslipTable.js.map