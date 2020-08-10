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
class addRelationDepartmentOutcome1581081235886 {
    constructor() {
        this.name = 'addRelationDepartmentOutcome1581081235886';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("ALTER TABLE `outcomes` CHANGE `department` `department_id` text CHARACTER SET \"latin1\" COLLATE \"latin1_swedish_ci\" NULL", undefined);
            yield queryRunner.query("ALTER TABLE `outcomes` DROP COLUMN `department_id`", undefined);
            yield queryRunner.query("ALTER TABLE `outcomes` ADD `department_id` varchar(255) NULL", undefined);
            yield queryRunner.query("ALTER TABLE `outcomes` ADD CONSTRAINT `FK_f40c1bfd416789316a91209e3b0` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("ALTER TABLE `outcomes` DROP FOREIGN KEY `FK_f40c1bfd416789316a91209e3b0`", undefined);
            yield queryRunner.query("ALTER TABLE `outcomes` DROP COLUMN `department_id`", undefined);
            yield queryRunner.query("ALTER TABLE `outcomes` ADD `department_id` text CHARACTER SET \"latin1\" COLLATE \"latin1_swedish_ci\" NULL", undefined);
            yield queryRunner.query("ALTER TABLE `outcomes` CHANGE `department_id` `department` text CHARACTER SET \"latin1\" COLLATE \"latin1_swedish_ci\" NULL", undefined);
        });
    }
}
exports.addRelationDepartmentOutcome1581081235886 = addRelationDepartmentOutcome1581081235886;
//# sourceMappingURL=1581081235886-addRelationDepartmentOutcome.js.map