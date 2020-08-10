import { Request } from './request.entity';
import { RequestService } from './request.service';
import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
export declare class RequestController implements CrudController<Request> {
    service: RequestService;
    constructor(service: RequestService);
    get base(): CrudController<Request>;
    getMany(req: CrudRequest): Promise<import("@nestjsx/crud").GetManyDefaultResponse<Request> | Request[]>;
    getOneAndDoStuff(req: CrudRequest): Promise<Request>;
    createOne(req: CrudRequest, dto: Request): Promise<Request>;
    createMany(req: CrudRequest, dto: CreateManyDto<Request>): Promise<Request[]>;
    coolFunction(req: CrudRequest, dto: Request): Promise<Request>;
    awesomePUT(req: CrudRequest, dto: Request): Promise<Request>;
    deleteOne(req: CrudRequest): Promise<void | Request>;
}
