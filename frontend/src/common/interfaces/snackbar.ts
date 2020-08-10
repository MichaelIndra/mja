export interface ISnackbar {
  value: boolean;
  color: string;
  timeout: number;
  message: string;
}

export const InitSnackbar: ISnackbar = {
  value: false,
  color: '',
  timeout: 4500,
  message: '',
};
