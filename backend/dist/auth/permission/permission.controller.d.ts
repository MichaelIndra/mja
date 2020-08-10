import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
import { Permission } from './permission.entity';
import { PermissionService } from './permission.service';
export declare class PermissionController implements CrudController<Permission> {
    service: PermissionService;
    constructor(service: PermissionService);
    get base(): CrudController<Permission>;
    getMany(req: CrudRequest): Promise<import("@nestjsx/crud").GetManyDefaultResponse<Permission> | Permission[]>;
    getOneAndDoStuff(req: CrudRequest): Promise<Permission>;
    createOne(req: CrudRequest, dto: Permission): Promise<Permission>;
    createMany(req: CrudRequest, dto: CreateManyDto<Permission>): Promise<Permission[]>;
    coolFunction(req: CrudRequest, dto: Permission): Promise<Permission>;
    awesomePUT(req: CrudRequest, dto: Permission): Promise<Permission>;
    deleteOne(req: CrudRequest): Promise<void | Permission>;
}
