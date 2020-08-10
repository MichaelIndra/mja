import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountPermission } from './accountPermission.entity';

@Injectable()
export class AccountPermissionService extends TypeOrmCrudService<AccountPermission> {
  constructor(@InjectRepository(AccountPermission) repo) {
    super(repo);
  }
}
