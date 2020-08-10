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
class AddDepartmentFieldOnOutcome1580724438676 {
    constructor() {
        this.name = 'AddDepartmentFieldOnOutcome1580724438676';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("CREATE TABLE `outcomes` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `employee_payslip` json NOT NULL, `created_by_id` varchar(255) NOT NULL, `department` text NULL, `start_at` timestamp NULL, `end_at` timestamp NULL, `nominal_per_period` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
            yield queryRunner.query("ALTER TABLE `outcomes` ADD CONSTRAINT `FK_074ca755d2cb94e50c17a346db5` FOREIGN KEY (`created_by_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("ALTER TABLE `outcomes` DROP FOREIGN KEY `FK_074ca755d2cb94e50c17a346db5`", undefined);
            yield queryRunner.query("DROP TABLE `outcomes`", undefined);
        });
    }
}
exports.AddDepartmentFieldOnOutcome1580724438676 = AddDepartmentFieldOnOutcome1580724438676;
//# sourceMappingURL=1580724438676-AddDepartmentFieldOnOutcome.js.map