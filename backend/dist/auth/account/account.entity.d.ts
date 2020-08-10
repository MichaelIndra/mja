import { BaseEntity } from '../../base.entity';
import { Employee } from '../../employee/employee.entity';
import { AccountRole } from '../accountRole/accountRole.entity';
import { AccountPermission } from '../accountPermission/accountPermission.entity';
import { Branch } from '../../branch/branch.entity';
import { PaySlip } from '../../paySlip/paySlip.entity';
import { Log } from '../../log/log.entity';
import { Loan } from '../../loan/loan.entity';
export declare class Account extends BaseEntity {
    first_name: string;
    last_name?: string;
    avatar?: string;
    username: string;
    email: string;
    branch_id: string;
    branch: Branch;
    employees: Employee[];
    account_roles: AccountRole[];
    account_permissions: AccountPermission[];
    payslips: PaySlip[];
    logs: Log[];
    loans: Loan[];
    hashPassword(): void;
    password: string;
    token_reset_password?: string | null;
    protected beforeInsert(): void;
}
