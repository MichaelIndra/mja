import { Account } from '../auth/account/account.entity';
import { Repository } from 'typeorm';
import { Branch } from '../branch/branch.entity';
import { Role } from '../auth/role/role.entity';
import { AccountRole } from '../auth/accountRole/accountRole.entity';
export declare class InitService {
    private readonly accountRepository;
    private readonly branchRepository;
    private readonly roleRepository;
    private readonly accountRoleRepository;
    constructor(accountRepository: Repository<Account>, branchRepository: Repository<Branch>, roleRepository: Repository<Role>, accountRoleRepository: Repository<AccountRole>);
    createBranch(): Promise<any>;
    createRole(): Promise<any>;
    createAccount(): Promise<any>;
    createAccountRole(): Promise<any>;
}
