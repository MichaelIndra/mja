import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermission } from './rolePermission.entity';

@Injectable()
export class RolePermissionService extends TypeOrmCrudService<RolePermission> {
  constructor(@InjectRepository(RolePermission) repo) {
    super(repo);
  }
}
