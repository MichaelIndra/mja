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
const swagger_1 = require("@nestjs/swagger");
class LoginDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], LoginDto.prototype, "username", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
exports.LoginDto = LoginDto;
class UpdatePasswordDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], UpdatePasswordDto.prototype, "password", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], UpdatePasswordDto.prototype, "re_password", void 0);
exports.UpdatePasswordDto = UpdatePasswordDto;
class ResetPasswordDto extends UpdatePasswordDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
exports.ResetPasswordDto = ResetPasswordDto;
class RandomResetPasswordDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], RandomResetPasswordDto.prototype, "email", void 0);
exports.RandomResetPasswordDto = RandomResetPasswordDto;
class LinkResetPasswordDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], LinkResetPasswordDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional({ description: 'Set redirect_url if user can reset password by link.' }),
    __metadata("design:type", String)
], LinkResetPasswordDto.prototype, "redirect_url", void 0);
exports.LinkResetPasswordDto = LinkResetPasswordDto;
class SendLinkResetPasswordDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], SendLinkResetPasswordDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional({ description: 'Set this value if you want to randomize password.' }),
    __metadata("design:type", Number)
], SendLinkResetPasswordDto.prototype, "randomize", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional({ description: 'Set redirect_url if user can reset password by link.' }),
    __metadata("design:type", String)
], SendLinkResetPasswordDto.prototype, "redirect_url", void 0);
exports.SendLinkResetPasswordDto = SendLinkResetPasswordDto;
//# sourceMappingURL=auth.dto.js.map