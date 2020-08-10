import { Log } from './log.entity';
import { LogService } from './log.service';
import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
export declare class LogController implements CrudController<Log> {
    service: LogService;
    constructor(service: LogService);
    get base(): CrudController<Log>;
    getMany(req: CrudRequest): Promise<Log[] | import("@nestjsx/crud").GetManyDefaultResponse<Log>>;
    getOneAndDoStuff(req: CrudRequest): Promise<Log>;
    createOne(req: CrudRequest, dto: Log): Promise<Log>;
    createMany(req: CrudRequest, dto: CreateManyDto<Log>): Promise<Log[]>;
    coolFunction(req: CrudRequest, dto: Log): Promise<Log>;
    awesomePUT(req: CrudRequest, dto: Log): Promise<Log>;
    deleteOne(req: CrudRequest): Promise<void | Log>;
}
