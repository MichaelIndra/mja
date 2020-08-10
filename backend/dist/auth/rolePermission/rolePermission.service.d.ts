import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { RolePermission } from './rolePermission.entity';
export declare class RolePermissionService extends TypeOrmCrudService<RolePermission> {
    constructor(repo: any);
}
