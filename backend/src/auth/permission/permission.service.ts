import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionService extends TypeOrmCrudService<Permission> {
  constructor(@InjectRepository(Permission) repo) {
    super(repo);
  }
}
