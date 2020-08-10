import { BaseEntity } from '../../base.entity';
import { Department } from '../department.entity';
import { Position } from './position/position.entity';
import { Employee } from '../../employee/employee.entity';
export declare class Area extends BaseEntity {
    name: string;
    bonus?: string | null;
    department_id: string;
    department: Department;
    positions: Position[];
    employees: Employee[];
    protected beforeInsert(): void;
}
