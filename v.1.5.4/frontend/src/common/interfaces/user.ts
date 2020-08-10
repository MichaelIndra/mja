export interface IUser {
  id?: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  username: string;
  email: string | null;
  role: string;
  // role_ids: any[];
  roles: any[];
  branch_id: string;
  password: string;

  created_at?: Date | null;
  updated_at?: Date | null;
}

export const InitUser: IUser = {
  first_name: '',
  last_name: '',
  avatar: null,
  username: '',
  email: '',
  role: '',
  // role_ids: [],
  roles: [],
  branch_id: '',
  password: '',

  created_at: null,
  updated_at: null,
};
