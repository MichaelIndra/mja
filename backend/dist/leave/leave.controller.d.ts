import { Leave } from './leave.entity';
import { LeaveService } from './leave.service';
import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
import { DeleteManyLeaveDto } from './leave.dto';
export declare class LeaveController implements CrudController<Leave> {
    service: LeaveService;
    constructor(service: LeaveService);
    get base(): CrudController<Leave>;
    getMany(req: CrudRequest): Promise<Leave[] | import("@nestjsx/crud").GetManyDefaultResponse<Leave>>;
    getOneAndDoStuff(req: CrudRequest): Promise<Leave>;
    createOne(req: CrudRequest, dto: Leave): Promise<Leave>;
    createMany(req: CrudRequest, dto: CreateManyDto<Leave>): Promise<Leave[]>;
    coolFunction(req: CrudRequest, dto: Leave): Promise<Leave>;
    awesomePUT(req: CrudRequest, dto: Leave): Promise<Leave>;
    deleteOne(req: CrudRequest): Promise<void | Leave>;
    deleteMany(dto: DeleteManyLeaveDto, request: Request): Promise<any>;
}
