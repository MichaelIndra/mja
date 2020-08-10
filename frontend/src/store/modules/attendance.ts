import {
  createAttendance,
  createBulkAttendance,
  deleteAttendance,
  deleteManyAttendance,
  fetchAttendances,
  fetchOneAttendance,
  updateAttendance,
} from '@/common/api/attendance';
import { IAttendance, InitAttendance } from '@/common/interfaces/attendance';
import {
  convertDuration,
  formatDate,
  openSnackbarNow,
} from '@/common/utils/config';
import {
  calculateCutOver,
  calculateEarlyCheckOutForBreak,
  calculateFlexibleTotalBreakAndWork,
  calculateLateCheckIn,
  calculateLateCheckInAfterBreak,
  calculateLateCheckOut,
  processAttendances,
} from '@/common/utils/timeCalculation';
import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

export interface IAttendanceState {
  isLoadingAttendance: boolean;
  listAttendance: any[];
  listSummaryAttendance: any;
  attendance?: IAttendance;
  pagination: any;
  params: any;
  totalData: number;
}

@Module({ dynamic: true, store, name: 'AttendanceStore' })
class Attendance extends VuexModule implements IAttendanceState {
  isLoadingAttendance = false;
  listAttendance = [];
  listSummaryAttendance: any = [];
  attendance = {
    ...InitAttendance,
  };
  pagination = {};
  params = {};
  totalData = 0;

  @Mutation
  setRawAttendance(data: any) {
    this.attendance = data;
  }

  @Action
  async setInitDataAttendance() {
    this.SET_LOADING_ATTENDANCE(true);
    const res: any = {
      ...InitAttendance,
    };
    this.SET_BASE_ATTENDANCE(res);
  }
  @Action({ rawError: true })
  async getAllAttendance(query: any) {
    try {
      await this.context.dispatch('setParamsGlobal', query);
      this.SET_LOADING_ATTENDANCE(true);
      const res: any = await fetchAttendances(query);
      await this.context.dispatch('setPagination', res);
      if (res.data && res.data.length > 0) {
        this.SET_LIST_ATTENDANCE(res);
      } else {
        this.SET_LIST_ATTENDANCE([]);
      }
      this.SET_LOADING_ATTENDANCE(false);
    } catch (e) {
      // console.info('error on getAllAttendance :' + e);
    }
  }
  @Action
  async getSummaryAttendance(params: any) {
    const res: any = await fetchAttendances(params);
    this.SET_SUMMARY_ATTENDANCE(res);
  }

  @Action
  async getOneAttendance(data: any) {
    const res: any = await fetchOneAttendance(data.id, data.query);
    this.SET_ATTENDANCE(res);
  }

  @Action
  async getOneAttendanceFromList(id: string) {
    const res: any = this.listAttendance.find((item: any) => item.id === id);
    if (res) {
      this.SET_ATTENDANCE(res);
    }
  }

  @Action
  async saveAttendance(data: IAttendance) {
    this.SET_LOADING_ATTENDANCE(true);
    const newData = {
      ...data,
    };
    if (newData.id) {
      await updateAttendance(newData.id, newData);
    } else {
      await createAttendance(newData);
    }
    this.SET_LOADING_ATTENDANCE(false);
  }

  @Action
  async saveBulkAttendance(data: IAttendance[]) {
    // try {
    this.SET_LOADING_ATTENDANCE(true);
    await createBulkAttendance(data);
    this.SET_LOADING_ATTENDANCE(false);
    // } catch (err) {
    //   this.SET_LOADING_ATTENDANCE(false);
    // }
  }

  @Action
  async createAttendance(data: IAttendance) {
    this.SET_LOADING_ATTENDANCE(true);
    const res: any = await createAttendance(data);
    this.SET_LOADING_ATTENDANCE(false);
    this.SET_ATTENDANCE(res);
  }

  @Action
  async updateAttendance(data: any) {
    this.SET_LOADING_ATTENDANCE(true);
    const res: any = await updateAttendance(data.attendance_id, data.data);
    this.SET_LOADING_ATTENDANCE(false);
    // TODO: check this dummy function
    const filters: any = {
      filters: [
        {
          field: 'employee',
          value: 'join',
        },
        {
          field: 'employee.name',
          value: 'ASC',
        },
        {
          field: 'employee.department',
          value: 'join',
        },
        {
          field: 'employee.group',
          value: 'join',
        },
        {
          field: 'employee.area',
          value: 'join',
        },
        {
          field: 'employee.position',
          value: 'join',
        },
      ],
    };
    const newData: any = await fetchOneAttendance(res.id, filters);
    // this.SET_ATTENDANCE(newData);
  }

  @Action
  async deleteAttendance(id: string) {
    this.SET_LOADING_ATTENDANCE(true);
    const res: any = await deleteAttendance(id);
    this.SET_LOADING_ATTENDANCE(false);
    // this.getAllAttendance(this.params);
  }

