import { Schedule } from './schedule.entity';
import { ScheduleService } from './schedule.service';
import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
export declare class ScheduleController implements CrudController<Schedule> {
    service: ScheduleService;
    constructor(service: ScheduleService);
    get base(): CrudController<Schedule>;
    getMany(req: CrudRequest): Promise<import("@nestjsx/crud").GetManyDefaultResponse<Schedule> | Schedule[]>;
    getOneAndDoStuff(req: CrudRequest): Promise<Schedule>;
    createOne(req: CrudRequest, dto: Schedule): Promise<Schedule>;
    createMany(req: CrudRequest, dto: CreateManyDto<Schedule>): Promise<Schedule[]>;
    coolFunction(req: CrudRequest, dto: Schedule): Promise<Schedule>;
    awesomePUT(req: CrudRequest, dto: Schedule): Promise<Schedule>;
    deleteOne(req: CrudRequest): Promise<void | Schedule>;
}
