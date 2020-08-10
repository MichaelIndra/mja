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
const base_entity_1 = require("../../base.entity");
const uuid = require("uuid");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const rolePermission_entity_1 = require("../../auth/rolePermission/rolePermission.entity");
const accountRole_entity_1 = require("../../auth/accountRole/accountRole.entity");
const { CREATE, UPDATE } = crud_1.CrudValidationGroups;
let Role = class Role extends base_entity_1.BaseEntity {
    beforeInsert() {
        this.id = uuid.v4();
    }
};
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "description", void 0);
__decorate([
    typeorm_1.OneToMany(() => rolePermission_entity_1.RolePermission, role_permission => role_permission.role),
    class_transformer_1.Type(() => rolePermission_entity_1.RolePermission),
    __metadata("design:type", Array)
], Role.prototype, "role_permissions", void 0);
__decorate([
    typeorm_1.OneToMany(() => accountRole_entity_1.AccountRole, account_role => account_role.role),
    class_transformer_1.Type(() => accountRole_entity_1.AccountRole),
    __metadata("design:type", Array)
], Role.prototype, "account_roles", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Role.prototype, "beforeInsert", null);
Role = __decorate([
    typeorm_1.Entity('roles')
], Role);
exports.Role = Role;
//# sourceMappingURL=role.entity.js.map