import { Group } from './group.entity';
import { GroupService } from './group.service';
import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
export declare class GroupController implements CrudController<Group> {
    service: GroupService;
    constructor(service: GroupService);
    get base(): CrudController<Group>;
    getMany(req: CrudRequest): Promise<Group[] | import("@nestjsx/crud").GetManyDefaultResponse<Group>>;
    getOneAndDoStuff(req: CrudRequest): Promise<Group>;
    createOne(req: CrudRequest, dto: Group): Promise<Group>;
    createMany(req: CrudRequest, dto: CreateManyDto<Group>): Promise<Group[]>;
    updateOne(req: CrudRequest, dto: Group, request: Request): Promise<Group>;
    replaceOne(req: CrudRequest, dto: Group, request: Request): Promise<Group>;
    deleteOne(req: CrudRequest, request: Request): Promise<any>;
}
