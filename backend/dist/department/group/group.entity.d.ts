import { BaseEntity } from '../../base.entity';
import { Department } from '../department.entity';
import { Employee } from '../../employee/employee.entity';
export declare class Group extends BaseEntity {
    name: string;
    base_salary?: string | null;
    week_salary?: string | null;
    day_salary?: string | null;
    schedule: any;
    department_id: string;
    department: Department;
    employees: Employee[];
    switchable?: boolean;
    protected beforeInsert(): void;
}
