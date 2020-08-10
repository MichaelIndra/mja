import {
  createBulkLoan,
  createLoan,
  fetchLoan,
  fetchTotalLoan,
} from '@/common/api/loan';
import { ILoan, InitLoan } from '@/common/interfaces/loan';
import { openSnackbarNow } from '@/common/utils/config';
import { handleError } from '@/common/utils/handleError';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import store from '../../store';

export interface ILoanState {
  listLoans: ILoan[];
  loan: ILoan;
  isLoadingLoan: boolean;
  totalLoanByDepartment: any;
}

@Module({ dynamic: true, store, name: 'LoanStore' })
class Loan extends VuexModule implements ILoanState {
  listLoans = [InitLoan];
  loan = InitLoan;
  isLoadingLoan = false;
  totalData = 0;
  totalLoanByDepartment = {};

  @Action
  async getListLoan(query: any) {
    try {
      this.SET_LIST_LOAN([]);
      this.SET_LOADING_LOAN(true);
      const res: any = await fetchLoan(query);
      if (Array.isArray(res)) {
        this.SET_LIST_LOAN(res);
        this.SET_TOTAL_DATA(res.length);
      } else if (Array.isArray(res.data)) {
        this.SET_LIST_LOAN(res.data);
        this.SET_TOTAL_DATA(res.total);
      }
      this.SET_LOADING_LOAN(false);
    } catch (err) {
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'error',
        message: handleError(err),
      });
      this.SET_LOADING_LOAN(false);
    }
  }

  @Action
  async setLoanData(data: ILoan) {
    try {
      this.SET_LOADING_LOAN(true);
      await createLoan(data);
      this.SET_LOADING_LOAN(false);
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'success',
        message: 'Berhasil menambahkan data',
      });
    } catch (err) {
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'error',
        message: handleError(err),
      });
      this.SET_LOADING_LOAN(false);
    }
  }

  @Action
  async setBulkLoanData(data: ILoan[]) {
    try {
      this.SET_LOADING_LOAN(true);
      await createBulkLoan(data);
      this.SET_LOADING_LOAN(false);
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'success',
        message: 'Berhasil menambahkan data',
      });
    } catch (err) {
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'error',
        message: handleError(err),
      });
      this.SET_LOADING_LOAN(false);
    }
  }

  @Action
  setInitLoan() {
    this.SET_LOAN_DATA();
  }

  @Action
  async getTotalLoanByDepartment() {
    try {
      this.SET_LOADING_LOAN(true);
      const res: any = await fetchTotalLoan();
      if (Array.isArray(res)) {
        this.SET_TOTAL_LOAN_BY_DEPARTMENT(res);
      }
      this.SET_LOADING_LOAN(false);
    } catch (err) {
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'error',
        message: handleError(err),
      });
      this.SET_LOADING_LOAN(false);
    }
  }
  @Mutation
  SET_LIST_LOAN(data: any) {
    this.listLoans = data;
  }

  @Mutation
  SET_LOAN_DATA() {
    this.loan = InitLoan;
  }

  @Mutation
  SET_TOTAL_DATA(number: number) {
    this.totalData = number;
  }

  @Mutation
  SET_LOADING_LOAN(type: boolean) {
    this.isLoadingLoan = type;
  }

  @Mutation
  SET_TOTAL_LOAN_BY_DEPARTMENT(totalLoan: any) {
    this.totalLoanByDepartment = totalLoan;
  }
}

export const LoanStore = getModule(Loan);
