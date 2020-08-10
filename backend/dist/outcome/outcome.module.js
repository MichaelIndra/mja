"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const outcome_controller_1 = require("./outcome.controller");
const outcome_service_1 = require("./outcome.service");
const outcome_entity_1 = require("./outcome.entity");
const department_entity_1 = require("../department/department.entity");
const department_service_1 = require("../department/department.service");
const employee_entity_1 = require("../employee/employee.entity");
let OutcomeModule = class OutcomeModule {
};
OutcomeModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([outcome_entity_1.Outcome, employee_entity_1.Employee, department_entity_1.Department])],
        providers: [outcome_service_1.OutcomeService, department_service_1.DepartmentService],
        controllers: [outcome_controller_1.OutcomeController],
    })
], OutcomeModule);
exports.OutcomeModule = OutcomeModule;
//# sourceMappingURL=outcome.module.js.map