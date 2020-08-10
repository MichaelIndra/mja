export interface IPosition {
  id?: string;
  name: string;
  bonus: number;
  area_id: string;
  errors: {
    bonus: boolean;
    name: boolean;
  };

  created_at?: Date | null | string;
  updated_at?: Date | null;
}

export const InitPosition: IPosition = {
  name: '',
  bonus: 0,
  area_id: '',
  errors: {
    bonus: false,
    name: false,
  },

  created_at: null,
  updated_at: null,
};
