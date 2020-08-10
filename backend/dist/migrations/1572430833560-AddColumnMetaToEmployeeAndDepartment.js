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
class AddColumnMetaToEmployeeAndDepartment1572430833560 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `departments` ADD `meta` json NULL', undefined);
            yield queryRunner.query('ALTER TABLE `employees` ADD `meta` json NULL', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `employees` DROP COLUMN `meta`', undefined);
            yield queryRunner.query('ALTER TABLE `departments` DROP COLUMN `meta`', undefined);
        });
    }
}
exports.AddColumnMetaToEmployeeAndDepartment1572430833560 = AddColumnMetaToEmployeeAndDepartment1572430833560;
//# sourceMappingURL=1572430833560-AddColumnMetaToEmployeeAndDepartment.js.map