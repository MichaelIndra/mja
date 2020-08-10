"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base.entity");
const uuid = require("uuid");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const employee_entity_1 = require("../employee/employee.entity");
let Attendance = class Attendance extends base_entity_1.BaseEntity {
    beforeInsert() {
        this.id = uuid.v4();
    }
};
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Attendance.prototype, "employee_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => employee_entity_1.Employee, employee => employee.attendances, {
        cascade: true,
        onDelete: 'NO ACTION',
    }),
    typeorm_1.JoinColumn({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Attendance.prototype, "employee", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: new Date() }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsDateString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Attendance.prototype, "time_check_in", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: new Date() }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsDateString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Attendance.prototype, "time_check_out", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: new Date() }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsDateString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Attendance.prototype, "time_check_out_for_break", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: new Date() }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsDateString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Attendance.prototype, "time_check_in_for_break", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    typeorm_1.Column({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Attendance.prototype, "meta", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Attendance.prototype, "beforeInsert", null);
Attendance = __decorate([
    typeorm_1.Entity('attendances')
], Attendance);
exports.Attendance = Attendance;
//# sourceMappingURL=attendance.entity.js.map