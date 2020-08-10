import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountDto } from './account.dto';
import { RoleService } from '../../auth/role/role.service';
export declare class AccountController implements CrudController<Account> {
    service: AccountService;
    private readonly roleService;
    constructor(service: AccountService, roleService: RoleService);
    get base(): CrudController<Account>;
    getMany(req: CrudRequest): Promise<any>;
    getOneAndDoStuff(req: CrudRequest): Promise<any>;
    createOne(dto: AccountDto): Promise<Account>;
    createMany(req: CrudRequest, dto: CreateManyDto<Account>): Promise<Account[]>;
    coolFunction(id: string, dto: AccountDto): Promise<any>;
    awesomePUT(id: string, dto: AccountDto): Promise<any>;
    deleteOne(req: CrudRequest): Promise<void | Account>;
}
