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
class AddColumnPictureDateOfBirthPhoneNoToEmployee1571708805389 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `employees` ADD `picture` varchar(255) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `employees` ADD `date_of_birth` varchar(255) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `employees` ADD `phone_no` varchar(255) NOT NULL', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `employees` DROP COLUMN `phone_no`', undefined);
            yield queryRunner.query('ALTER TABLE `employees` DROP COLUMN `date_of_birth`', undefined);
            yield queryRunner.query('ALTER TABLE `employees` DROP COLUMN `picture`', undefined);
        });
    }
}
exports.AddColumnPictureDateOfBirthPhoneNoToEmployee1571708805389 = AddColumnPictureDateOfBirthPhoneNoToEmployee1571708805389;
//# sourceMappingURL=1571708805389-AddColumnPictureDateOfBirthPhoneNoToEmployee.js.map