import {
  createLeave,
  deleteLeave,
  fetchLeaves,
  fetchOneLeave,
  updateLeave,
} from '@/common/api/leave';
import { createOutcome } from '@/common/api/outcome';
import {
  createPayslipBulk,
  fetchOnePayslip,
  fetchPayslip,
  fetchPayslipOvertime,
  updatePayslipBulk,
} from '@/common/api/payslip';
import {
  convertSecondToTimeRound,
  formatDate,
  formatPrice,
  openSnackbarNow,
} from '@/common/utils/config';
import { calculateWorkingDays } from '@/common/utils/timeCalculation';
import store from '@/store';
import moment from 'moment';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
export interface IPayslipState {
  listPayslip: any[];
  loadingPayslip: boolean;
  listPayslipReport: any;
  listPayslipCount: number;
  outcomeThisMonth: number;
  outcomePreviousMonth: number;
  selectedPayslip: any;
  payslip: any;
  totalData: number;
  isLoading: boolean;
}

@Module({ dynamic: true, store, name: 'PayslipStore' })
class Payslip extends VuexModule implements IPayslipState {
  listPayslip: any = [];
  loadingPayslip: boolean = false;
  listPayslipReport: any = [];
  listPayslipReportOvertime: any = [];
  listPayslipReportLeave: any = [];
  listPayslipCount: number = 0;
  listOvertimeReport: any = [];
  outcomeThisMonth: number = 0;
  outcomePreviousMonth: number = 0;
  selectedPayslip: any = 0;
  payslip: any = [];
  detailPayslip: any = {};
  isPayslipGenerated: boolean = false;
  isOutcomeGenerated: boolean = false;
  totalData: number = 0;
  isLoading: boolean = false;
  detailPayslipReport: any = [];
  detailType: string = '';
  totalNominal: number = 0;

  @Action
  async getOnePayslip(id: any) {
    this.SET_LOADING_PAYSLIP(true);
    const res: any = await fetchOnePayslip(id);
    this.SET_LOADING_PAYSLIP(false);
    this.SET_PAYSLIP_DETAIL(res);
    this.SET_PAYSLIP(res);
  }

  @Action
  async generatePayslip(data: any) {
    try {
      if (data.bulk.length === 0) {
        this.SET_IS_PAYSLIP_GENERATED(true);
      } else {
        this.SET_LOADING_PAYSLIP(true);
        const updateBulk = data.bulk.filter((payslipItem: any) => {
          if (payslipItem.id) {
            return payslipItem;
          }
        });
        let res: any = {};
        if (updateBulk.length > 0) {
          data.bulk = updateBulk;
          res = await updatePayslipBulk(data);
        } else {
          res = await createPayslipBulk(data);
        }
        this.SET_LOADING_PAYSLIP(false);
        if (res.length > 0) {
          this.SET_PAYSLIP_BULK(res);
        } else {
          this.SET_PAYSLIP_BULK([]);
        }
        openSnackbarNow({
          value: true,
          timeout: 6000,
          color: 'success',
          message: 'Berhasil menyimpan payslip',
        });
        this.SET_IS_PAYSLIP_GENERATED(true);
      }
    } catch (err) {
      this.SET_LOADING_PAYSLIP(false);
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
      this.SET_IS_PAYSLIP_GENERATED(false);
    }
  }

  @Action
  async getPayslipReportOvertime(params: any) {
    this.SET_LOADING_PAYSLIP(true);
    await this.context.dispatch('setParamsGlobal', params);
    const res: any = await fetchPayslipOvertime(params);
    await this.context.dispatch('setPagination', res);
    if (res.data && res.data.length > 0) {
      this.SET_PAYSLIP_BULK(res.data);
    } else {
      this.SET_PAYSLIP_BULK([]);
    }
    if (res.report && res.report.length > 0) {
      this.SET_OVERTIME_REPORT(res.report);
    }
    this.SET_TOTAL_DATA(res.total);
    this.SET_LOADING_PAYSLIP(false);
  }

  @Action
  async getPayslipReport(params: any) {
    this.SET_LOADING_PAYSLIP(true);
    await this.context.dispatch('setParamsGlobal', params);
    const res: any = await fetchPayslip(params);
    await this.context.dispatch('setPagination', res);
    if (res.data && res.data.length > 0) {
      this.SET_PAYSLIP_BULK(res.data);
    } else {
      this.SET_PAYSLIP_BULK([]);
    }
    if (res.report && res.report.length > 0) {
      this.SET_OVERTIME_REPORT(res.report);
    }
    this.SET_TOTAL_DATA(res.total);
    this.SET_LOADING_PAYSLIP(false);
  }

  @Action
  async getPayslipReportThisMonth(params: any) {
    this.SET_LOADING_PAYSLIP(true);
    const res: any = await fetchPayslip(params);
    this.SET_LOADING_PAYSLIP(false);
    if (res.length > 0) {
      this.SET_PAYSLIP_BULK_THIS_MONTH(res);
    } else {
      this.SET_PAYSLIP_BULK_THIS_MONTH([]);
    }
  }

