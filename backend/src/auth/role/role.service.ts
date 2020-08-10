import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  constructor(@InjectRepository(Role) repo) {
    super(repo);
  }
}
