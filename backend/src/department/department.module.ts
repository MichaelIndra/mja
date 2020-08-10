import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { GroupService } from './group/group.service';
import { Group } from './group/group.entity';
import { GroupController } from './group/group.controller';
import { Area } from './area/area.entity';
import { Position } from './area/position/position.entity';
import { AreaService } from './area/area.service';
import { PositionService } from './area/position/position.service';
import { AreaController } from './area/area.controller';
import { PositionController } from './area/position/position.controller';
import { Log } from '../log/log.entity';
import { LogService } from '../log/log.service';
import {Employee} from '../employee/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Employee, Group, Area, Position, Log])],
  providers: [DepartmentService, GroupService, AreaService, PositionService, LogService],
  controllers: [
    DepartmentController,
    GroupController,
    AreaController,
    PositionController,
  ],
})
export class DepartmentModule { }
