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
class InitBranch1571641196163 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('CREATE TABLE `branchs` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(50) NOT NULL, `address` text NULL, `postal_code` varchar(6) NULL, `telp` varchar(15) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
            yield queryRunner.query('ALTER TABLE `accounts` ADD `branch_id` varchar(255) NULL', undefined);
            yield queryRunner.query('ALTER TABLE `departments` ADD `branch_id` varchar(255) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `accounts` ADD CONSTRAINT `FK_3ab689e515e134445a81873f87b` FOREIGN KEY (`branch_id`) REFERENCES `branchs`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
            yield queryRunner.query('ALTER TABLE `departments` ADD CONSTRAINT `FK_40b8818a0e3324c859199265503` FOREIGN KEY (`branch_id`) REFERENCES `branchs`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `departments` DROP FOREIGN KEY `FK_40b8818a0e3324c859199265503`', undefined);
            yield queryRunner.query('ALTER TABLE `accounts` DROP FOREIGN KEY `FK_3ab689e515e134445a81873f87b`', undefined);
            yield queryRunner.query('ALTER TABLE `departments` DROP COLUMN `branch_id`', undefined);
            yield queryRunner.query('ALTER TABLE `accounts` DROP COLUMN `branch_id`', undefined);
            yield queryRunner.query('DROP TABLE `branchs`', undefined);
        });
    }
}
exports.InitBranch1571641196163 = InitBranch1571641196163;
//# sourceMappingURL=1571641196163-InitBranch.js.map