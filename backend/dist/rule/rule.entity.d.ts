import { BaseEntity } from '../base.entity';
import { RuleEnum } from './rule.enum';
export declare class Rule extends BaseEntity {
    name: string;
    type: RuleEnum;
    description: string;
    value: string;
    protected beforeInsert(): void;
}
