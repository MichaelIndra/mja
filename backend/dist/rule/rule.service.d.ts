import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Rule } from './rule.entity';
export declare class RuleService extends TypeOrmCrudService<Rule> {
    constructor(repo: any);
}
