export interface IPayslip {
  id?: string;
  start_at: string;
  end_at: string;
  print_at: string;
  employee_id: string;
  employee_meta: any;
  base_salary: string;
  total_day: string;
  daily_base_salary: string;
  total_base_daily: string;
  total_base: string;
  total_reward: string;
  total_deduction: string;
  total: string;
  payslip_meta: {
    base: [];
    rewards: [];
    deductions: [];
  };
  created_by_id: string;

  created_at?: Date | null | string;
  updated_at?: Date | null;
}

export const Initpayslip: IPayslip = {
  start_at: '',
  end_at: '',
  print_at: '',
  employee_id: '',
  employee_meta: {},
  base_salary: '',
  total_day: '',
  daily_base_salary: '',
  total_base_daily: '',
  total_base: '',
  total_reward: '',
  total_deduction: '',
  total: '',
  payslip_meta: {
    base: [],
    rewards: [],
    deductions: [],
  },
  created_by_id: '',

  created_at: null,
  updated_at: null,
};
