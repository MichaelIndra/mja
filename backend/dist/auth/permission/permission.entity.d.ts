import { BaseEntity } from '../../base.entity';
import { RolePermission } from '../../auth/rolePermission/rolePermission.entity';
import { AccountPermission } from '../../auth/accountPermission/accountPermission.entity';
export declare class Permission extends BaseEntity {
    name: string;
    role_permissions: RolePermission[];
    account_permissions: AccountPermission[];
    protected beforeInsert(): void;
}
