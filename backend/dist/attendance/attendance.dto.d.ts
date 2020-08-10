export declare class CreateAttendanceDto {
    employee_id?: string;
    employee_nik?: string;
    time_check_in: Date;
    time_check_out: Date;
    time_check_out_for_break: Date;
    time_check_in_for_break: Date;
    meta: any;
}
export declare class CreateManyAttendanceDto {
    bulk: CreateAttendanceDto[];
}
