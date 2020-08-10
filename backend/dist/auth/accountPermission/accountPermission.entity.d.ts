import { BaseEntity } from '../../base.entity';
import { Account } from '../account/account.entity';
import { Permission } from '../permission/permission.entity';
export declare class AccountPermission extends BaseEntity {
    account_id: string;
    account: Account;
    permission_id: string;
    permission: Permission;
    protected beforeInsert(): void;
}
