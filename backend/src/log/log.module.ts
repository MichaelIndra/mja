import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { Department } from '../department/department.entity';
import { Group } from '../department/group/group.entity';
import { Area } from '../department/area/area.entity';
import { Position } from '../department/area/position/position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Log, Department, Group, Area, Position])],
  providers: [LogService],
  controllers: [LogController],
})
export class LogModule {}
