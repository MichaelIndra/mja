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
class AddColumnBpjsNpwpAreaToEmployee1571221215220 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `employees` ADD `area_id` varchar(255) NULL', undefined);
            yield queryRunner.query('ALTER TABLE `employees` ADD `position_id` varchar(255) NULL', undefined);
            yield queryRunner.query('ALTER TABLE `employees` ADD `bpjs_id` varchar(20) NULL', undefined);
            yield queryRunner.query('ALTER TABLE `employees` ADD `npwp_id` varchar(20) NULL', undefined);
            yield queryRunner.query('ALTER TABLE `employees` ADD CONSTRAINT `FK_37fe5168e0e0d65295042d47ea4` FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
            yield queryRunner.query('ALTER TABLE `employees` ADD CONSTRAINT `FK_8b14204e8af5e371e36b8c11e1b` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `employees` DROP FOREIGN KEY `FK_8b14204e8af5e371e36b8c11e1b`', undefined);
            yield queryRunner.query('ALTER TABLE `employees` DROP FOREIGN KEY `FK_37fe5168e0e0d65295042d47ea4`', undefined);
            yield queryRunner.query('ALTER TABLE `employees` DROP COLUMN `npwp_id`', undefined);
            yield queryRunner.query('ALTER TABLE `employees` DROP COLUMN `bpjs_id`', undefined);
            yield queryRunner.query('ALTER TABLE `employees` DROP COLUMN `position_id`', undefined);
            yield queryRunner.query('ALTER TABLE `employees` DROP COLUMN `area_id`', undefined);
        });
    }
}
exports.AddColumnBpjsNpwpAreaToEmployee1571221215220 = AddColumnBpjsNpwpAreaToEmployee1571221215220;
//# sourceMappingURL=1571221215220-AddColumnBpjsNpwpAreaToEmployee.js.map