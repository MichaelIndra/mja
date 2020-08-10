import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './branch.entity';

@Injectable()
export class BranchService extends TypeOrmCrudService<Branch> {
  constructor(@InjectRepository(Branch) repo) {
    super(repo);
  }
}
