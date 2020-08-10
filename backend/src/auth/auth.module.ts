import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account/account.entity';
import { AccountService } from './account/account.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountController } from './account/account.controller';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { Role } from './role/role.entity';
import { Permission } from './permission/permission.entity';
import { PermissionService } from './permission/permission.service';
import { PermissionController } from './permission/permission.controller';
import { RolePermission } from './rolePermission/rolePermission.entity';
import { AccountRole } from './accountRole/accountRole.entity';
import { AccountRoleService } from './accountRole/accountRole.service';
import { RolePermissionService } from './rolePermission/rolePermission.service';
import { RolePermissionController } from './rolePermission/rolePermission.controller';
import { AccountPermissionService } from './accountPermission/accountPermission.service';
import { AccountPermission } from './accountPermission/accountPermission.entity';
import { MailService } from '../services/mail.service';

// Load dot environment before load other modules
import dotenv = require('dotenv');
import {BranchService} from '../branch/branch.service';
import {Branch} from '../branch/branch.entity';
const { parsed } = dotenv.config({
  path: process.cwd() + '/.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});
process.env = { ...process.env, ...parsed };

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Role,
      Permission,
      AccountRole,
      RolePermission,
      AccountPermission,
      Branch,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],

  providers: [
    AccountService,
    AuthService,
    RoleService,
    PermissionService,
    AccountRoleService,
    RolePermissionService,
    AccountPermissionService,
    BranchService,
    MailService,
  ],

  controllers: [
    AuthController,
    AccountController,
    RoleController,
    PermissionController,
    RolePermissionController,
  ],
})
export class AuthModule {}
