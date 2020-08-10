import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
import { AccountRole } from './accountRole.entity';
import { AccountRoleService } from './accountRole.service';
export declare class AccountRoleController implements CrudController<AccountRole> {
    service: AccountRoleService;
    constructor(service: AccountRoleService);
    get base(): CrudController<AccountRole>;
    getMany(req: CrudRequest): Promise<AccountRole[] | import("@nestjsx/crud").GetManyDefaultResponse<AccountRole>>;
    getOneAndDoStuff(req: CrudRequest): Promise<AccountRole>;
    createOne(req: CrudRequest, dto: AccountRole): Promise<AccountRole>;
    createMany(req: CrudRequest, dto: CreateManyDto<AccountRole>): Promise<AccountRole[]>;
    coolFunction(req: CrudRequest, dto: AccountRole): Promise<AccountRole>;
    awesomePUT(req: CrudRequest, dto: AccountRole): Promise<AccountRole>;
    deleteOne(req: CrudRequest): Promise<void | AccountRole>;
}
