import { BaseEntity } from '../base.entity';
import { Employee } from '../employee/employee.entity';
import { Group } from './group/group.entity';
import { Area } from './area/area.entity';
import { Branch } from '../branch/branch.entity';
import { Outcome } from '../outcome/outcome.entity';
export declare class Department extends BaseEntity {
    name: string;
    branch_id: string;
    branch: Branch;
    meta: any;
    employees: Employee[];
    outcomes: Outcome[];
    groups: Group[];
    areas: Area[];
    protected beforeInsert(): void;
}
