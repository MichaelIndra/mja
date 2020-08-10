"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("./attendance.service");
const attendance_controller_1 = require("./attendance.controller");
const typeorm_1 = require("@nestjs/typeorm");
const attendance_entity_1 = require("./attendance.entity");
const employee_service_1 = require("../employee/employee.service");
const employee_entity_1 = require("../employee/employee.entity");
const log_service_1 = require("../log/log.service");
const log_entity_1 = require("../log/log.entity");
const department_service_1 = require("../department/department.service");
const group_service_1 = require("../department/group/group.service");
const area_service_1 = require("../department/area/area.service");
const position_service_1 = require("../department/area/position/position.service");
const department_entity_1 = require("../department/department.entity");
const group_entity_1 = require("../department/group/group.entity");
const area_entity_1 = require("../department/area/area.entity");
const position_entity_1 = require("../department/area/position/position.entity");
const loan_entity_1 = require("../loan/loan.entity");
let AttendanceModule = class AttendanceModule {
};
AttendanceModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                attendance_entity_1.Attendance,
                employee_entity_1.Employee,
                department_entity_1.Department,
                group_entity_1.Group,
                area_entity_1.Area,
                position_entity_1.Position,
                log_entity_1.Log,
                loan_entity_1.Loan,
            ])],
        providers: [
            attendance_service_1.AttendanceService,
            employee_service_1.EmployeeService,
            department_service_1.DepartmentService,
            group_service_1.GroupService,
            area_service_1.AreaService,
            position_service_1.PositionService,
            log_service_1.LogService,
        ],
        controllers: [attendance_controller_1.AttendanceController],
    })
], AttendanceModule);
exports.AttendanceModule = AttendanceModule;
//# sourceMappingURL=attendance.module.js.map