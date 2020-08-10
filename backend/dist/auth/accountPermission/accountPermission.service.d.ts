import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AccountPermission } from './accountPermission.entity';
export declare class AccountPermissionService extends TypeOrmCrudService<AccountPermission> {
    constructor(repo: any);
}
