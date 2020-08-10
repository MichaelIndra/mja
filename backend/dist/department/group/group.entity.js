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
const department_entity_1 = require("../department.entity");
const employee_entity_1 = require("../../employee/employee.entity");
const class_transformer_1 = require("class-transformer");
const { CREATE, UPDATE } = crud_1.CrudValidationGroups;
let Group = class Group extends base_entity_1.BaseEntity {
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
], Group.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional({ description: 'Monthly Salary' }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: false }),
    typeorm_1.Column({ length: 15, nullable: true }),
    __metadata("design:type", String)
], Group.prototype, "base_salary", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional({ description: 'Weekly Salary' }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: false }),
    typeorm_1.Column({ length: 15, nullable: true }),
    __metadata("design:type", String)
], Group.prototype, "week_salary", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional({ description: 'Daily Salary' }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 15, nullable: true }),
    __metadata("design:type", String)
], Group.prototype, "day_salary", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ type: 'json' }),
    __metadata("design:type", Object)
], Group.prototype, "schedule", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Group.prototype, "department_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => department_entity_1.Department, department => department.groups, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn({ name: 'department_id' }),
    __metadata("design:type", department_entity_1.Department)
], Group.prototype, "department", void 0);
__decorate([
    typeorm_1.OneToMany(() => employee_entity_1.Employee, employee => employee.group),
    class_transformer_1.Type(() => employee_entity_1.Employee),
    __metadata("design:type", Array)
], Group.prototype, "employees", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional({ example: false }),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Group.prototype, "switchable", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Group.prototype, "beforeInsert", null);
Group = __decorate([
    typeorm_1.Entity('groups')
], Group);
exports.Group = Group;
//# sourceMappingURL=group.entity.js.map