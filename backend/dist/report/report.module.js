"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const report_service_1 = require("./report.service");
const report_controller_1 = require("./report.controller");
const typeorm_1 = require("@nestjs/typeorm");
const paySlip_entity_1 = require("../paySlip/paySlip.entity");
const attendance_entity_1 = require("../attendance/attendance.entity");
const outcome_entity_1 = require("../outcome/outcome.entity");
let ReportModule = class ReportModule {
};
ReportModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([paySlip_entity_1.PaySlip, attendance_entity_1.Attendance, outcome_entity_1.Outcome])],
        providers: [report_service_1.ReportService],
        controllers: [report_controller_1.ReportController],
    })
], ReportModule);
exports.ReportModule = ReportModule;
//# sourceMappingURL=report.module.js.map