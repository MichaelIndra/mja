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
const class_transformer_1 = require("class-transformer");
const position_entity_1 = require("./position/position.entity");
const employee_entity_1 = require("../../employee/employee.entity");
const { CREATE, UPDATE } = crud_1.CrudValidationGroups;
let Area = class Area extends base_entity_1.BaseEntity {
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
], Area.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional({ description: 'Bonus' }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: false }),
    typeorm_1.Column({ length: 15, nullable: true }),
    __metadata("design:type", String)
], Area.prototype, "bonus", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Area.prototype, "department_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => department_entity_1.Department, department => department.areas, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn({ name: 'department_id' }),
    __metadata("design:type", department_entity_1.Department)
], Area.prototype, "department", void 0);
__decorate([
    typeorm_1.OneToMany(() => position_entity_1.Position, position => position.area),
    class_transformer_1.Type(() => position_entity_1.Position),
    __metadata("design:type", Array)
], Area.prototype, "positions", void 0);
__decorate([
    typeorm_1.OneToMany(() => employee_entity_1.Employee, employee => employee.area),
    class_transformer_1.Type(() => employee_entity_1.Employee),
    __metadata("design:type", Array)
], Area.prototype, "employees", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Area.prototype, "beforeInsert", null);
Area = __decorate([
    typeorm_1.Entity('areas')
], Area);
exports.Area = Area;
//# sourceMappingURL=area.entity.js.map