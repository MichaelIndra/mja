import { Module } from '@nestjs/common';
import { PaySlipService} from './paySlip.service';
import { PaySlipController } from './paySlip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {PaySlip} from './paySlip.entity';
import { Department } from '../department/department.entity';
import { Group } from '../department/group/group.entity';
import { Area } from '../department/area/area.entity';
import { Position } from '../department/area/position/position.entity';
import { Log } from '../log/log.entity';
import { LogService } from '../log/log.service';
import { Loan } from '../loan/loan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    PaySlip,
    Loan,
    Department, Group,
    Area, Position,
    Log,
  ])],
  providers: [PaySlipService, LogService],
  controllers: [PaySlipController],
})
export class PaySlipModule { }
