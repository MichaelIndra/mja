import { Account } from './account.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { LoginDto, ResetPasswordDto, UpdatePasswordDto, SendLinkResetPasswordDto } from '../auth.dto';
import { AccountDto } from './account.dto';
import { RoleService } from '../role/role.service';
import { AccountRoleService } from '../accountRole/accountRole.service';
import { UpdateResult } from 'typeorm';
import { MailService } from '../../services/mail.service';
export declare class AccountService extends TypeOrmCrudService<Account> {
    private readonly roleService;
    private readonly accountRoleService;
    private readonly mailService;
    constructor(repo: any, roleService: RoleService, accountRoleService: AccountRoleService, mailService: MailService);
    createWithRole(account: AccountDto): Promise<Account>;
    findByRoleId(id: string): Promise<any>;
    updateWithRole(id: string, dto: AccountDto): Promise<Account>;
    findByEmail(email: string): Promise<Account>;
    login(auth: LoginDto): Promise<Account>;
    findById(id: number): Promise<Account>;
    create(user: Account): Promise<Account>;
    sendLinkResetPassword(dto: SendLinkResetPasswordDto): Promise<any>;
    resetPassword(dto: ResetPasswordDto): Promise<any>;
    updatePassword(id: string, dto: Partial<UpdatePasswordDto>): Promise<UpdateResult>;
}
