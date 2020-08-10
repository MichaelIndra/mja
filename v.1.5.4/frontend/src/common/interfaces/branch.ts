export interface IBranch {
  id?: string;
  name: string;
  address: string;
  postal_code: string;
  telp: string;
  errors: {
    name: boolean;
    address: boolean;
    postal_code: boolean;
    telp: boolean;
  };
  created_at?: Date | null;
  updated_at?: Date | null;
}

export const InitBranch: IBranch = {
  name: '',
  address: '',
  postal_code: '',
  telp: '',
  errors: {
    name: false,
    address: false,
    postal_code: false,
    telp: false,
  },

  created_at: null,
  updated_at: null,
};
