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
const base_entity_1 = require("../../base.entity");
const uuid = require("uuid");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const crud_1 = require("@nestjsx/crud");
const class_transformer_1 = require("class-transformer");
const employee_entity_1 = require("../../employee/employee.entity");
const accountRole_entity_1 = require("../accountRole/accountRole.entity");
const accountPermission_entity_1 = require("../accountPermission/accountPermission.entity");
const encrypt_1 = require("../../utils/encrypt");
const branch_entity_1 = require("../../branch/branch.entity");
const paySlip_entity_1 = require("../../paySlip/paySlip.entity");
const log_entity_1 = require("../../log/log.entity");
const loan_entity_1 = require("../../loan/loan.entity");
const { CREATE, UPDATE } = crud_1.CrudValidationGroups;
let Account = class Account extends base_entity_1.BaseEntity {
    hashPassword() {
        this.password = encrypt_1.encryptPassword(this.password);
    }
    beforeInsert() {
        this.id = uuid.v4();
        this.email = this.email.toLowerCase();
        this.username = this.username.toLowerCase();
    }
};
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Account.prototype, "first_name", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "last_name", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "avatar", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Account.prototype, "username", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Account.prototype, "email", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "branch_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => branch_entity_1.Branch, branch => branch.accounts, {
        cascade: true,
        onDelete: 'SET NULL',
    }),
    typeorm_1.JoinColumn({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.Branch)
], Account.prototype, "branch", void 0);
__decorate([
    typeorm_1.OneToMany(() => employee_entity_1.Employee, employee => employee.account),
    class_transformer_1.Type(() => employee_entity_1.Employee),
    __metadata("design:type", Array)
], Account.prototype, "employees", void 0);
__decorate([
    typeorm_1.OneToMany(() => accountRole_entity_1.AccountRole, account_role => account_role.account),
    class_transformer_1.Type(() => accountRole_entity_1.AccountRole),
    __metadata("design:type", Array)
], Account.prototype, "account_roles", void 0);
__decorate([
    typeorm_1.OneToMany(() => accountPermission_entity_1.AccountPermission, account_permission => account_permission.account),
    class_transformer_1.Type(() => accountPermission_entity_1.AccountPermission),
    __metadata("design:type", Array)
], Account.prototype, "account_permissions", void 0);
__decorate([
    typeorm_1.OneToMany(() => paySlip_entity_1.PaySlip, payslip => payslip.created_by),
    class_transformer_1.Type(() => paySlip_entity_1.PaySlip),
    __metadata("design:type", Array)
], Account.prototype, "payslips", void 0);
__decorate([
    typeorm_1.OneToMany(() => log_entity_1.Log, log => log.account),
    class_transformer_1.Type(() => log_entity_1.Log),
    __metadata("design:type", Array)
], Account.prototype, "logs", void 0);
__decorate([
    typeorm_1.OneToMany(() => loan_entity_1.Loan, loan => loan.created_by),
    class_transformer_1.Type(() => loan_entity_1.Loan),
    __metadata("design:type", Array)
], Account.prototype, "loans", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Account.prototype, "hashPassword", null);
__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Account.prototype, "password", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "token_reset_password", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Account.prototype, "beforeInsert", null);
Account = __decorate([
    typeorm_1.Entity('accounts')
], Account);
exports.Account = Account;
//# sourceMappingURL=account.entity.js.map