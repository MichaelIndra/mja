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
class DefineUniqueMultipleColumnInPayslips1581590022548 {
    constructor() {
        this.name = 'DefineUniqueMultipleColumnInPayslips1581590022548';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("CREATE UNIQUE INDEX `UQ_PAYSLIP_DATA` ON `payslips` (`start_at`, `end_at`, `employee_id`)", undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("DROP INDEX `UQ_PAYSLIP_DATA` ON `payslips`", undefined);
        });
    }
}
exports.DefineUniqueMultipleColumnInPayslips1581590022548 = DefineUniqueMultipleColumnInPayslips1581590022548;
//# sourceMappingURL=1581590022548-DefineUniqueMultipleColumnInPayslips.js.map