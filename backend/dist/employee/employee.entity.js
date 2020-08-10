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
const crud_1 = require("@nestjsx/crud");
const base_entity_1 = require("../base.entity");
const uuid = require("uuid");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const department_entity_1 = require("../department/department.entity");
const class_transformer_1 = require("class-transformer");
const attendance_entity_1 = require("../attendance/attendance.entity");
const paySlip_entity_1 = require("../paySlip/paySlip.entity");
const leave_entity_1 = require("../leave/leave.entity");
const rewardDeduction_entity_1 = require("../rewardDeduction/rewardDeduction.entity");
const account_entity_1 = require("../auth/account/account.entity");
const group_entity_1 = require("../department/group/group.entity");
const position_entity_1 = require("../department/area/position/position.entity");
const area_entity_1 = require("../department/area/area.entity");
const employee_enum_1 = require("./employee.enum");
const loan_entity_1 = require("../loan/loan.entity");
const { CREATE, UPDATE } = crud_1.CrudValidationGroups;
let Employee = class Employee extends base_entity_1.BaseEntity {
    beforeInsert() {
        this.id = uuid.v4();
    }
};
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 20, unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "nik", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], Employee.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional({
        description: `Available type : [ ${Object.values(employee_enum_1.EnumEmployeeStatus).join(',')} ]`,
        nullable: true,
        example: employee_enum_1.EnumEmployeeStatus.REGULER,
    }),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ length: 50, default: employee_enum_1.EnumEmployeeStatus.REGULER }),
    __metadata("design:type", String)
], Employee.prototype, "status", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "address", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: false }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsBoolean({ always: true }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Employee.prototype, "active", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: new Date() }),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsDateString({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Employee.prototype, "active_date", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "department_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => department_entity_1.Department, department => department.employees, {
        cascade: true,
        onDelete: 'SET NULL',
    }),
    typeorm_1.JoinColumn({ name: 'department_id' }),
    __metadata("design:type", department_entity_1.Department)
], Employee.prototype, "department", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "group_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => group_entity_1.Group, group => group.employees, {
        cascade: true,
        onDelete: 'SET NULL',
    }),
    typeorm_1.JoinColumn({ name: 'group_id' }),
    __metadata("design:type", group_entity_1.Group)
], Employee.prototype, "group", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "area_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => area_entity_1.Area, area => area.employees, {
        cascade: true,
        onDelete: 'SET NULL',
    }),
    typeorm_1.JoinColumn({ name: 'area_id' }),
    __metadata("design:type", area_entity_1.Area)
], Employee.prototype, "area", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "position_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => position_entity_1.Position, position => position.employees, {
        cascade: true,
        onDelete: 'SET NULL',
    }),
    typeorm_1.JoinColumn({ name: 'position_id' }),
    __metadata("design:type", position_entity_1.Position)
], Employee.prototype, "position", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "created_by", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "picture", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "date_of_birth", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "phone_no", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "bpjs_id", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "npwp_id", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Employee.prototype, "meta", void 0);
__decorate([
    typeorm_1.ManyToOne(() => account_entity_1.Account, account => account.employees, {
        cascade: true,
        onDelete: 'NO ACTION',
    }),
    typeorm_1.JoinColumn({ name: 'created_by' }),
    __metadata("design:type", account_entity_1.Account)
], Employee.prototype, "account", void 0);
__decorate([
    typeorm_1.OneToMany(() => paySlip_entity_1.PaySlip, payslip => payslip.employee),
    class_transformer_1.Type(() => paySlip_entity_1.PaySlip),
    __metadata("design:type", Array)
], Employee.prototype, "payslips", void 0);
__decorate([
    typeorm_1.OneToMany(() => leave_entity_1.Leave, leave => leave.employee),
    class_transformer_1.Type(() => leave_entity_1.Leave),
    __metadata("design:type", Array)
], Employee.prototype, "leaves", void 0);
__decorate([
    typeorm_1.OneToMany(() => loan_entity_1.Loan, loan => loan.employee),
    class_transformer_1.Type(() => loan_entity_1.Loan),
    __metadata("design:type", Array)
], Employee.prototype, "loans", void 0);
__decorate([
    typeorm_1.OneToMany(() => rewardDeduction_entity_1.RewardDeduction, rewardDeduction => rewardDeduction.employee),
    class_transformer_1.Type(() => rewardDeduction_entity_1.RewardDeduction),
    __metadata("design:type", Array)
], Employee.prototype, "reward_deductions", void 0);
__decorate([
    typeorm_1.OneToMany(() => attendance_entity_1.Attendance, attendance => attendance.employee),
    class_transformer_1.Type(() => attendance_entity_1.Attendance),
    __metadata("design:type", Array)
], Employee.prototype, "attendances", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Employee.prototype, "beforeInsert", null);
Employee = __decorate([
    typeorm_1.Entity('employees')
], Employee);
exports.Employee = Employee;
//# sourceMappingURL=employee.entity.js.map