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
const crud_1 = require("@nestjsx/crud");
const account_entity_1 = require("./account.entity");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../role/roles.guard");
const account_service_1 = require("./account.service");
const role_decorator_1 = require("../role/role.decorator");
const account_dto_1 = require("./account.dto");
const role_service_1 = require("../../auth/role/role.service");
let AccountController = class AccountController {
    constructor(service, roleService) {
        this.service = service;
        this.roleService = roleService;
    }
    get base() {
        return this;
    }
    getMany(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const joins = req.parsed.join;
            if (joins && !joins.find(item => item.field === 'account_roles')) {
                req.parsed.join.push({ field: 'account_roles' });
            }
            const listRole = [];
            const results = yield this.base.getManyBase(req);
            let datas;
            if (results.data) {
                datas = results.data;
            }
            else {
                datas = results;
            }
            const newResults = [];
            for (const item of datas) {
                const roles = [];
                for (const accountRole of item.account_roles) {
                    const findRole = listRole.find(el => el.id === accountRole.role_id);
                    if (findRole) {
                        roles.push(findRole);
                    }
                    else {
                        const findRoleFromDB = yield this.roleService.findOne(accountRole.role_id);
                        if (findRoleFromDB) {
                            listRole.push(findRoleFromDB);
                            roles.push(findRoleFromDB);
                        }
                    }
                }
                const newItem = Object.assign(Object.assign({}, item), { roles });
                delete newItem.account_roles;
                delete newItem.password;
                newResults.push(newItem);
            }
            return newResults;
        });
    }
    getOneAndDoStuff(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.base.getOneBase(req);
            delete res.password;
            let roles = [];
            if (res.account_roles) {
                roles = res.account_roles.map(el => el.role);
            }
            res = Object.assign(Object.assign({}, res), { roles });
            return res;
        });
    }
    createOne(dto) {
        return this.service.createWithRole(dto);
    }
    createMany(req, dto) {
        return this.base.createManyBase(req, dto);
    }
    coolFunction(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.service.updateWithRole(id, dto);
            delete res.password;
            const roles = res.account_roles.map(el => el.role);
            res = Object.assign(Object.assign({}, res), { roles });
            return res;
        });
    }
    awesomePUT(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.service.updateWithRole(id, dto);
            delete res.password;
            const roles = res.account_roles.map(el => el.role);
            res = Object.assign(Object.assign({}, res), { roles });
            return res;
        });
    }
    deleteOne(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.base.deleteOneBase(req);
        });
    }
};
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getMany", null);
__decorate([
    crud_1.Override('getOneBase'),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getOneAndDoStuff", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [account_dto_1.AccountDto]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "createOne", null);
__decorate([
    role_decorator_1.Roles('admin'),
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "createMany", null);
__decorate([
    crud_1.Override('updateOneBase'),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, account_dto_1.AccountDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "coolFunction", null);
__decorate([
    role_decorator_1.Roles('admin'),
    crud_1.Override('replaceOneBase'),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, account_dto_1.AccountDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "awesomePUT", null);
__decorate([
    role_decorator_1.Roles('admin'),
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "deleteOne", null);
AccountController = __decorate([
    crud_1.Crud({
        model: {
            type: account_entity_1.Account,
        },
        params: {
            id: {
                field: 'id',
                type: 'string',
                primary: true,
            },
        },
        query: {
            join: {
                account_roles: {
                    exclude: [],
                },
                'account_roles.role': {
                    exclude: [],
                },
                branch: {
                    exclude: [],
                },
            },
        },
    }),
    swagger_1.ApiUseTags('Accounts'),
    common_1.Controller('accounts'),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    swagger_1.ApiBearerAuth(),
    __metadata("design:paramtypes", [account_service_1.AccountService,
        role_service_1.RoleService])
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map