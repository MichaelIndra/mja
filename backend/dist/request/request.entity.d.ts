import { BaseEntity } from '../base.entity';
export declare class Request extends BaseEntity {
    id_request: string;
    date: Date;
    nik: string;
    time_of_entry: Date;
    time_of_out: Date;
    time_start_break: Date;
    time_end_break: Date;
    description: string;
    protected beforeInsert(): void;
}
