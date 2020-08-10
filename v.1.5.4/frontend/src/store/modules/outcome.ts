import {
  createOutcome,
  fetchOneOutcome,
  fetchOutcome,
  getOutcomePerDepartment,
} from '@/common/api/outcome';
import {
  formatDate,
  formatPrice,
  openSnackbarNow,
} from '@/common/utils/config';
import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

export interface IOutcomeState {
  outcomes: any;
  outcome: any;
  employeeOutcome: any;
  isOutcomeGenerated: boolean;
  totalData: number;
}

@Module({ dynamic: true, store, name: 'OutcomeStore' })
class Outcome extends VuexModule implements IOutcomeState {
  outcomes: any = [];
  outcome: any = [];
  employeeOutcome: any = [];
  isOutcomeGenerated: boolean = false;
  isOutcomeLoading: boolean = false;
  totalData: number = 0;
  outcomePerDepartment: any = [];

  @Action async generateOutcomePayslip(data: any) {
    try {
      this.SET_LOADING_OUTCOME(true);
      const outcome: any = await createOutcome(data);
      this.SET_LOADING_OUTCOME(false);
    } catch (err) {
      this.SET_LOADING_OUTCOME(false);
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'error',
        message: err.response
          ? err.response.data.message
          : err.message
          ? err.message
          : JSON.stringify(err),
      });
    }
  }

  @Action async getDataOutcomes(params: any) {
    try {
      this.SET_LOADING_OUTCOME(true);

      await this.context.dispatch('setParamsGlobal', params);
      const res: any = await fetchOutcome(params);
      await this.context.dispatch('setPagination', res);

      if (res.data && res.data.length > 0) {
        this.SET_OUTCOME_LIST(res.data);
      } else if (res.length > 0) {
        this.SET_OUTCOME_LIST(res);
      } else {
        this.SET_OUTCOME_LIST([]);
      }

      this.SET_TOTAL_DATA(res.total);
      this.SET_LOADING_OUTCOME(false);
    } catch (err) {
      this.SET_LOADING_OUTCOME(false);
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'error',
        message: err.response
          ? err.response.data.message
          : err.message
          ? err.message
          : JSON.stringify(err),
      });
    }
  }

  @Action async findDataOutcome(reportId: string) {
    try {
      this.SET_LOADING_OUTCOME(true);
      const outcome: any = await fetchOneOutcome(reportId);
      this.SET_OUTCOME_DATA(outcome);
      this.SET_OUTCOME_DATA_EMPLOYEE(outcome.employee_payslip);
      this.SET_LOADING_OUTCOME(false);
    } catch (error) {
      this.SET_LOADING_OUTCOME(false);
    }
  }

  @Action async getOutcomePerDepartment(params: any) {
    try {
      this.SET_LOADING_OUTCOME(true);

      // await this.context.dispatch('setParamsGlobal', params);
      const res: any = await getOutcomePerDepartment(params);

      if (res.data && res.data.length > 0) {
        this.SET_OUTCOME_PER_DEPARTMENT_LIST(res.data);
      } else if (res.length > 0) {
        this.SET_OUTCOME_PER_DEPARTMENT_LIST(res);
      } else {
        this.SET_OUTCOME_PER_DEPARTMENT_LIST([]);
      }

      this.SET_LOADING_OUTCOME(false);
    } catch (err) {
      this.SET_LOADING_OUTCOME(false);
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'error',
        message: err.response
          ? err.response.data.message
          : err.message
          ? err.message
          : JSON.stringify(err),
      });
    }
  }

  @Mutation SET_OUTCOME_PER_DEPARTMENT_LIST(data: any) {
    this.outcomePerDepartment = data;
  }

  @Mutation SET_OUTCOME_DATA_EMPLOYEE(data: any) {
    this.employeeOutcome = data.map((el: any) => {
      return {
        ...el,
        pendapatan_gaji: el.from_owner
          ? formatPrice(el.tambahan_owner)
          : formatPrice(el.pendapatan_gaji),
        dari_owner: el.from_owner ? true : false,
      };
    });
  }

  @Mutation SET_OUTCOME_DATA(outcome: any) {
    let total_owner: number = 0;
    outcome.employee_payslip.forEach((data: any) => {
      if (data.from_owner) {
        total_owner += data.pendapatan_buku_2 - data.potongan_buku_2;
      }
    });
    this.outcome = {
      ...outcome,
      start_at: formatDate(outcome.start_at, 'short-date'),
      end_at: formatDate(outcome.end_at, 'short-date'),
      nominal_per_period_hr: formatPrice(
        outcome.nominal_per_period - total_owner,
      ),
      nominal_per_period: formatPrice(outcome.nominal_per_period),
      nominal_per_period_owner: formatPrice(total_owner),
      employee_count: outcome.employee_payslip.length + ' Karyawan',
    };
  }

  @Mutation SET_LOADING_OUTCOME(data: boolean) {
    this.isOutcomeLoading = data;
  }

  @Mutation SET_OUTCOME_LIST(dataOutcomes: any) {
    const employees: any = dataOutcomes.map((el: any) => {
      let total_owner: number = 0;
      el.employee_payslip.forEach((data: any) => {
        if (data.from_owner) {
          total_owner += data.total_pendapatan - data.total_potongan;
        }
      });
      return {
        ...el,
        start_at: formatDate(el.start_at, 'short-date'),
        end_at: formatDate(el.end_at, 'short-date'),
        nominal_per_period: formatPrice(el.nominal_per_period),
        nominal_per_period_owner: formatPrice(total_owner),
        employee_count: el.employee_payslip.length + ' Karyawan',
      };
    });
    this.outcomes = employees;
  }

  @Mutation SET_IS_OUTCOME_GENERATED(data: any) {
    this.isOutcomeGenerated = data;
  }

  @Mutation
  private SET_TOTAL_DATA(value: any) {
    this.totalData = value;
  }
}

export const OutcomeStore = getModule(Outcome);
