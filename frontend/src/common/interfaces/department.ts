export interface IDepartment {
  id?: string;
  name: string;
  branch_id: string;
  meta: any;
  errors: {
    name: boolean;
    branch_id: boolean;
    payslip_type: boolean;
    payslip_filter: boolean;
  };
  created_at?: Date | null | string;
  updated_at?: Date | null;
}

export const InitDepartment: IDepartment = {
  name: '',
  branch_id: '',
  meta: {
    payslip_type: '',
    payslip_filter: '',
  },
  created_at: null,
  updated_at: null,
  errors: {
    name: false,
    branch_id: false,
    payslip_type: false,
    payslip_filter: false,
  },
};
