import { BaseEntity } from '../base.entity';
import { Account } from '../auth/account/account.entity';
import { Department } from '../department/department.entity';
export declare class Outcome extends BaseEntity {
    employee_payslip: any;
    created_by_id: string;
    created_by: Account;
    department_id: string;
    department: Department;
    start_at: Date;
    end_at: Date;
    nominal_per_period: number;
    protected beforeInsert(): void;
}
