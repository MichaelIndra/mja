import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Role } from './role.entity';
export declare class RoleService extends TypeOrmCrudService<Role> {
    constructor(repo: any);
}
