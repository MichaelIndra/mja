import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import {DepartmentService} from '../department/department.service';
import {GroupService} from '../department/group/group.service';
import {AreaService} from '../department/area/area.service';
import {PositionService} from '../department/area/position/position.service';
import {Department} from '../department/department.entity';
import {Group} from '../department/group/group.entity';
import {Area} from '../department/area/area.entity';
import {Position} from '../department/area/position/position.entity';
import { Log } from '../log/log.entity';
import { LogService } from '../log/log.service';
import { Loan } from '../loan/loan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Employee,
    Department, Group,
    Area, Position,
    Log,
    Loan,
  ])],
  providers: [
    EmployeeService,
    DepartmentService,
    GroupService,
    AreaService,
    PositionService,
    LogService,
  ],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