  @Action
  async getPayslipReportPreviousMonth(params: any) {
    this.SET_LOADING_PAYSLIP(true);
    const res: any = await fetchPayslip(params);
    this.SET_LOADING_PAYSLIP(false);
    if (res.length > 0) {
      this.SET_PAYSLIP_BULK_PREVIOUS_MONTH(res);
    } else {
      this.SET_PAYSLIP_BULK_PREVIOUS_MONTH([]);
    }
  }

  @Action
  setListPayslipTemp(data: any) {
    this.SET_LOADING_PAYSLIP(true);
    this.CLEAR_PAYSLIP_COUNT();
    this.SET_ALL_LIST_PAYSLIP(data);
    this.SET_LOADING_PAYSLIP(false);
  }

  @Action
  setPayslipTemp(data: any) {
    this.PUSH_PAYSLIP(data);
  }

  @Action
  updatePayslipTemp(data: any) {
    this.UPDATE_PAYSLIP(data);
  }

  @Action
  removePayslipTemp() {
    this.REMOVE_PAYSLIP();
  }

  @Action
  resetListPayslip() {
    this.RESET_LIST_PAYSLIP();
  }

  @Action
  setIsPayslipGenerate(data: boolean) {
    this.SET_IS_PAYSLIP_GENERATED(data);
  }

  @Action
  setDetailPayslipReport(data: any) {
    this.SET_DETAIL_REPORT(data);
  }

  @Action
  setDetailType(data: any) {
    this.SET_DETAIL_TYPE(data);
  }

  @Mutation
  SET_DETAIL_TYPE(data: string) {
    this.detailType = data;
  }

  @Mutation
  SET_PAYSLIP_DETAIL(data: any) {
    this.totalNominal = 0;
    if (this.detailType === 'overtime') {
      this.detailPayslipReport = data.payslip_meta.employee_overtimes.map(
        (el: any) => {
          this.totalNominal += el.daily_salary + el.overtime_cost;

          return {
            ...el,
            overtime_cost: formatPrice(el.overtime_cost),
            salary: formatPrice(el.daily_salary),
            total_salary: formatPrice(el.daily_salary + el.overtime_cost),
            time_check_in: formatDate(el.time_check_in, 'short-date'),
            duration: convertSecondToTimeRound(
              calculateWorkingDays(
                el.total_overtime + el.total_overtime_early,
                1800,
              ).result,
            ),
          };
        },
      );
    } else if (this.detailType === 'deduction') {
      this.detailPayslipReport = data.payslip_meta.employee_deductions.map(
        (el: any) => {
          this.totalNominal += el.cost;

          let total_late = 0;
          let total_leave = 0;
          let nominal_late = 0;
          let nominal_leave = 0;
          if (el.type === 'both') {
            total_late += el.total_late;
            nominal_late += el.cost;
            total_leave += el.total_leave;
            nominal_leave += el.nominal_leave;
          } else if (el.type === 'late') {
            total_late += el.total_late;
            nominal_late += el.cost;
          } else if (el.type === 'leave') {
            total_leave += el.total_leave;
            nominal_leave += el.cost;
          }
          return {
            ...el,
            time_check_in: formatDate(el.time_check_in, 'short-date'),
            total_late: convertSecondToTimeRound(total_late),
            nominal_late: formatPrice(nominal_late),
            total_leave: convertSecondToTimeRound(total_leave),
            nominal_leave: formatPrice(nominal_leave),
            total: formatPrice(el.cost),
          };
        },
      );
    }
  }

  @Mutation
  SET_DETAIL_REPORT(data: any) {
    if (data.type === 'overtime') {
      this.detailPayslipReport = data.map((el: any) => {
        console.info('overtime', el);
        return el;
      });
    } else if (data.type === 'deduction') {
      this.detailPayslipReport = data.map((el: any) => {
        console.info('deduction', el);
        return el;
      });
    }
  }

  @Mutation
  SET_IS_PAYSLIP_GENERATED(data: any) {
    this.isPayslipGenerated = data;
  }

