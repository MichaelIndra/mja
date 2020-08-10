import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Permission } from './permission.entity';
export declare class PermissionService extends TypeOrmCrudService<Permission> {
    constructor(repo: any);
}
