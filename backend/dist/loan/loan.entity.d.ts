import { BaseEntity } from '../base.entity';
import { Employee } from '../employee/employee.entity';
import { Account } from '../auth/account/account.entity';
import { ELoanType } from './loan.enum';
export declare class Loan extends BaseEntity {
    employee_id: string;
    employee: Employee;
    created_by_id: string;
    created_by: Account;
    type: ELoanType;
    description: string;
    loan_date: Date;
    nominal: number;
    total_loan_before: number;
    total_loan_current: number;
    total_pay_before: number;
    total_pay_current: number;
    protected beforeInsert(): void;
}