  @Action
  async deleteManyAttendance(data: any) {
    try {
      const params = JSON.parse(JSON.stringify(data.query));
      this.SET_LOADING_ATTENDANCE(true);
      const res: any = await deleteManyAttendance(data);
      this.SET_LOADING_ATTENDANCE(false);
      // this.getAllAttendance(params);
    } catch (err) {
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'error',
        message: 'Gagal menghapus',
      });
      this.SET_LOADING_ATTENDANCE(false);
    }
  }

  @Action
  async setLoading(status: boolean) {
    this.SET_LOADING_ATTENDANCE(status);
  }
  @Mutation
  SET_LOADING_ATTENDANCE(status: boolean) {
    this.isLoadingAttendance = status;
  }

  @Mutation
  private SET_ATTENDANCE(data: any) {
    try {
      const date_entry = new Date(data.time_check_in).getDay();
      const currentSchedule = data.employee.group.schedule.schedules.find(
        (el: any) => el.value === new Date(data.time_check_in).getDay(),
      );
      if (currentSchedule) {
        const lateDurationCheckIn = calculateLateCheckIn(
          data.time_check_in,
          currentSchedule.start_one,
        );

        const convertBreakEnd = calculateLateCheckInAfterBreak(
          data.time_check_in_for_break,
          currentSchedule.end_two,
        );

        const breakLateDuration =
          convertBreakEnd > 0 ? convertDuration(convertBreakEnd) : `-`;

        const overtimeDuration = calculateLateCheckOut(
          data.time_check_out,
          currentSchedule.start_two,
        );

        const cutOverDuration = calculateCutOver(
          data.time_check_out,
          currentSchedule.start_two,
        );
        const findUpdated = data.meta.rawData.fixedSchedule.find(
          (el: any) => el.value === date_entry,
        );
        const find = data.employee.group.schedule.schedules.find(
          (item: any) => {
            return item.value === date_entry;
          },
        );
        this.attendance = {
          ...data,
          scheduleToday: findUpdated ? findUpdated : find ? find : {},
          date: data.time_check_in,
          date_entry: data.date_entry,
          time_check_in: data.time_check_in,
          check_in: data.time_check_in,
          time_check_out_for_break: data.time_check_out_for_break,
          time_check_in_for_break: data.time_check_in_for_break,
          time_check_out: data.time_check_out,
          late: lateDurationCheckIn,
          breakLate: breakLateDuration,
          cutOver: cutOverDuration,
          overtime: overtimeDuration,
          created_at: formatDate(data.created_at, 'long'),
          updated_at: formatDate(data.updated_at, 'long'),
        };
      } else {
        this.attendance = {
          ...data,
        };
      }
    } catch (err) {
      console.error('ERROR', err);
    }
  }
  @Mutation
  private SET_BASE_ATTENDANCE(res: any) {
    this.attendance = res;
  }

  @Mutation
  private SET_LIST_ATTENDANCE(res: any) {
    const datas: any = [];
    if (res && Array.isArray(res)) {
      res.forEach((item: any) => {
        // if (item.employee.active === true) {
        //   datas.push(item);
        // } else {
        //   datas.push(item);
        // }
        datas.push(item);
      });
    } else if (res && res.data && Array.isArray(res.data)) {
      this.totalData = res.total;
      res.data.forEach((item: any) => {
        // if (item.employee.active === true) {
        //   datas.push(item);
        // } else {
        //   datas.push(item);
        // }
        datas.push(item);
      });
      delete res.data;
      this.pagination = {
        ...res,
      };
    }
    if (datas) {
      this.listAttendance = processAttendances(datas);
    }
    this.isLoadingAttendance = false;
  }
  @Mutation
  private SET_SUMMARY_ATTENDANCE(res: any) {
    const datas: any = [];
    if (res && Array.isArray(res)) {
      res.forEach((item: any) => {
        datas.push(item);
      });
    } else if (res && res.data && Array.isArray(res.data)) {
      res.data.forEach((item: any) => {
        datas.push(item);
      });
      delete res.data;
      this.pagination = {
        ...res,
      };
    }
    if (datas) {
      const summaryAttendance: any = datas.map((item: any) => {
        if (item.employee.group) {
          const currentSchedule: any = item.employee.group.schedule.schedules.find(
            (el: any) => {
              return (
                el.value === new Date(item.time_check_in).getDay() && el.active
              );
            },
          );

          let totalDuration: any = 0;
          if (currentSchedule) {
            // get total duration of break, late, leave, work and overtime
            totalDuration = calculateFlexibleTotalBreakAndWork(
              item.meta.rawData,
              item.meta.fixedSchedule
                ? item.meta.fixedSchedule
                : currentSchedule,
              item.employee.department.meta.payslip_filter,
              item.employee.department.meta.payslip_type,
            );
            /*if (totalDuration) {
            }*/
          }
          return {
            totalBreak:
              totalDuration.totalBreakInHour > 0
                ? totalDuration.totalBreakInHour
                : 0,
            totalWork:
              totalDuration.totalWorkingHour > 0
                ? totalDuration.totalWorkingHour
                : 0,
            totalLeave:
              totalDuration.totalLeave > 0 ? totalDuration.totalLeave : 0,
            totalLate:
              totalDuration.totalLate > 0 ? totalDuration.totalLate : 0,
            totalOvertime:
              totalDuration.totalOvertime > 0 ? totalDuration.totalOvertime : 0,
          };
        }
      });
      if (summaryAttendance.length > 0) {
        const employeeAttendanceSummary: any = summaryAttendance.reduce(
          (previousValue: any, currentValue: any) => {
            return {
              totalLate: previousValue.totalLate + currentValue.totalLate,
              totalLeave: previousValue.totalLeave + currentValue.totalLeave,
              totalOvertime:
                previousValue.totalOvertime + currentValue.totalOvertime,
              totalWork: previousValue.totalWork + currentValue.totalWork,
            };
          },
        );
        if (employeeAttendanceSummary.length > 0) {
          const attendanceReport: any = {
            employee: datas[0].employee,
            summary: employeeAttendanceSummary,
          };
          this.listSummaryAttendance.push(attendanceReport);
        }
      }
    }
  }
}

export const AttendanceStore = getModule(Attendance);
