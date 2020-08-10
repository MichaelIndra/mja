import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Branch } from './branch.entity';
export declare class BranchService extends TypeOrmCrudService<Branch> {
    constructor(repo: any);
}
