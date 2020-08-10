export interface IRole {
  id?: string;
  name: string;
  description: string;

  created_at?: Date | null;
  updated_at?: Date | null;
}

export const InitRole: IRole = {
  name: '',
  description: '',

  created_at: null,
  updated_at: null,
};
