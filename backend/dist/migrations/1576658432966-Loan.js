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
class Loan1576658432966 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('CREATE TABLE `loans` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `employee_id` varchar(255) NOT NULL, `created_by_id` varchar(255) NOT NULL, `type` varchar(255) NOT NULL DEFAULT \'LOAN\', `loan_date` datetime NOT NULL, `nominal` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
            yield queryRunner.query('ALTER TABLE `employees` CHANGE `date_of_birth` `date_of_birth` varchar(255) NULL', undefined);
            yield queryRunner.query('ALTER TABLE `loans` ADD CONSTRAINT `FK_c283021e393bbf9f04c4656b292` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
            yield queryRunner.query('ALTER TABLE `loans` ADD CONSTRAINT `FK_eaf20bfa98c325636b41a2f9513` FOREIGN KEY (`created_by_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `loans` DROP FOREIGN KEY `FK_eaf20bfa98c325636b41a2f9513`', undefined);
            yield queryRunner.query('ALTER TABLE `loans` DROP FOREIGN KEY `FK_c283021e393bbf9f04c4656b292`', undefined);
            yield queryRunner.query('ALTER TABLE `employees` CHANGE `date_of_birth` `date_of_birth` varchar(255) NOT NULL', undefined);
            yield queryRunner.query('DROP TABLE `loans`', undefined);
        });
    }
}
exports.Loan1576658432966 = Loan1576658432966;
//# sourceMappingURL=1576658432966-Loan.js.map