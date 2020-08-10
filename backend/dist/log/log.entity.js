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
const account_entity_1 = require("../auth/account/account.entity");
const log_meta_1 = require("./log.meta");
const { CREATE } = crud_1.CrudValidationGroups;
let Log = class Log extends base_entity_1.BaseEntity {
    beforeInsert() {
        this.id = uuid.v4();
    }
};
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], Log.prototype, "entity", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsNotEmpty({ groups: [CREATE] }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ length: 20 }),
    __metadata("design:type", String)
], Log.prototype, "action", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    class_validator_1.IsString({ always: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Log.prototype, "account_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => account_entity_1.Account, account => account.logs, {
        cascade: true,
        onDelete: 'NO ACTION',
    }),
    typeorm_1.JoinColumn({ name: 'account_id' }),
    __metadata("design:type", account_entity_1.Account)
], Log.prototype, "account", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    class_validator_1.IsOptional({ always: true }),
    typeorm_1.Column({ type: 'json', nullable: true }),
    __metadata("design:type", log_meta_1.MetaLog)
], Log.prototype, "meta", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Log.prototype, "beforeInsert", null);
Log = __decorate([
    typeorm_1.Entity('logs')
], Log);
exports.Log = Log;
//# sourceMappingURL=log.entity.js.map