import { BaseEntity } from '../../base.entity';
import { Account } from '../account/account.entity';
import { Role } from '../role/role.entity';
export declare class AccountRole extends BaseEntity {
    account_id: string;
    account: Account;
    role_id: string;
    role: Role;
    protected beforeInsert(): void;
}
