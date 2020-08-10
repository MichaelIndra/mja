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
const role_entity_1 = require("../../auth/role/role.entity");
const permission_entity_1 = require("../../auth/permission/permission.entity");
const { CREATE, UPDATE } = crud_1.CrudValidationGroups;
let RolePermission = class RolePermission extends base_entity_1.BaseEntity {
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
], RolePermission.prototype, "role_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => role_entity_1.Role, role => role.role_permissions, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn({ name: 'role_id' }),
    __metadata("design:type", role_entity_1.Role)
], RolePermission.prototype, "role", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], RolePermission.prototype, "permission_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => permission_entity_1.Permission, permission => permission.role_permissions, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn({ name: 'permission_id' }),
    __metadata("design:type", permission_entity_1.Permission)
], RolePermission.prototype, "permission", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolePermission.prototype, "beforeInsert", null);
RolePermission = __decorate([
    typeorm_1.Entity('role_permissions')
], RolePermission);
exports.RolePermission = RolePermission;
//# sourceMappingURL=rolePermission.entity.js.map