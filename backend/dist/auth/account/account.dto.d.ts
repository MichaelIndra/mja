import { RoleDto } from '../../auth/role/role.dto';
export declare class AccountDto {
    first_name: string;
    last_name?: string;
    avatar?: string;
    username: string;
    password: string;
    email: string;
    roles: RoleDto[];
    hashPassword(): void;
}
