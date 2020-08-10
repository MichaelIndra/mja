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
class ChangeColumnPictureAndPhoneAsNullableEmployee1574758943644 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('CREATE TABLE `logs` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `entity` varchar(20) NOT NULL, `action` varchar(20) NOT NULL, `account_id` varchar(255) NULL, `meta` json NULL, UNIQUE INDEX `IDX_874897ac4b6729a705ff40f126` (`entity`), UNIQUE INDEX `IDX_807abb1f01d751e24c2a5fda8e` (`action`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
            yield queryRunner.query('ALTER TABLE `employees` CHANGE `picture` `picture` varchar(255) NULL', undefined);
            yield queryRunner.query('ALTER TABLE `employees` CHANGE `phone_no` `phone_no` varchar(255) NULL', undefined);
            yield queryRunner.query('ALTER TABLE `logs` ADD CONSTRAINT `FK_3753a0b8dbd27a5f75b31cca706` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `logs` DROP FOREIGN KEY `FK_3753a0b8dbd27a5f75b31cca706`', undefined);
            yield queryRunner.query('ALTER TABLE `employees` CHANGE `phone_no` `phone_no` varchar(255) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `employees` CHANGE `picture` `picture` varchar(255) NOT NULL', undefined);
            yield queryRunner.query('DROP INDEX `IDX_807abb1f01d751e24c2a5fda8e` ON `logs`', undefined);
            yield queryRunner.query('DROP INDEX `IDX_874897ac4b6729a705ff40f126` ON `logs`', undefined);
            yield queryRunner.query('DROP TABLE `logs`', undefined);
        });
    }
}
exports.ChangeColumnPictureAndPhoneAsNullableEmployee1574758943644 = ChangeColumnPictureAndPhoneAsNullableEmployee1574758943644;
//# sourceMappingURL=1574758943644-ChangeColumnPictureAndPhoneAsNullableEmployee.js.map