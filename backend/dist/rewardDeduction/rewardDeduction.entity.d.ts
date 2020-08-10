import { BaseEntity } from '../base.entity';
import { Employee } from '../employee/employee.entity';
export declare class RewardDeduction extends BaseEntity {
    employee_id: string;
    employee: Employee;
    name: string;
    type: string;
    description: string;
    date: string;
    value: string;
    protected beforeInsert(): void;
}
