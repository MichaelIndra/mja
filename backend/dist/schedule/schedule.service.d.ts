import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Schedule } from './schedule.entity';
export declare class ScheduleService extends TypeOrmCrudService<Schedule> {
    constructor(repo: any);
}
