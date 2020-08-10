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
const employee_entity_1 = require("../employee/employee.entity");
const group_entity_1 = require("./group/group.entity");
const area_entity_1 = require("./area/area.entity");
const branch_entity_1 = require("../branch/branch.entity");
const outcome_entity_1 = require("../outcome/outcome.entity");
const { CREATE, UPDATE } = crud_1.CrudValidationGroups;
let Department = class Department extends base_entity_1.BaseEntity {
    beforeInsert() {
        this.id = uuid.v4();
    }
};
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsOptional({ groups: [UPDATE] }),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], Department.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Department.prototype, "branch_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => branch_entity_1.Branch, branch => branch.departments, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.Branch)
], Department.prototype, "branch", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Department.prototype, "meta", void 0);
__decorate([
    typeorm_1.OneToMany(() => employee_entity_1.Employee, employee => employee.department),
    class_transformer_1.Type(() => employee_entity_1.Employee),
    __metadata("design:type", Array)
], Department.prototype, "employees", void 0);
__decorate([
    typeorm_1.OneToMany(() => outcome_entity_1.Outcome, outcome => outcome.department),
    class_transformer_1.Type(() => outcome_entity_1.Outcome),
    __metadata("design:type", Array)
], Department.prototype, "outcomes", void 0);
__decorate([
    typeorm_1.OneToMany(() => group_entity_1.Group, group => group.department),
    class_transformer_1.Type(() => group_entity_1.Group),
    __metadata("design:type", Array)
], Department.prototype, "groups", void 0);
__decorate([
    typeorm_1.OneToMany(() => area_entity_1.Area, area => area.department),
    class_transformer_1.Type(() => area_entity_1.Area),
    __metadata("design:type", Array)
], Department.prototype, "areas", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Department.prototype, "beforeInsert", null);
Department = __decorate([
    typeorm_1.Entity('departments')
], Department);
exports.Department = Department;
//# sourceMappingURL=department.entity.js.map