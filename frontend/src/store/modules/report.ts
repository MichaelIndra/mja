import {
  fetchExpenseReport,
  fetchOutcomeExpenseReport,
  fetchOvertimeExpenseReport,
  getMostDiligentEmployeeMonthly,
  getMostLateEmployeeMonthly,
  getMostLateEmployeeWeekly,
} from '@/common/api/report';
import {
  convertSecondToTime,
  convertSecondToTimeEightHours,
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

export interface IReportState {
  isLoadingReportlate: boolean;
  totalExpense: any;
  employeeLateMonthly: any;
  employeeLateWeekly: any;
}

@Module({ dynamic: true, store, name: 'ReportStore' })
class Report extends VuexModule implements IReportState {
  totalExpense = {};
  isLoadingReportlate = false;
  employeeLateMonthly = [];
  employeeDiligentMonthly = [];
  employeeLateWeekly = [];
  totalOutcomeNow = {};
  totalOutcomePrevious = {};
  totalOvertimeNow = {};
  totalOvertimePrevious = {};

  @Action
  async getTotalOutcomeNow(params: any) {
    const res: any = await fetchOutcomeExpenseReport(params);
    this.SET_TOTAL_OUTCOME_EXPENSE({ res, type: 'now' });
  }

  @Action
  async getTotalOutcomePrevious(params: any) {
    const res: any = await fetchOutcomeExpenseReport(params);
    this.SET_TOTAL_OUTCOME_EXPENSE({ res, type: 'previous' });
  }

  @Action
  async getTotalOvertimeNow(params: any) {
    const res: any = await fetchOvertimeExpenseReport(params);
    this.SET_TOTAL_OVERTIME_EXPENSE({ res, type: 'now' });
  }

  @Action
  async getTotalOvertimePrevious(params: any) {
    const res: any = await fetchOvertimeExpenseReport(params);
    this.SET_TOTAL_OVERTIME_EXPENSE({ res, type: 'previous' });
  }

  @Action
  async getTotalExpense(data: any) {
    const res: any = await fetchExpenseReport(data);
    this.SET_TOTAL_EXPENSE(res);
  }

  @Action
  async getMostLateEmployeeMonthly(filter: any) {
    const res: any = await getMostLateEmployeeMonthly(filter);
    this.SET_MOST_LATE_EMPLOYEE_MONTHLY(res);
  }

  @Action
  async getMostDiligentEmployeeMonthly(filter: any) {
    const res: any = await getMostDiligentEmployeeMonthly(filter);
    this.SET_MOST_DILIGENT_EMPLOYEE_MONTHLY(res);
  }

  @Action
  async getMostLateEmployeeWeekly(filter: any) {
    const res: any = await getMostLateEmployeeWeekly(filter);
    this.SET_MOST_LATE_EMPLOYEE_WEEKLY(res);
  }

  @Mutation
  private SET_MOST_LATE_EMPLOYEE_MONTHLY(data: any) {
    const newData = data.map((el: any) => {
      return {
        ...el,
        late_duration: convertSecondToTime(el.late_duration),
        leave_duration: convertSecondToTime(el.leave_duration),
      };
    });
    this.employeeLateMonthly = newData;
  }

  @Mutation
  private SET_MOST_DILIGENT_EMPLOYEE_MONTHLY(data: any) {
    const newData = data.map((el: any) => {
      return {
        ...el,
        total_late: convertSecondToTime(el.total_late),
        total_leave: convertSecondToTime(el.total_leave),
        total_work: convertSecondToTimeEightHours(el.total_work),
      };
    });
    this.employeeDiligentMonthly = newData;
  }

  @Mutation
  private SET_MOST_LATE_EMPLOYEE_WEEKLY(data: any) {
    const newData = data.map((el: any) => {
      let overtimeLate = { result: 0, leftover: 0 };
      let overtimeDurationLate: number = 0;

      let overtimeLeave = { result: 0, leftover: 0 };
      let overtimeDurationLeave: number = 0;

      overtimeLate = calculateWorkingDays(el.late_duration, 1800);
      overtimeDurationLate += overtimeLate.result;
      overtimeLeave = calculateWorkingDays(el.leave_duration, 1800);
      overtimeDurationLeave += overtimeLeave.result;

      if (overtimeLate.leftover > 0 && overtimeLate.leftover < 1800) {
        overtimeDurationLate += 1800;
      } else if (overtimeLate.leftover >= 1800) {
        overtimeDurationLate += 3600;
      }

      if (overtimeLeave.leftover > 0 && overtimeLeave.leftover < 1800) {
        overtimeDurationLeave += 1800;
      } else if (overtimeLeave.leftover >= 1800) {
        overtimeDurationLeave += 3600;
      }

      return {
        ...el,
        late_duration: convertSecondToTime(overtimeDurationLate),
        leave_duration: convertSecondToTime(overtimeDurationLeave),
      };
    });
    this.employeeLateWeekly = newData;
  }

  @Mutation
  private SET_TOTAL_EXPENSE(data: any) {
    this.totalExpense = data;
  }

  @Mutation
  private SET_TOTAL_OUTCOME_EXPENSE(data: any) {
    if (data.type === 'now') {
      this.totalOutcomeNow = data.res;
    } else if (data.type === 'previous') {
      this.totalOutcomePrevious = data.res;
    }
  }

  @Mutation
  private SET_TOTAL_OVERTIME_EXPENSE(data: any) {
    if (data.type === 'now') {
      this.totalOvertimeNow = data.res;
    } else if (data.type === 'previous') {
      this.totalOvertimePrevious = data.res;
    }
  }
}

export const ReportStore = getModule(Report);
