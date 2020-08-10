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
const account_entity_1 = require("../auth/account/account.entity");
const typeorm_2 = require("typeorm");
const AccountSeed_1 = require("../database/seeds/_1account/AccountSeed");
const BranchSeed_1 = require("../database/seeds/_4branch/BranchSeed");
const RoleSeed_1 = require("../database/seeds/_2role/RoleSeed");
const AccountRoleSeed_1 = require("../database/seeds/_3accountRole/AccountRoleSeed");
const branch_entity_1 = require("../branch/branch.entity");
const role_entity_1 = require("../auth/role/role.entity");
const accountRole_entity_1 = require("../auth/accountRole/accountRole.entity");
let InitService = class InitService {
    constructor(accountRepository, branchRepository, roleRepository, accountRoleRepository) {
        this.accountRepository = accountRepository;
        this.branchRepository = branchRepository;
        this.roleRepository = roleRepository;
        this.accountRoleRepository = accountRoleRepository;
    }
    createBranch() {
        return __awaiter(this, void 0, void 0, function* () {
            const branchesCreated = [];
            let totalExist = 0;
            for (const tmpData of BranchSeed_1.SeedData) {
                const isExist = yield this.branchRepository.findOne({ name: tmpData.name });
                if (isExist) {
                    totalExist++;
                }
                else {
                    branchesCreated.push(tmpData);
                }
            }
            const saved = yield this.branchRepository.save(branchesCreated);
            return {
                total_exist: totalExist,
                total_saved: saved.length,
                data_saved: saved,
            };
        });
    }
    createRole() {
        return __awaiter(this, void 0, void 0, function* () {
            const rolesCreated = [];
            let totalExist = 0;
            for (const tmpData of RoleSeed_1.SeedData) {
                const isExist = yield this.roleRepository.findOne({ name: tmpData.name });
                if (isExist) {
                    totalExist++;
                }
                else {
                    rolesCreated.push(tmpData);
                }
            }
            const saved = yield this.roleRepository.save(rolesCreated);
            return {
                total_exist: totalExist,
                total_saved: saved.length,
                data_saved: saved,
            };
        });
    }
    createAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const listUsername = AccountSeed_1.SeedData.map(item => item.username);
            const newAccountDatas = AccountSeed_1.SeedData.filter(item => listUsername.includes(item.username));
            const accountsCreated = [];
            let totalExist = 0;
            for (const tmpData of newAccountDatas) {
                const isExist = yield this.accountRepository.findOne({ username: tmpData.username });
                if (isExist) {
                    totalExist++;
                }
                else {
                    accountsCreated.push(tmpData);
                }
            }
            const saved = yield this.accountRepository.save(accountsCreated);
            return {
                total_exist: totalExist,
                total_saved: saved.length,
                data_saved: saved,
            };
        });
    }
    createAccountRole() {
        return __awaiter(this, void 0, void 0, function* () {
            const accountRolesCreated = [];
            let totalExist = 0;
            for (const tmpData of AccountRoleSeed_1.SeedData) {
                const isAccountExist = yield this.accountRepository.findOne({ id: tmpData.account_id });
                const isRoleExist = yield this.roleRepository.findOne({ id: tmpData.role_id });
                if (isAccountExist && isRoleExist) {
                    const isExist = yield this.accountRoleRepository.findOne({ account_id: tmpData.account_id, role_id: tmpData.role_id });
                    if (isExist) {
                        totalExist++;
                    }
                    else {
                        accountRolesCreated.push(tmpData);
                    }
                }
            }
            const saved = yield this.accountRoleRepository.save(accountRolesCreated);
            return {
                total_exist: totalExist,
                total_saved: saved.length,
                data_saved: saved,
            };
        });
    }
};
InitService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(account_entity_1.Account)),
    __param(1, typeorm_1.InjectRepository(branch_entity_1.Branch)),
    __param(2, typeorm_1.InjectRepository(role_entity_1.Role)),
    __param(3, typeorm_1.InjectRepository(accountRole_entity_1.AccountRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InitService);
exports.InitService = InitService;
//# sourceMappingURL=init.service.js.map