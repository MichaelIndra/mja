import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
import { RolePermission } from './rolePermission.entity';
import { RolePermissionService } from './rolePermission.service';
export declare class RolePermissionController implements CrudController<RolePermission> {
    service: RolePermissionService;
    constructor(service: RolePermissionService);
    get base(): CrudController<RolePermission>;
    getMany(req: CrudRequest): Promise<RolePermission[] | import("@nestjsx/crud").GetManyDefaultResponse<RolePermission>>;
    getOneAndDoStuff(req: CrudRequest): Promise<RolePermission>;
    createOne(req: CrudRequest, dto: RolePermission): Promise<RolePermission>;
    createMany(req: CrudRequest, dto: CreateManyDto<RolePermission>): Promise<RolePermission[]>;
    coolFunction(req: CrudRequest, dto: RolePermission): Promise<RolePermission>;
    awesomePUT(req: CrudRequest, dto: RolePermission): Promise<RolePermission>;
    deleteOne(req: CrudRequest): Promise<void | RolePermission>;
}
