import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './loan.entity';
import { Log } from '../log/log.entity';
import { LogService } from '../log/log.service';
import { Department } from '../department/department.entity';
import { Group } from '../department/group/group.entity';
import { Area } from '../department/area/area.entity';
import { Position } from '../department/area/position/position.entity';
import {Employee} from '../employee/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Loan, Employee,
    Department, Group,
    Area, Position,
    Log,
  ])],
  providers: [LoanService, LogService],
  controllers: [LoanController],
})
export class LoanModule { }
