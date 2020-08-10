import { BaseEntity } from '../base.entity';
import { Employee } from '../employee/employee.entity';
export declare class Leave extends BaseEntity {
    employee_id: string;
    employee: Employee;
    description: string;
    date_start: Date;
    date_end: Date;
    protected beforeInsert(): void;
}
