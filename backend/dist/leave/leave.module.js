"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const leave_service_1 = require("./leave.service");
const leave_controller_1 = require("./leave.controller");
const typeorm_1 = require("@nestjs/typeorm");
const leave_entity_1 = require("./leave.entity");
let LeaveModule = class LeaveModule {
};
LeaveModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([leave_entity_1.Leave])],
        providers: [leave_service_1.LeaveService],
        controllers: [leave_controller_1.LeaveController],
    })
], LeaveModule);
exports.LeaveModule = LeaveModule;
//# sourceMappingURL=leave.module.js.map