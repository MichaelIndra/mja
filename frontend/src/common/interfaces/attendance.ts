export interface IAttendance {
  id?: string;
  employee_id: string;
  employee_name: string;
  department_id: string;
  department_name: string;
  date_entry: string | Date | null;
  time_check_in?: string | Date | null;
  time_check_out_for_break?: string | Date | null;
  time_check_in_for_break?: string | Date | null;
  time_check_out?: string | Date | null;
  meta:string | JSON | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export const InitAttendance: IAttendance = {
  employee_id: '',
  employee_name: '',
  department_id: '',
  department_name: '',
  date_entry: null,
  time_check_in: null,
  time_check_out_for_break: null,
  time_check_in_for_break: null,
  time_check_out: null,
  meta: null,
  created_at: null,
  updated_at: null,
};
