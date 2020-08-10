"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const init_service_1 = require("./init.service");
const init_controller_1 = require("./init.controller");
const typeorm_1 = require("@nestjs/typeorm");
const account_entity_1 = require("../auth/account/account.entity");
const branch_entity_1 = require("../branch/branch.entity");
const role_entity_1 = require("../auth/role/role.entity");
const accountRole_entity_1 = require("../auth/accountRole/accountRole.entity");
let InitModule = class InitModule {
};
InitModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([account_entity_1.Account, branch_entity_1.Branch, role_entity_1.Role, accountRole_entity_1.AccountRole])],
        providers: [init_service_1.InitService],
        controllers: [init_controller_1.InitController],
    })
], InitModule);
exports.InitModule = InitModule;
//# sourceMappingURL=init.module.js.map