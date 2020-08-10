import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../employee/employee.entity';
import { LogService } from '../log/log.service';
import { Log } from '../log/log.entity';
import { DepartmentService } from '../department/department.service';
import { GroupService } from '../department/group/group.service';
import { AreaService } from '../department/area/area.service';
import { PositionService } from '../department/area/position/position.service';
import { Department } from '../department/department.entity';
import { Group } from '../department/group/group.entity';
import { Area } from '../department/area/area.entity';
import { Position } from '../department/area/position/position.entity';
import { Loan } from '../loan/loan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Attendance,
    Employee,
    Department,
    Group,
    Area,
    Position,
    Log,
    Loan,
  ])],
  providers: [
    AttendanceService,
    EmployeeService,
    DepartmentService,
    GroupService,
    AreaService,
    PositionService,
    LogService,
  ],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
