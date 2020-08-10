import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../auth/account/account.entity';
import { Repository } from 'typeorm';
import { SeedData as accountDatas } from '../database/seeds/_1account/AccountSeed';
import { SeedData as branchDatas } from '../database/seeds/_4branch/BranchSeed';
import { SeedData as roleDatas } from '../database/seeds/_2role/RoleSeed';
import { SeedData as accountRoleDatas } from '../database/seeds/_3accountRole/AccountRoleSeed';
import { Branch } from '../branch/branch.entity';
import { Role } from '../auth/role/role.entity';
import { AccountRole } from '../auth/accountRole/accountRole.entity';

@Injectable()
export class InitService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(AccountRole)
    private readonly accountRoleRepository: Repository<AccountRole>,
  ) {}
  async createBranch(): Promise<any> {
    const branchesCreated = [];
    let totalExist = 0;
    for (const tmpData of branchDatas) {
      const isExist = await this.branchRepository.findOne({ name: tmpData.name });
      if (isExist) {
        totalExist++;
      } else {
        // const created = await this.branchRepository.create(tmpData);
        branchesCreated.push(tmpData);
      }
    }
    const saved = await this.branchRepository.save(branchesCreated);
    return {
      total_exist: totalExist,
      total_saved: saved.length,
      data_saved: saved,
    };
  }
  async createRole(): Promise<any> {
    const rolesCreated = [];
    let totalExist = 0;
    for (const tmpData of roleDatas) {
      const isExist = await this.roleRepository.findOne({ name: tmpData.name });
      if (isExist) {
        totalExist++;
      } else {
        // const created = await this.roleRepository.create(tmpData);
        rolesCreated.push(tmpData);
      }
    }
    const saved = await this.roleRepository.save(rolesCreated);
    return {
      total_exist: totalExist,
      total_saved: saved.length,
      data_saved: saved,
    };
  }
  async createAccount(): Promise<any> {
    // const listUsername = ['admin'];
    const listUsername = accountDatas.map(item => item.username);
    const newAccountDatas = accountDatas.filter(item => listUsername.includes(item.username));
    const accountsCreated = [];
    let totalExist = 0;
    for (const tmpData of newAccountDatas) {
      const isExist = await this.accountRepository.findOne({ username: tmpData.username });
      if (isExist) {
        totalExist++;
      } else {
        // const created = await this.accountRepository.create(tmpData);
        accountsCreated.push(tmpData);
      }
    }
    const saved = await this.accountRepository.save(accountsCreated);
    return {
      total_exist: totalExist,
      total_saved: saved.length,
      data_saved: saved,
    };
  }
  async createAccountRole(): Promise<any> {
    const accountRolesCreated = [];
    let totalExist = 0;
    for (const tmpData of accountRoleDatas) {
      const isAccountExist = await this.accountRepository.findOne({ id: tmpData.account_id });
      const isRoleExist = await this.roleRepository.findOne({ id: tmpData.role_id });
      if (isAccountExist && isRoleExist) {
        const isExist = await this.accountRoleRepository.findOne({ account_id: tmpData.account_id, role_id: tmpData.role_id });
        if (isExist) {
          totalExist++;
        } else {
          // const created = await this.accountRoleRepository.create(tmpData);
          accountRolesCreated.push(tmpData);
        }
      }
    }
    const saved = await this.accountRoleRepository.save(accountRolesCreated);
    return {
      total_exist: totalExist,
      total_saved: saved.length,
      data_saved: saved,
    };
  }
}
