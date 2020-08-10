export interface ILeave {
    id?: string;
    employee_id: string;
    employee_name: string;
    description: string;
    date_start?: string | Date | null;
    date_end?: string | Date | null;

    created_at?: Date | null;
    updated_at?: Date | null;
}

export const InitLeave: ILeave = {
    employee_id: '',
    employee_name: '',
    description: '',
    // date_start: new Date().toISOString().substr(0,10),
    date_start: '',
    date_end: null,
    created_at: null,
    updated_at: null,
};
