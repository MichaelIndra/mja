"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const department_service_1 = require("./department.service");
const department_controller_1 = require("./department.controller");
const typeorm_1 = require("@nestjs/typeorm");
const department_entity_1 = require("./department.entity");
const group_service_1 = require("./group/group.service");
const group_entity_1 = require("./group/group.entity");
const group_controller_1 = require("./group/group.controller");
const area_entity_1 = require("./area/area.entity");
const position_entity_1 = require("./area/position/position.entity");
const area_service_1 = require("./area/area.service");
const position_service_1 = require("./area/position/position.service");
const area_controller_1 = require("./area/area.controller");
const position_controller_1 = require("./area/position/position.controller");
const log_entity_1 = require("../log/log.entity");
const log_service_1 = require("../log/log.service");
const employee_entity_1 = require("../employee/employee.entity");
let DepartmentModule = class DepartmentModule {
};
DepartmentModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([department_entity_1.Department, employee_entity_1.Employee, group_entity_1.Group, area_entity_1.Area, position_entity_1.Position, log_entity_1.Log])],
        providers: [department_service_1.DepartmentService, group_service_1.GroupService, area_service_1.AreaService, position_service_1.PositionService, log_service_1.LogService],
        controllers: [
            department_controller_1.DepartmentController,
            group_controller_1.GroupController,
            area_controller_1.AreaController,
            position_controller_1.PositionController,
        ],
    })
], DepartmentModule);
exports.DepartmentModule = DepartmentModule;
//# sourceMappingURL=department.module.js.map