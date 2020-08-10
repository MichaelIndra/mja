export declare class LoginDto {
    username: string;
    password: string;
}
export declare class UpdatePasswordDto {
    password: string;
    re_password: string;
}
export declare class ResetPasswordDto extends UpdatePasswordDto {
    email: string;
    token: string;
}
export declare class RandomResetPasswordDto {
    email: string;
}
export declare class LinkResetPasswordDto {
    email: string;
    redirect_url?: string;
}
export declare class SendLinkResetPasswordDto {
    email: string;
    randomize?: number;
    redirect_url?: string;
}
