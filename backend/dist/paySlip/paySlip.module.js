"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const paySlip_service_1 = require("./paySlip.service");
const paySlip_controller_1 = require("./paySlip.controller");
const typeorm_1 = require("@nestjs/typeorm");
const paySlip_entity_1 = require("./paySlip.entity");
const department_entity_1 = require("../department/department.entity");
const group_entity_1 = require("../department/group/group.entity");
const area_entity_1 = require("../department/area/area.entity");
const position_entity_1 = require("../department/area/position/position.entity");
const log_entity_1 = require("../log/log.entity");
const log_service_1 = require("../log/log.service");
const loan_entity_1 = require("../loan/loan.entity");
let PaySlipModule = class PaySlipModule {
};
PaySlipModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                paySlip_entity_1.PaySlip,
                loan_entity_1.Loan,
                department_entity_1.Department, group_entity_1.Group,
                area_entity_1.Area, position_entity_1.Position,
                log_entity_1.Log,
            ])],
        providers: [paySlip_service_1.PaySlipService, log_service_1.LogService],
        controllers: [paySlip_controller_1.PaySlipController],
    })
], PaySlipModule);
exports.PaySlipModule = PaySlipModule;
//# sourceMappingURL=paySlip.module.js.map