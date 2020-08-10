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
const class_transformer_1 = require("class-transformer");
const department_entity_1 = require("../department/department.entity");
const account_entity_1 = require("../auth/account/account.entity");
const { CREATE, UPDATE } = crud_1.CrudValidationGroups;
let Branch = class Branch extends base_entity_1.BaseEntity {
    beforeInsert() {
        this.id = uuid.v4();
    }
};
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 50, unique: true }),
    __metadata("design:type", String)
], Branch.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "address", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 6, nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "postal_code", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 15, nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "telp", void 0);
__decorate([
    typeorm_1.OneToMany(() => department_entity_1.Department, department => department.branch),
    class_transformer_1.Type(() => department_entity_1.Department),
    __metadata("design:type", Array)
], Branch.prototype, "departments", void 0);
__decorate([
    typeorm_1.OneToMany(() => account_entity_1.Account, account => account.branch),
    class_transformer_1.Type(() => account_entity_1.Account),
    __metadata("design:type", Array)
], Branch.prototype, "accounts", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Branch.prototype, "beforeInsert", null);
Branch = __decorate([
    typeorm_1.Entity('branchs')
], Branch);
exports.Branch = Branch;
//# sourceMappingURL=branch.entity.js.map