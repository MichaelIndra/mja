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
class AddColumnMetaAndDepartmentIdToAttendance1571221713660 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `attendances` ADD `department_id` varchar(255) NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `attendances` ADD `meta` json NOT NULL', undefined);
            yield queryRunner.query('ALTER TABLE `attendances` ADD CONSTRAINT `FK_ed8db20d82e9c9f02094ccd4506` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `attendances` DROP FOREIGN KEY `FK_ed8db20d82e9c9f02094ccd4506`', undefined);
            yield queryRunner.query('ALTER TABLE `attendances` DROP COLUMN `meta`', undefined);
            yield queryRunner.query('ALTER TABLE `attendances` DROP COLUMN `department_id`', undefined);
        });
    }
}
exports.AddColumnMetaAndDepartmentIdToAttendance1571221713660 = AddColumnMetaAndDepartmentIdToAttendance1571221713660;
//# sourceMappingURL=1571221713660-AddColumnMetaAndDepartmentIdToAttendance.js.map