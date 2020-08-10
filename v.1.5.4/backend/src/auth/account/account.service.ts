import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { LoginDto, ResetPasswordDto, UpdatePasswordDto, SendLinkResetPasswordDto } from '../auth.dto';
import { AccountDto } from './account.dto';
import { RoleService } from '../role/role.service';
import { AccountRoleService } from '../accountRole/accountRole.service';
import {encryptPassword, generateToken} from '../../utils/encrypt';
import { UpdateResult } from 'typeorm';
import { MailService } from '../../services/mail.service';
import { EFeatureList } from '../../services/feature.enum';
import * as cryptoRandomString from 'crypto-random-string';

@Injectable()
export class AccountService extends TypeOrmCrudService<Account> {
  constructor(
    @InjectRepository(Account) repo,
    private readonly roleService: RoleService,
    private readonly accountRoleService: AccountRoleService,
    private readonly mailService: MailService,
  ) {
    super(repo);
  }

  async createWithRole(account: AccountDto): Promise<Account> {
    let isAccountExist = await this.repo.findOne({
      where: {
        username: account.username.toLowerCase(),
      },
    });
    if (isAccountExist) {
      throw new HttpException('Username already taken.', 400);
    }
    isAccountExist = await this.repo.findOne({
      where: {
        email: account.email.toLowerCase(),
      },
    });
    if (isAccountExist) {
      throw new HttpException('Email already taken.', 400);
    }
    // account.password = encryptPassword(account.password);
    const created = await this.repo.create(account);
    const createdAccount = await this.repo.save(created);
    delete createdAccount.password;
    try {
      for (const temp of account.roles) {
        if (!this.findByRoleId(temp.id)) {
          throw new NotFoundException('Role not found');
        }
        const accountRoleData: any = {
          account_id: createdAccount.id,
          role_id: temp,
        };
        await this.accountRoleService.create(accountRoleData);
      }
    } catch (e) {
      await this.repo.delete(createdAccount);
      throw new HttpException(`Already exists ${e}`, 400);
    }
    return createdAccount;
  }

  async findByRoleId(id: string): Promise<any> {
    return this.roleService.findOne({
      where: {
        role_id: id,
      },
    });
  }

  async updateWithRole(id: string, dto: AccountDto): Promise<Account> {
    const account = await this.repo.findOne({
      where: {
        id,
      },
      relations: ['account_roles'],
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    const accountRoleIds = account.account_roles.map(item => item.id);
    if (
      accountRoleIds &&
      Array.isArray(accountRoleIds) &&
      accountRoleIds.length > 0
    ) {
      await this.accountRoleService.delete(accountRoleIds);
    }
    try {
      for (const temp of dto.roles) {
        if (!this.findByRoleId(temp.id)) {
          throw new NotFoundException('Role not found');
        }
        const accountRoleData: any = {
          account_id: id,
          role_id: temp,
        };
        await this.accountRoleService.create(accountRoleData);
      }
    } catch (err) {
      throw new HttpException(JSON.stringify(err), 400);
    }
    delete dto.roles;
    if (dto.password) dto.password = encryptPassword(dto.password);
    await this.repo.update(account.id, dto);
    let res: any = await this.repo.findOne({
      where: { id },
      relations: ['account_roles', 'account_roles.role'],
    });
    delete res.password;
    const roles = res.account_roles.map(el => el.role);
    res = {
      ...res,
      roles,
    };
    return res;
  }

  async findByEmail(email: string): Promise<Account> {
    return await this.repo.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  async login(auth: LoginDto): Promise<Account> {
    let account = await this.repo.findOne({
      where: {
        username: auth.username,
        password: auth.password,
      },
      relations: ['account_roles', 'account_roles.role', 'branch'],
    });
    if (!account) {
      account = await this.repo.findOne({
        where: {
          email: auth.username.toLowerCase(),
          password: auth.password,
        },
        relations: ['account_roles', 'account_roles.role', 'branch'],
      });
    }
    if (!account) {
      return account;
    }
    const roles: any[] = account.account_roles.map(item => item.role.name);
    const newAccount: any = {
      ...account,
      roles,
    };
    delete newAccount.account_roles;
    return newAccount;
  }

  async findById(id: number): Promise<Account> {
    return await this.repo.findOne({
      where: {
        id,
      },
    });
  }

  async create(user: Account): Promise<Account> {
    try {
      const created = await this.repo.create(user);
      const saved = await this.repo.save(created);
      delete saved.password;
      return saved;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async sendLinkResetPassword(dto: SendLinkResetPasswordDto): Promise<any> {
    try {
      // check email
      let account = await this.repo.findOne({
        where: {
          email: dto.email.toLowerCase(),
        },
      });
      if (!account) {
        account = await this.repo.findOne({
          where: {
            username: dto.email.toLowerCase(),
          },
        });
        if (!account) {
          throw new HttpException('Account is not found', 404);
        }
      }

      if (Number(dto.randomize) === 1) {
        const randomPassword = cryptoRandomString({ length: 8 });

        // set token into account
        await this.updatePassword(account.id, { password: randomPassword, re_password: randomPassword });
        // send email
        await this.mailService.send(account.email, 'Reset Password', { account, randomPassword }, EFeatureList.CHANGE_PASSWORD_RANDOM);

        return {
          status: 'OK',
          message: 'Success',
          data: {
            new_password: randomPassword,
          },
        };
      } else {
        // generate token
        const token = await generateToken();

        const baseUrl = dto.redirect_url ? dto.redirect_url : process.env.REDIRECT_URL_FORGOT_PASSWORD;
        const url = baseUrl + '?token=' + token + '&email=' + account.email;
        // set token into account
        await this.repo.update(account.id, { token_reset_password: token });
        // send email
        await this.mailService.send(account.email, 'Forgot Password', { account, url }, EFeatureList.FORGOT_PASSWORD);

        return {
          status: 'OK',
          message: 'Success',
        };
      }

    } catch (err) {
      return Promise.reject(err);
    }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<any> {
    try {
      const account = await this.repo.findOne({
        where: {
          email: dto.email.toLowerCase(),
          token: dto.token,
        },
      });
      if (!account) {
        throw new HttpException('Email and token is not valid.', 400);
      }
      return await this.updatePassword(account.id, { ...dto });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updatePassword(id: string, dto: Partial<UpdatePasswordDto>): Promise<UpdateResult> {
    try {
      const changedPassword = encryptPassword(dto.password);
      if (dto.password !== dto.re_password) {
        throw new HttpException('Password and confirmation password doesn\'t match', 400);
      }
      return await this.repo.update(id, { password: changedPassword, token_reset_password: null });
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
