import { AuthService } from './auth.service';
import { LoginDto, ResetPasswordDto, RandomResetPasswordDto, LinkResetPasswordDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(user: LoginDto): Promise<any>;
    sendLinkResetPassword(dto: LinkResetPasswordDto): Promise<any>;
    sendRandomResetPassword(dto: RandomResetPasswordDto): Promise<any>;
    resetPassword(dto: ResetPasswordDto): Promise<any>;
}
