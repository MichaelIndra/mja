import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AccountRole } from './accountRole.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
export declare class AccountRoleService extends TypeOrmCrudService<AccountRole> {
    constructor(repo: any);
    create(account: Partial<AccountRole>): Promise<AccountRole>;
    update(id: string, account: Partial<AccountRole>): Promise<UpdateResult>;
    delete(id: any): Promise<DeleteResult>;
}
