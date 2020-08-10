import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { RewardDeduction } from './rewardDeduction.entity';
export declare class RewardDeductionService extends TypeOrmCrudService<RewardDeduction> {
    constructor(repo: any);
}
