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
const typeorm_1 = require("@nestjs/typeorm");
const account_entity_1 = require("./account.entity");
const crud_typeorm_1 = require("@nestjsx/crud-typeorm");
const role_service_1 = require("../role/role.service");
const accountRole_service_1 = require("../accountRole/accountRole.service");
const encrypt_1 = require("../../utils/encrypt");
const mail_service_1 = require("../../services/mail.service");
const feature_enum_1 = require("../../services/feature.enum");
const cryptoRandomString = require("crypto-random-string");
let AccountService = class AccountService extends crud_typeorm_1.TypeOrmCrudService {
    constructor(repo, roleService, accountRoleService, mailService) {
        super(repo);
        this.roleService = roleService;
        this.accountRoleService = accountRoleService;
        this.mailService = mailService;
    }
    createWithRole(account) {
        return __awaiter(this, void 0, void 0, function* () {
            let isAccountExist = yield this.repo.findOne({
                where: {
                    username: account.username.toLowerCase(),
                },
            });
            if (isAccountExist) {
                throw new common_1.HttpException('Username already taken.', 400);
            }
            isAccountExist = yield this.repo.findOne({
                where: {
                    email: account.email.toLowerCase(),
                },
            });
            if (isAccountExist) {
                throw new common_1.HttpException('Email already taken.', 400);
            }
            const created = yield this.repo.create(account);
            const createdAccount = yield this.repo.save(created);
            delete createdAccount.password;
            try {
                for (const temp of account.roles) {
                    if (!this.findByRoleId(temp.id)) {
                        throw new common_1.NotFoundException('Role not found');
                    }
                    const accountRoleData = {
                        account_id: createdAccount.id,
                        role_id: temp,
                    };
                    yield this.accountRoleService.create(accountRoleData);
                }
            }
            catch (e) {
                yield this.repo.delete(createdAccount);
                throw new common_1.HttpException(`Already exists ${e}`, 400);
            }
            return createdAccount;
        });
    }
    findByRoleId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.roleService.findOne({
                where: {
                    role_id: id,
                },
            });
        });
    }
    updateWithRole(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.repo.findOne({
                where: {
                    id,
                },
                relations: ['account_roles'],
            });
            if (!account) {
                throw new common_1.NotFoundException('Account not found');
            }
            const accountRoleIds = account.account_roles.map(item => item.id);
            if (accountRoleIds &&
                Array.isArray(accountRoleIds) &&
                accountRoleIds.length > 0) {
                yield this.accountRoleService.delete(accountRoleIds);
            }
            try {
                for (const temp of dto.roles) {
                    if (!this.findByRoleId(temp.id)) {
                        throw new common_1.NotFoundException('Role not found');
                    }
                    const accountRoleData = {
                        account_id: id,
                        role_id: temp,
                    };
                    yield this.accountRoleService.create(accountRoleData);
                }
            }
            catch (err) {
                throw new common_1.HttpException(JSON.stringify(err), 400);
            }
            delete dto.roles;
            if (dto.password)
                dto.password = encrypt_1.encryptPassword(dto.password);
            yield this.repo.update(account.id, dto);
            let res = yield this.repo.findOne({
                where: { id },
                relations: ['account_roles', 'account_roles.role'],
            });
            delete res.password;
            const roles = res.account_roles.map(el => el.role);
            res = Object.assign(Object.assign({}, res), { roles });
            return res;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.findOne({
                where: {
                    email: email.toLowerCase(),
                },
            });
        });
    }
    login(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = yield this.repo.findOne({
                where: {
                    username: auth.username,
                    password: auth.password,
                },
                relations: ['account_roles', 'account_roles.role', 'branch'],
            });
            if (!account) {
                account = yield this.repo.findOne({
                    where: {
                        email: auth.username.toLowerCase(),
                        password: auth.password,
                    },
                    relations: ['account_roles', 'account_roles.role', 'branch'],
                });
            }
            if (!account) {
                return account;
            }
            const roles = account.account_roles.map(item => item.role.name);
            const newAccount = Object.assign(Object.assign({}, account), { roles });
            delete newAccount.account_roles;
            return newAccount;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.findOne({
                where: {
                    id,
                },
            });
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const created = yield this.repo.create(user);
                const saved = yield this.repo.save(created);
                delete saved.password;
                return saved;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    sendLinkResetPassword(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let account = yield this.repo.findOne({
                    where: {
                        email: dto.email.toLowerCase(),
                    },
                });
                if (!account) {
                    account = yield this.repo.findOne({
                        where: {
                            username: dto.email.toLowerCase(),
                        },
                    });
                    if (!account) {
                        throw new common_1.HttpException('Account is not found', 404);
                    }
                }
                if (Number(dto.randomize) === 1) {
                    const randomPassword = cryptoRandomString({ length: 8 });
                    yield this.updatePassword(account.id, { password: randomPassword, re_password: randomPassword });
                    yield this.mailService.send(account.email, 'Reset Password', { account, randomPassword }, feature_enum_1.EFeatureList.CHANGE_PASSWORD_RANDOM);
                    return {
                        status: 'OK',
                        message: 'Success',
                        data: {
                            new_password: randomPassword,
                        },
                    };
                }
                else {
                    const token = yield encrypt_1.generateToken();
                    const baseUrl = dto.redirect_url ? dto.redirect_url : process.env.REDIRECT_URL_FORGOT_PASSWORD;
                    const url = baseUrl + '?token=' + token + '&email=' + account.email;
                    yield this.repo.update(account.id, { token_reset_password: token });
                    yield this.mailService.send(account.email, 'Forgot Password', { account, url }, feature_enum_1.EFeatureList.FORGOT_PASSWORD);
                    return {
                        status: 'OK',
                        message: 'Success',
                    };
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    resetPassword(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield this.repo.findOne({
                    where: {
                        email: dto.email.toLowerCase(),
                        token: dto.token,
                    },
                });
                if (!account) {
                    throw new common_1.HttpException('Email and token is not valid.', 400);
                }
                return yield this.updatePassword(account.id, Object.assign({}, dto));
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    updatePassword(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const changedPassword = encrypt_1.encryptPassword(dto.password);
                if (dto.password !== dto.re_password) {
                    throw new common_1.HttpException('Password and confirmation password doesn\'t match', 400);
                }
                return yield this.repo.update(id, { password: changedPassword, token_reset_password: null });
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
AccountService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(account_entity_1.Account)),
    __metadata("design:paramtypes", [Object, role_service_1.RoleService,
        accountRole_service_1.AccountRoleService,
        mail_service_1.MailService])
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map