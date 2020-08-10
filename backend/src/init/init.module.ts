import { Module } from '@nestjs/common';
import {InitService} from './init.service';
import { InitController} from './init.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../auth/account/account.entity';
import { Branch } from '../branch/branch.entity';
import { Role } from '../auth/role/role.entity';
import { AccountRole } from '../auth/accountRole/accountRole.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Branch, Role, AccountRole])],
  providers: [InitService],
  controllers: [InitController],
})
export class InitModule { }
