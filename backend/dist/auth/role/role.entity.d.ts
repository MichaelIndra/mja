import { BaseEntity } from '../../base.entity';
import { RolePermission } from '../../auth/rolePermission/rolePermission.entity';
import { AccountRole } from '../../auth/accountRole/accountRole.entity';
export declare class Role extends BaseEntity {
    name: string;
    description: string;
    role_permissions: RolePermission[];
    account_roles: AccountRole[];
    protected beforeInsert(): void;
}
