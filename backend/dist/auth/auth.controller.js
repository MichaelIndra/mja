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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const auth_dto_1 = require("./auth.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.authService.login(user);
        });
    }
    sendLinkResetPassword(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDto = Object.assign(Object.assign({}, dto), { randomize: 0 });
                return this.authService.sendLinkResetPassword(newDto);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || JSON.stringify(err), err.statusCode || err.status || 500);
            }
        });
    }
    sendRandomResetPassword(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDto = Object.assign(Object.assign({}, dto), { randomize: 1 });
                return this.authService.sendLinkResetPassword(newDto);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || JSON.stringify(err), err.statusCode || err.status || 500);
            }
        });
    }
    resetPassword(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.authService.resetPassword(dto);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || JSON.stringify(err), err.statusCode || err.status || 500);
            }
        });
    }
};
__decorate([
    common_1.Post('login'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Generate url for reset password. Then, send generated url to email.' }),
    common_1.Post('reset-password/generate-token'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LinkResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendLinkResetPassword", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Generate random password. Then, send generated password to email.' }),
    common_1.Post('reset-password/generate-random-password'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RandomResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendRandomResetPassword", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Reset password by token' }),
    common_1.Put('reset-password/by-token'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
AuthController = __decorate([
    swagger_1.ApiUseTags('Auth'),
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map