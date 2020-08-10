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
class ChangeLoanScheme1578884646528 {
    constructor() {
        this.name = 'ChangeLoanScheme1578884646528';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `loans` ADD `total_loan_before` int NOT NULL DEFAULT 0', undefined);
            yield queryRunner.query('ALTER TABLE `loans` ADD `total_loan_current` int NOT NULL DEFAULT 0', undefined);
            yield queryRunner.query('ALTER TABLE `loans` ADD `total_pay_before` int NOT NULL DEFAULT 0', undefined);
            yield queryRunner.query('ALTER TABLE `loans` ADD `total_pay_current` int NOT NULL DEFAULT 0', undefined);
            yield queryRunner.query('ALTER TABLE `loans` DROP COLUMN `loan_date`', undefined);
            yield queryRunner.query('ALTER TABLE `loans` ADD `loan_date` timestamp NULL', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `loans` DROP COLUMN `loan_date`', undefined);
            yield queryRunner.query('ALTER TABLE `loans` ADD `loan_date` datetime NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `loans` DROP COLUMN `total_pay_current`', undefined);
            yield queryRunner.query('ALTER TABLE `loans` DROP COLUMN `total_pay_before`', undefined);
            yield queryRunner.query('ALTER TABLE `loans` DROP COLUMN `total_loan_current`', undefined);
            yield queryRunner.query('ALTER TABLE `loans` DROP COLUMN `total_loan_before`', undefined);
        });
    }
}
exports.ChangeLoanScheme1578884646528 = ChangeLoanScheme1578884646528;
//# sourceMappingURL=1578884646528-ChangeLoanScheme.js.map