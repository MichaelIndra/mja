import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RewardDeduction} from './rewardDeduction.entity';

@Injectable()
export class RewardDeductionService extends TypeOrmCrudService<RewardDeduction> {
  constructor(@InjectRepository(RewardDeduction) repo) {
    super(repo);
  }
}
