export interface IRule {
  id?: string;
  name: string;
  type: string;
  description?: string | null;
  value?: string | null;

  created_at?: Date | null;
  updated_at?: Date | null;
}

export const InitRule: IRule = {
  name: '',
  type: '',
  description: null,
  value: null,
  created_at: null,
  updated_at: null,
};
