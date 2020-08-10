export interface ILoan {
  id?: string;
  employee_id: string;
  created_by_id: string;
  type: string;
  loan_date: Date;
  nominal: 10000;

  created_at?: Date | null;
  updated_at?: Date | null;
}

export const InitLoan: ILoan = {
  employee_id: '',
  created_by_id: '',
  type: '',
  loan_date: new Date(),
  nominal: 10000,

  created_at: null,
  updated_at: null,
};
