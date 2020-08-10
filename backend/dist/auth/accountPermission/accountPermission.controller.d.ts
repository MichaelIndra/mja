import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
import { AccountPermission } from './accountPermission.entity';
import { AccountPermissionService } from './accountPermission.service';
export declare class AccountPermissionController implements CrudController<AccountPermission> {
    service: AccountPermissionService;
    constructor(service: AccountPermissionService);
    get base(): CrudController<AccountPermission>;
    getMany(req: CrudRequest): Promise<AccountPermission[] | import("@nestjsx/crud").GetManyDefaultResponse<AccountPermission>>;
    getOneAndDoStuff(req: CrudRequest): Promise<AccountPermission>;
    createOne(req: CrudRequest, dto: AccountPermission): Promise<AccountPermission>;
    createMany(req: CrudRequest, dto: CreateManyDto<AccountPermission>): Promise<AccountPermission[]>;
    coolFunction(req: CrudRequest, dto: AccountPermission): Promise<AccountPermission>;
    awesomePUT(req: CrudRequest, dto: AccountPermission): Promise<AccountPermission>;
    deleteOne(req: CrudRequest): Promise<void | AccountPermission>;
}
