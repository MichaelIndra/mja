export interface IAccountRole {
  id?: string;
  account_id: string;
  role_id: string;

  created_at?: Date | null;
  updated_at?: Date | null;
}

export const InitAccountRole: IAccountRole = {
  account_id: '',
  role_id: '',

  created_at: null,
  updated_at: null,
};
