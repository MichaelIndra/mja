import { Module } from '@nestjs/common';
import {RuleService} from './rule.service';
import { RuleController} from './rule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule} from './rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rule])],
  providers: [RuleService],
  controllers: [RuleController],
})
export class RuleModule { }
