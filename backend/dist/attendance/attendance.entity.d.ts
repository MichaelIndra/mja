import { BaseEntity } from '../base.entity';
import { Employee } from '../employee/employee.entity';
export declare class Attendance extends BaseEntity {
    employee_id: string;
    employee: Employee;
    time_check_in: Date;
    time_check_out: Date;
    time_check_out_for_break: Date;
    time_check_in_for_break: Date;
    meta: any;
    protected beforeInsert(): void;
}
