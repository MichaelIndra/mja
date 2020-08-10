import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';

@Injectable()
export class ScheduleService extends TypeOrmCrudService<Schedule> {
  constructor(@InjectRepository(Schedule) repo) {
    super(repo);
  }
}
