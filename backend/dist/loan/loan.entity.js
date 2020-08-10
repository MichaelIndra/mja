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
const account_entity_1 = require("../auth/account/account.entity");
const loan_enum_1 = require("./loan.enum");
const { CREATE, UPDATE } = crud_1.CrudValidationGroups;
let Loan = class Loan extends base_entity_1.BaseEntity {
    beforeInsert() {
        this.id = uuid.v4();
    }
};
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Loan.prototype, "employee_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => employee_entity_1.Employee, employee => employee.loans, {
        cascade: true,
        onDelete: 'NO ACTION',
    }),
    typeorm_1.JoinColumn({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Loan.prototype, "employee", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Loan.prototype, "created_by_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => account_entity_1.Account, account => account.loans, {
        cascade: true,
        onDelete: 'NO ACTION',
    }),
    typeorm_1.JoinColumn({ name: 'created_by_id' }),
    __metadata("design:type", account_entity_1.Account)
], Loan.prototype, "created_by", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ default: loan_enum_1.ELoanType.LOAN }),
    __metadata("design:type", String)
], Loan.prototype, "type", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Loan.prototype, "description", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: new Date() }),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsDateString({ always: true }),
    typeorm_1.Column({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Loan.prototype, "loan_date", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: 10000 }),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Loan.prototype, "nominal", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Loan.prototype, "total_loan_before", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Loan.prototype, "total_loan_current", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Loan.prototype, "total_pay_before", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Loan.prototype, "total_pay_current", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Loan.prototype, "beforeInsert", null);
Loan = __decorate([
    typeorm_1.Entity('loans')
], Loan);
exports.Loan = Loan;
//# sourceMappingURL=loan.entity.js.map