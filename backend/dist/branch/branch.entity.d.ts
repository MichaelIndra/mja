import { BaseEntity } from '../base.entity';
import { Department } from '../department/department.entity';
import { Account } from '../auth/account/account.entity';
export declare class Branch extends BaseEntity {
    name: string;
    address?: string;
    postal_code?: string;
    telp?: string;
    departments: Department[];
    accounts: Account[];
    protected beforeInsert(): void;
}
