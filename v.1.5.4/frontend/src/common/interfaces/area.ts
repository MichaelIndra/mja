export interface IArea {
  id?: string;
  name: string;
  bonus: number;
  department_id: string;
  errors: {
    bonus: boolean;
    name: boolean;
  };

  created_at?: Date | null | string;
  updated_at?: Date | null;
}

export const InitArea: IArea = {
  name: '',
  bonus: 0,
  department_id: '',
  errors: {
    bonus: false,
    name: false,
  },
  created_at: null,
  updated_at: null,
};
