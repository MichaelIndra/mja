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
const employee_entity_1 = require("../employee/employee.entity");
const paySlip_dto_1 = require("./paySlip.dto");
const account_entity_1 = require("../auth/account/account.entity");
const { CREATE, UPDATE } = crud_1.CrudValidationGroups;
let PaySlip = class PaySlip extends base_entity_1.BaseEntity {
    beforeInsert() {
        this.id = uuid.v4();
    }
};
__decorate([
    swagger_1.ApiModelProperty({ example: new Date() }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsDateString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", Date)
], PaySlip.prototype, "start_at", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: new Date() }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsDateString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", Date)
], PaySlip.prototype, "end_at", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: new Date() }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsDateString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", Date)
], PaySlip.prototype, "print_at", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], PaySlip.prototype, "employee_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => employee_entity_1.Employee, employee => employee.payslips, {
        cascade: true,
        onDelete: 'NO ACTION',
    }),
    typeorm_1.JoinColumn({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], PaySlip.prototype, "employee", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    typeorm_1.Column({ type: 'json' }),
    __metadata("design:type", Object)
], PaySlip.prototype, "employee_meta", void 0);
__decorate([
    swagger_1.ApiModelProperty({ description: 'UMR' }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 15 }),
    __metadata("design:type", String)
], PaySlip.prototype, "base_salary", void 0);
__decorate([
    swagger_1.ApiModelProperty({ description: 'Total max work days in one month' }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 15 }),
    __metadata("design:type", String)
], PaySlip.prototype, "total_day", void 0);
__decorate([
    swagger_1.ApiModelProperty({ description: 'Gaji Pokok per hari' }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 15 }),
    __metadata("design:type", String)
], PaySlip.prototype, "daily_base_salary", void 0);
__decorate([
    swagger_1.ApiModelProperty({ description: 'Upah 1 hari' }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 15 }),
    __metadata("design:type", String)
], PaySlip.prototype, "total_base_daily", void 0);
__decorate([
    swagger_1.ApiModelProperty({ description: 'Upah 1 hari x total_day' }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 15 }),
    __metadata("design:type", String)
], PaySlip.prototype, "total_base", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 15 }),
    __metadata("design:type", String)
], PaySlip.prototype, "total_reward", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 15 }),
    __metadata("design:type", String)
], PaySlip.prototype, "total_deduction", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 15 }),
    __metadata("design:type", String)
], PaySlip.prototype, "total", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsNotEmpty({ always: true }),
    typeorm_1.Column({ type: 'json' }),
    __metadata("design:type", paySlip_dto_1.MetaPayslip)
], PaySlip.prototype, "payslip_meta", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], PaySlip.prototype, "created_by_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => account_entity_1.Account, account => account.payslips, {
        cascade: true,
        onDelete: 'NO ACTION',
    }),
    typeorm_1.JoinColumn({ name: 'account_id' }),
    __metadata("design:type", account_entity_1.Account)
], PaySlip.prototype, "created_by", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaySlip.prototype, "beforeInsert", null);
PaySlip = __decorate([
    typeorm_1.Entity('payslips'),
    typeorm_1.Unique('UQ_PAYSLIP_DATA', ['start_at', 'end_at', 'employee_id'])
], PaySlip);
exports.PaySlip = PaySlip;
//# sourceMappingURL=paySlip.entity.js.map