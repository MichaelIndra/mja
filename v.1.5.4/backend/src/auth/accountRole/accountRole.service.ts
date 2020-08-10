import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRole } from './accountRole.entity';
import {DeleteResult, UpdateResult} from 'typeorm';

@Injectable()
export class AccountRoleService extends TypeOrmCrudService<AccountRole> {
  constructor(@InjectRepository(AccountRole) repo) {
    super(repo);
  }
  async create(account: Partial<AccountRole>): Promise<AccountRole> {
    const created = await this.repo.create(account);
    return await this.repo.save(created);
  }
  async update( id: string, account: Partial<AccountRole>): Promise<UpdateResult> {
    return await this.repo.update(id, account);
  }
  async delete( id: any): Promise<DeleteResult>{
    return await this.repo.delete(id);
  }
}
