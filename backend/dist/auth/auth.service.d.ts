import { AccountService } from '../auth/account/account.service';
import { JwtService } from '@nestjs/jwt';
import { Account } from '../auth/account/account.entity';
import { LoginDto, ResetPasswordDto, SendLinkResetPasswordDto } from './auth.dto';
export declare class AuthService {
    private readonly accountService;
    private readonly jwtService;
    constructor(accountService: AccountService, jwtService: JwtService);
    validateToken(token: string): Promise<Account>;
    private validate;
    login(account: LoginDto): Promise<any | {
        status: number;
    }>;
    register(account: Account): Promise<any>;
    resetPassword(dto: ResetPasswordDto): Promise<Account>;
    sendLinkResetPassword(dto: SendLinkResetPasswordDto): Promise<any>;
}
