export interface IEmployee {
  id?: string;
  nik: string | null;
  name: string;
  npwp_id: string | number;
  bpjs_id: string | number;
  address?: string | null;
  date_entry?: string | Date | null;
  active?: boolean;
  active_date: string | Date | null;
  department_id?: string | null;
  department?: any;
  group_id?: string | null;
  area_id?: string | null;
  position_id?: string | null;
  picture?: string | null;
  date_of_birth?: string | null;
  phone_no?: string | null;
  status?: string | null;
  meta?: any | null;
  loans?: any | null;
  total_loan?: any | null;
  latestLoan?: any | null;

  created_at?: string | Date;
  updated_at?: string | Date;
}

export const InitEmployee: IEmployee = {
  nik: null,
  name: '',
  address: null,
  npwp_id: '',
  bpjs_id: '',
  date_entry: new Date().toISOString().substr(0, 10),
  active: false,
  // active_date: new Date().toISOString().substr(0, 10),
  active_date: '',
  department_id: null,
  department: null,
  group_id: null,
  area_id: null,
  position_id: null,
  picture: '',
  date_of_birth: '',
  phone_no: '',
  status: '',
  meta: {
    rawData: {},
    payslip: {
      value_extra_full: 0,
      value_holiday: 0,
      value_food_deduction: 0,
      value_bon_deduction: 0,
      value_extra_work: 0,
      value_driver_extra: 0,
      // additional value #246
      // indicator this employee get reward or not
      insentif: 0,
      // extra tambahan kerja (toko bulanan)
      extra_full: {
        nominal: 0,
        indicator: false,
      },
      value_day_7: {
        nominal: 0,
        indicator: false,
      },
      extra_sunday: {
        nominal: 0,
        indicator: false,
      },
      owner_special_insentif: 0,
      owner_additional: 0,
      owner_overtime: 0,
      astek_deduction: 0,
      spsi_deduction: 0,
    },
  },

  created_at: new Date().toISOString().substr(0, 10),
  updated_at: '',
};
