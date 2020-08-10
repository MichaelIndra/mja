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
const account_entity_1 = require("../account/account.entity");
const role_entity_1 = require("../role/role.entity");
const { CREATE, UPDATE } = crud_1.CrudValidationGroups;
let AccountRole = class AccountRole extends base_entity_1.BaseEntity {
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
], AccountRole.prototype, "account_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => account_entity_1.Account, account => account.account_roles, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn({ name: 'account_id' }),
    __metadata("design:type", account_entity_1.Account)
], AccountRole.prototype, "account", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], AccountRole.prototype, "role_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => role_entity_1.Role, role => role.account_roles, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn({ name: 'role_id' }),
    __metadata("design:type", role_entity_1.Role)
], AccountRole.prototype, "role", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccountRole.prototype, "beforeInsert", null);
AccountRole = __decorate([
    typeorm_1.Entity('account_roles')
], AccountRole);
exports.AccountRole = AccountRole;
//# sourceMappingURL=accountRole.entity.js.map