import { Module } from '@nestjs/common';
import { RewardDeductionService } from './rewardDeduction.service';
import { RewardDeductionController } from './rewardDeduction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardDeduction } from './rewardDeduction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RewardDeduction])],
  providers: [RewardDeductionService],
  controllers: [RewardDeductionController],
})
export class RewardDeductionModule {}
