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
const swagger_1 = require("@nestjs/swagger");
const crypto = require("crypto");
class AccountDto {
    hashPassword() {
        this.password = crypto.createHmac('sha256', this.password).digest('hex');
    }
}
__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], AccountDto.prototype, "first_name", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], AccountDto.prototype, "last_name", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    __metadata("design:type", String)
], AccountDto.prototype, "avatar", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], AccountDto.prototype, "username", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], AccountDto.prototype, "password", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], AccountDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    __metadata("design:type", Array)
], AccountDto.prototype, "roles", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccountDto.prototype, "hashPassword", null);
exports.AccountDto = AccountDto;
//# sourceMappingURL=account.dto.js.map