export interface IGroup {
  id?: string;
  name: string;
  base_salary: string;
  week_salary: string;
  day_salary: string;
  schedule: any;
  department_id: string;

  created_at?: Date | null;
  updated_at?: Date | null;
}

export const InitGroup: IGroup = {
  name: '',
  base_salary: '',
  week_salary: '',
  day_salary: '',
  schedule: {
    schedules: [
      {
        value: 0,
        active: false,
        start: '',
        end: '',
        start_one: '',
        start_two: '',
        end_one: '',
        end_two: '',
        flexible_break: false,
        error: false,
      },
      {
        value: 1,
        active: false,
        start: '',
        end: '',
        start_one: '',
        start_two: '',
        end_one: '',
        end_two: '',
        flexible_break: false,
        error: false,
      },
      {
        value: 2,
        active: false,
        start: '',
        end: '',
        start_one: '',
        start_two: '',
        end_one: '',
        end_two: '',
        flexible_break: false,
        error: false,
      },
      {
        value: 3,
        active: false,
        start: '',
        end: '',
        start_one: '',
        start_two: '',
        end_one: '',
        end_two: '',
        flexible_break: false,
        error: false,
      },
      {
        value: 4,
        active: false,
        start: '',
        end: '',
        start_one: '',
        start_two: '',
        end_one: '',
        end_two: '',
        flexible_break: false,
        error: false,
      },
      {
        value: 5,
        active: false,
        start: '',
        end: '',
        start_one: '',
        start_two: '',
        end_one: '',
        end_two: '',
        flexible_break: false,
        error: false,
      },
      {
        value: 6,
        active: false,
        start: '',
        end: '',
        start_one: '',
        start_two: '',
        end_one: '',
        end_two: '',
        flexible_break: false,
        error: false,
      },
    ],
  },
  department_id: '',

  created_at: null,
  updated_at: null,
};
