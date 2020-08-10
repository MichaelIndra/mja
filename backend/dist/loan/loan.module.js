"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const loan_service_1 = require("./loan.service");
const loan_controller_1 = require("./loan.controller");
const typeorm_1 = require("@nestjs/typeorm");
const loan_entity_1 = require("./loan.entity");
const log_entity_1 = require("../log/log.entity");
const log_service_1 = require("../log/log.service");
const department_entity_1 = require("../department/department.entity");
const group_entity_1 = require("../department/group/group.entity");
const area_entity_1 = require("../department/area/area.entity");
const position_entity_1 = require("../department/area/position/position.entity");
const employee_entity_1 = require("../employee/employee.entity");
let LoanModule = class LoanModule {
};
LoanModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                loan_entity_1.Loan, employee_entity_1.Employee,
                department_entity_1.Department, group_entity_1.Group,
                area_entity_1.Area, position_entity_1.Position,
                log_entity_1.Log,
            ])],
        providers: [loan_service_1.LoanService, log_service_1.LogService],
        controllers: [loan_controller_1.LoanController],
    })
], LoanModule);
exports.LoanModule = LoanModule;
//# sourceMappingURL=loan.module.js.map