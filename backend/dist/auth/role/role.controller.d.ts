import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
import { Role } from './role.entity';
import { RoleService } from './role.service';
export declare class RoleController implements CrudController<Role> {
    service: RoleService;
    constructor(service: RoleService);
    get base(): CrudController<Role>;
    getMany(req: CrudRequest): Promise<import("@nestjsx/crud").GetManyDefaultResponse<Role> | Role[]>;
    getOneAndDoStuff(req: CrudRequest): Promise<Role>;
    createOne(req: CrudRequest, dto: Role): Promise<Role>;
    createMany(req: CrudRequest, dto: CreateManyDto<Role>): Promise<Role[]>;
    coolFunction(req: CrudRequest, dto: Role): Promise<Role>;
    awesomePUT(req: CrudRequest, dto: Role): Promise<Role>;
    deleteOne(req: CrudRequest): Promise<void | Role>;
}
