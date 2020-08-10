import { BaseEntity } from '../base.entity';
export declare class Schedule extends BaseEntity {
    id_schedule: string;
    time_of_entry: Date;
    time_of_out: Date;
    time_start_break: Date;
    time_end_break: Date;
    protected beforeInsert(): void;
}
