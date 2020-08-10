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
const account_service_1 = require("../auth/account/account.service");
const jwt_1 = require("@nestjs/jwt");
const crypto = require("crypto");
let AuthService = class AuthService {
    constructor(accountService, jwtService) {
        this.accountService = accountService;
        this.jwtService = jwtService;
    }
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.jwtService.verify(token);
        });
    }
    validate(accountData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.accountService.login(accountData);
        });
    }
    login(account) {
        return __awaiter(this, void 0, void 0, function* () {
            account = Object.assign(Object.assign({}, account), { password: crypto.createHmac('sha256', account.password).digest('hex') });
            return this.validate(account).then(accountData => {
                if (!accountData) {
                    return { status: 404, message: 'Login failed' };
                }
                delete accountData.password;
                const payload = Object.assign({}, accountData);
                const accessToken = this.jwtService.sign(payload, {
                    expiresIn: '1h',
                    algorithm: 'HS256',
                });
                return {
                    expires_in: 3600,
                    access_token: accessToken,
                };
            });
        });
    }
    register(account) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.accountService.create(account);
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    resetPassword(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.accountService.resetPassword(dto);
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    sendLinkResetPassword(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.accountService.sendLinkResetPassword(dto);
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [account_service_1.AccountService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map