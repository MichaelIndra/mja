import { BaseEntity } from '../../../base.entity';
import { Area } from '../area.entity';
import { Employee } from '../../../employee/employee.entity';
export declare class Position extends BaseEntity {
    name: string;
    bonus?: string | null;
    area_id: string;
    area: Area;
    employees: Employee[];
    protected beforeInsert(): void;
}
