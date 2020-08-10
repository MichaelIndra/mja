import { BaseEntity } from '../base.entity';
import { Employee } from '../employee/employee.entity';
import { MetaPayslip } from './paySlip.dto';
import { Account } from '../auth/account/account.entity';
export declare class PaySlip extends BaseEntity {
    start_at: Date;
    end_at: Date;
    print_at: Date;
    employee_id: string;
    employee: Employee;
    employee_meta: any;
    base_salary: string;
    total_day: string;
    daily_base_salary: string;
    total_base_daily: string;
    total_base: string;
    total_reward: string;
    total_deduction: string;
    total: string;
    payslip_meta: MetaPayslip;
    created_by_id: string;
    created_by: Account;
    protected beforeInsert(): void;
}
