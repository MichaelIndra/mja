import { BaseEntity } from '../../base.entity';
import { Role } from '../../auth/role/role.entity';
import { Permission } from '../../auth/permission/permission.entity';
export declare class RolePermission extends BaseEntity {
    role_id: string;
    role: Role;
    permission_id: string;
    permission: Permission;
    protected beforeInsert(): void;
}
