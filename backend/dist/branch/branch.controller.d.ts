import { Branch } from './branch.entity';
import { BranchService } from './branch.service';
import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
export declare class BranchController implements CrudController<Branch> {
    service: BranchService;
    constructor(service: BranchService);
    get base(): CrudController<Branch>;
    getMany(req: CrudRequest): Promise<Branch[] | import("@nestjsx/crud").GetManyDefaultResponse<Branch>>;
    getOneAndDoStuff(req: CrudRequest): Promise<Branch>;
    createOne(req: CrudRequest, dto: Branch): Promise<Branch>;
    createMany(req: CrudRequest, dto: CreateManyDto<Branch>): Promise<Branch[]>;
    coolFunction(req: CrudRequest, dto: Branch): Promise<Branch>;
    awesomePUT(req: CrudRequest, dto: Branch): Promise<Branch>;
    deleteOne(req: CrudRequest): Promise<void | Branch>;
}
