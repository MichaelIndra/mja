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
const base_entity_1 = require("../../../base.entity");
const uuid = require("uuid");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const area_entity_1 = require("../area.entity");
const class_transformer_1 = require("class-transformer");
const employee_entity_1 = require("../../../employee/employee.entity");
const { CREATE, UPDATE } = crud_1.CrudValidationGroups;
let Position = class Position extends base_entity_1.BaseEntity {
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
], Position.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional({ description: 'Bonus' }),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: false }),
    typeorm_1.Column({ length: 15, nullable: true }),
    __metadata("design:type", String)
], Position.prototype, "bonus", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Position.prototype, "area_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => area_entity_1.Area, area => area.positions, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn({ name: 'area_id' }),
    __metadata("design:type", area_entity_1.Area)
], Position.prototype, "area", void 0);
__decorate([
    typeorm_1.OneToMany(() => employee_entity_1.Employee, employee => employee.area),
    class_transformer_1.Type(() => employee_entity_1.Employee),
    __metadata("design:type", Array)
], Position.prototype, "employees", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Position.prototype, "beforeInsert", null);
Position = __decorate([
    typeorm_1.Entity('positions')
], Position);
exports.Position = Position;
//# sourceMappingURL=position.entity.js.map