  @Mutation
  SET_PAYSLIP(res: any) {
    const payslip_type: any = res.employee_meta.department.meta.payslip_type;
    const payslip_filter: any =
      res.employee_meta.department.meta.payslip_filter;

    this.detailPayslip = {
      name: res.employee_meta.name,
      department: res.employee_meta.department.name,
      periode: `${formatDate(res.start_at, 'medium')} - ${formatDate(
        res.end_at,
        'medium',
      )}`,
      payslip_type,
      payslip_filter,
    };

    if (payslip_type === '1' && payslip_filter === 1) {
      const detail: any = res.employee_meta.attendances.map((el: any) => {
        el = {
          date: formatDate(el.date, 'long'),
          time_check_in: formatDate(el.time_check_in, 'timeShort'),
          break_start: formatDate(el.time_check_in_for_break, 'timeShort'),
          break_end: formatDate(el.time_check_out_for_break, 'timeShort'),
          time_check_out: formatDate(el.time_check_out, 'timeShort'),
          late: el.dailyDeduction
            ? el.dailyDeduction.calculated_duration + ' Jam'
            : '0 Jam',
          late_deduction: el.dailyDeduction
            ? formatPrice(Math.floor(el.dailyDeduction.cost))
            : 'Rp0',
          overtime: el.dailyOvertime
            ? el.dailyOvertime.value / 3600 + ' Jam'
            : '0 Jam',
          overtime_reward: el.dailyOvertime
            ? formatPrice(Math.floor(el.dailyOvertime.cost))
            : 'Rp0',
        };
        return el;
      });
      this.payslip = detail;
    } else if (payslip_type === '2' && payslip_filter === 1) {
      const detail: any = res.employee_meta.attendances.map((el: any) => {
        el = {
          date: formatDate(el.date, 'long'),
          time_check_in: formatDate(el.time_check_in, 'timeShort'),
          break_start: formatDate(el.time_check_in_for_break, 'timeShort'),
          break_end: formatDate(el.time_check_out_for_break, 'timeShort'),
          time_check_out: formatDate(el.time_check_out, 'timeShort'),
          late_deduction: el.dailyDeduction
            ? el.dailyDeduction.lateDeduction / 60 + ' Menit'
            : '0 Menit',
          cost_late_deduction: el.dailyDeduction
            ? formatPrice(Math.floor(el.dailyDeduction.costLateDeduction))
            : 0,
          leave_deduction: el.dailyDeduction
            ? el.dailyDeduction.leaveDeduction / 60 + ' Menit'
            : '0 Menit',
          cost_leave_deduction: el.dailyDeduction
            ? formatPrice(Math.floor(el.dailyDeduction.costLateDeduction))
            : 0,
        };
        return el;
      });
      this.payslip = detail;
    }
  }

  @Mutation
  MATCH_PAYSLIP_CURRENT(listPayslip: any) {
    let lists: any = [];
    lists = listPayslip.map((el: any) => {
      const find: any = this.listPayslipReport.filter((data: any) => {
        return data.employee_id !== el.id;
      });
      return el;
    });
    this.listPayslip = lists;
  }

  @Mutation
  MATCH_PAYSLIP(listPayslip: any) {
    let lists: any = [];
    lists = listPayslip.map((el: any) => {
      const find: any = this.listPayslipReport.find((data: any) => {
        return data.employee_id === el.id;
      });
      el = {
        ...el,
        temp_payslip_data: find,
      };
      return el;
    });
    this.listPayslip = lists;
  }

  @Mutation
  GET_ONE_PAYSLIP(index: string) {
    this.selectedPayslip = this.listPayslip[index];
  }

  @Mutation
  RESET_LIST_PAYSLIP() {
    this.listPayslip = [];
  }

  @Mutation
  private SET_PAYSLIP_BULK_THIS_MONTH(value: any) {
    this.outcomeThisMonth = 0;
  }

  @Mutation
  private SET_PAYSLIP_BULK_PREVIOUS_MONTH(value: any) {
    this.outcomePreviousMonth = 0;
  }

  @Mutation
  private SET_LOADING_PAYSLIP(value: any) {
    this.loadingPayslip = value;
  }

  @Mutation
  private SET_PAYSLIP_BULK(value: any) {
    this.listPayslipReportOvertime = value.filter((el: any) => {
      // if (el.employee_meta.de  partment.meta.payslip_type === '1') {
      //   console.info('info', el);
      // }
      return el.employee_meta.department.meta.payslip_type === '1';
    });
    // this.listPayslipReportOvertime = value;
    this.listPayslipReportLeave = value;
  }

  @Mutation
  private SET_TOTAL_DATA(value: any) {
    this.totalData = value;
  }

  @Mutation
  private PUSH_PAYSLIP(data: any) {
    this.listPayslipCount += 1;
    this.listPayslip = this.listPayslip.map((el: any) => {
      if (el.id === data.id) {
        return {
          ...el,
          ...data,
        };
      }
      return el;
    });
  }

  @Mutation
  private UPDATE_PAYSLIP(data: any) {
    this.listPayslip = this.listPayslip.map((el: any) => {
      if (data.id === el.id) {
        return data;
      } else {
        return el;
      }
    });
  }

  @Mutation
  private SET_ALL_LIST_PAYSLIP(data: any) {
    this.listPayslip = [];
    this.listPayslip = data.map((item: any) => {
      if (
        item.payslips &&
        item.payslips.length > 0 &&
        !item.temp_payslip_data
      ) {
        if (item.payslips[0].payslip_meta.owner_payslip) {
          item = {
            ...item,
            temp_payslip_data: {
              ...item.payslips[0],
              owner_payslip: item.payslips[0].payslip_meta.owner_payslip,
            },
          };
        } else {
          item = {
            ...item,
            temp_payslip_data: item.payslips[0],
          };
        }
      }
      return item;
    });
  }

  @Mutation
  private CLEAR_PAYSLIP_COUNT() {
    this.listPayslipCount = 0;
  }

  @Mutation
  private REMOVE_PAYSLIP() {
    this.listPayslip = [];
  }

  @Mutation
  private SET_OVERTIME_REPORT(data: any) {
    this.listOvertimeReport = data;
  }
}

export const PayslipStore = getModule(Payslip);
