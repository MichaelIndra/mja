"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const account_entity_1 = require("./account/account.entity");
const account_service_1 = require("./account/account.service");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const account_controller_1 = require("./account/account.controller");
const role_service_1 = require("./role/role.service");
const role_controller_1 = require("./role/role.controller");
const role_entity_1 = require("./role/role.entity");
const permission_entity_1 = require("./permission/permission.entity");
const permission_service_1 = require("./permission/permission.service");
const permission_controller_1 = require("./permission/permission.controller");
const rolePermission_entity_1 = require("./rolePermission/rolePermission.entity");
const accountRole_entity_1 = require("./accountRole/accountRole.entity");
const accountRole_service_1 = require("./accountRole/accountRole.service");
const rolePermission_service_1 = require("./rolePermission/rolePermission.service");
const rolePermission_controller_1 = require("./rolePermission/rolePermission.controller");
const accountPermission_service_1 = require("./accountPermission/accountPermission.service");
const accountPermission_entity_1 = require("./accountPermission/accountPermission.entity");
const mail_service_1 = require("../services/mail.service");
const dotenv = require("dotenv");
const branch_service_1 = require("../branch/branch.service");
const branch_entity_1 = require("../branch/branch.entity");
const { parsed } = dotenv.config({
    path: process.cwd() + '/.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});
process.env = Object.assign(Object.assign({}, process.env), parsed);
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                account_entity_1.Account,
                role_entity_1.Role,
                permission_entity_1.Permission,
                accountRole_entity_1.AccountRole,
                rolePermission_entity_1.RolePermission,
                accountPermission_entity_1.AccountPermission,
                branch_entity_1.Branch,
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
            }),
        ],
        providers: [
            account_service_1.AccountService,
            auth_service_1.AuthService,
            role_service_1.RoleService,
            permission_service_1.PermissionService,
            accountRole_service_1.AccountRoleService,
            rolePermission_service_1.RolePermissionService,
            accountPermission_service_1.AccountPermissionService,
            branch_service_1.BranchService,
            mail_service_1.MailService,
        ],
        controllers: [
            auth_controller_1.AuthController,
            account_controller_1.AccountController,
            role_controller_1.RoleController,
            permission_controller_1.PermissionController,
            rolePermission_controller_1.RolePermissionController,
        ],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map