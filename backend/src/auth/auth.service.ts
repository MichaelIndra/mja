import { Injectable } from '@nestjs/common';
import { AccountService } from '../auth/account/account.service';
import { JwtService } from '@nestjs/jwt';
import { Account } from '../auth/account/account.entity';
import { LoginDto, ResetPasswordDto, SendLinkResetPasswordDto } from './auth.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateToken(token: string): Promise<Account> {
    return await this.jwtService.verify(token);
  }

  private async validate(accountData: LoginDto): Promise<Account> {
    return await this.accountService.login(accountData);
  }

  public async login(account: LoginDto): Promise<any | { status: number }> {
    account = {
      ...account,
      password: crypto.createHmac('sha256', account.password).digest('hex'),
    };
    return this.validate(account).then(accountData => {
      if (!accountData) {
        return { status: 404, message: 'Login failed' };
      }
      delete accountData.password;
      const payload = {
        ...accountData,
      };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '1h',
        algorithm: 'HS256',
      });

      return {
        expires_in: 3600,
        access_token: accessToken,
        // data: payload,
        // status: 200,
      };
    });
  }

  public async register(account: Account): Promise<any> {
    try {
      return this.accountService.create(account);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<Account> {
    try {
      return await this.accountService.resetPassword(dto);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async sendLinkResetPassword(dto: SendLinkResetPasswordDto): Promise<any> {
    try {
      return await this.accountService.sendLinkResetPassword(dto);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
