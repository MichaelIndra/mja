import { updateAttendance } from '@/common/api/attendance';
import { IAttendance } from '@/common/interfaces/attendance';
import { IEmployee } from '@/common/interfaces/employee';
import { InitQueryAttendance } from '@/common/interfaces/query';
import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import {
  calculateDateTime,
  checkTimeFormat,
  convertDuration,
  formatDate,
  openSnackbarNow,
} from '@/common/utils/config';
import { lateAndLeaveLimitation } from '@/common/utils/formulaCalculation';
import { branchOfficeOne, generalOfficeOne } from '@/common/utils/role';
import {
  calculateFixedTotalBreakWork,
  calculateFlexibleTotalBreakAndWork,
  calculateWorkingDays,
} from '@/common/utils/timeCalculation';
import AttendanceRow from '@/components/department/AttendanceRow.vue';
import Schedule from '@/components/department/Schedule.vue';
import SwitchGroup from '@/components/department/SwitchGroup.vue';
import Filters from '@/components/includes/Filter.vue';
import Pagination from '@/components/includes/Pagination.vue';
import { AttendanceStore } from '@/store/modules/attendance';
import { AuthModule } from '@/store/modules/auth';
import { EmployeeStore } from '@/store/modules/employee';
import { SettingsStore } from '@/store/modules/settings';
import ImportAttendance from '@/views/includes/ImportAttendance.vue';
import moment from 'moment';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { mask } from 'vue-the-mask';

@Component({
  name: 'Attendance',
  components: {
    ImportAttendance,
    AttendanceRow,
    Schedule,
    Pagination,
    Filters,
    SwitchGroup,
  },
  directives: {
    mask,
  },
})
export default class Attendance extends Vue {
  valid: boolean = true;
  date3: boolean = false;
  mask: string = '##:##';
  dialogForm: boolean = false;
  dialogDelete: boolean = false;
  dialogConfirmMultiDelete: boolean = false;
  dialogOvertime: boolean = false;
  overtimeStatus: string = '';
  overtimeDialogStatus: boolean = false;
  dialogSwitchSchedule: boolean = false;
  switchScheduleDialogStatus: boolean = false;
  options: any = {};
  totalLate: number = 0;
  totalOff: number = 0;
  totalOvertime: number = 0;
  currentDate: string = formatDate(new Date(), 'input').toString();
  branchOfficeOne: string = branchOfficeOne;
  generalOfficeOne: string = generalOfficeOne;
  addPermission: boolean = true;
  filter: boolean = false;
  filterCount: number = 0;
  importData: boolean = false;
  employeeDepartment: string = '';
  snackbar: ISnackbar = InitSnackbar;
  getOvertime: string = '';
  overtimeList = [
    {
      text: '30 Menit',
      value: '00:30',
    },
    {
      text: '1 Jam',
      value: '01:00',
    },
    {
      text: '1 Jam 30 Menit',
      value: '01:30',
    },
    {
      text: '2 Jam',
      value: '02:00',
    },
    {
      text: '2 Jam 30 Menit',
      value: '02:30',
    },
    {
      text: '3 Jam',
      value: '03:00',
    },
    {
      text: '3 Jam 30 Menit',
      value: '03:30',
    },
    {
      text: '4 Jam',
      value: '04:00',
    },
    {
      text: '4 Jam 30 Menit',
      value: '04:30',
    },
    {
      text: '5 Jam',
      value: '05:00',
    },
    {
      text: '5 Jam 30 Menit',
      value: '05:30',
    },
    {
      text: '6 Jam',
      value: '06:00',
    },
    {
      text: '6 Jam 30 Menit',
      value: '06:30',
    },
    {
      text: '7 Jam',
      value: '07:00',
    },
    {
      text: '7 Jam 30 Menit',
      value: '07:30',
    },
    {
      text: '8 Jam',
      value: '08:00',
    },
    {
      text: '8 Jam 30 Menit',
      value: '08:30',
    },
    {
      text: '9 Jam',
      value: '09:00',
    },
    {
      text: '9 Jam 30 Menit',
      value: '09:30',
    },
    {
      text: '10 Jam',
      value: '10:00',
    },
  ];
  getGroup: any = '';
  groupList: any;
  headers: any[] = [
    { text: 'Nama', value: 'employee.name', width: '140' },
    { text: 'Tanggal', value: 'date', width: '110' },
    {
      sortable: false,
      text: 'Jam Masuk',
      align: 'center',
      value: 'time_check_in',
    },
    {
      sortable: false,
      text: 'Jam Mulai Istirahat',
      align: 'center',
      value: 'time_check_out_for_break',
    },
    {
      sortable: false,
      text: 'Jam Selesai Istirahat',
      align: 'center',
      value: 'time_check_in_for_break',
    },
    {
      sortable: false,
      text: 'Jam Pulang',
      align: 'center',
      value: 'time_check_out',
    },
    {
      sortable: false,
      text: 'Keterlambatan',
      align: 'center',
      value: 'totalLate',
      width: '100',
    },
    {
      sortable: false,
      text: 'Istirahat',
      align: 'center',
      value: 'totalBreak',
    },
    {
      sortable: false,
      text: 'Izin',
      align: 'center',
      value: 'totalLeave',
    },
    {
      sortable: false,
      text: 'Lembur Awal',
      align: 'center',
      value: 'totalOvertimeEarly',
      width: '100',
    },
    {
      sortable: false,
      text: 'Lembur Akhir',
      align: 'center',
      value: 'totalOvertime',
      width: '100',
    },
    {
      sortable: false,
      text: 'Total Kerja',
      align: 'center',
      value: 'totalWork'
    },
    { sortable: false, text: 'Status', value: 'status' },
  ];
  filterOption: any = {
    type: 'attendance',
    dataDateStart: 'time_check_in',
    dataDateEnd: 'time_check_out',
  };
  queryEmployee: any = {
    filters: [
      {
        field: 'department',
        value: 'join',
      },
      {
        field: 'group',
        value: 'join',
      },
      {
        field: 'active',
        operator: 'eq',
        value: 'true',
      },
    ],
  };
  messageAdjustment: string = '';
  formDataDelete: any = {
    ids: [],
    query: null,
    isAllSelected: false,
  };
  selectionForDeleteAll: any = null;
  optionsForDeleteAll: any[] = [
    { text: 'Tandai Semua', value: 'ALL' },
    { text: 'Tandai Semua Hanya Halaman Ini', value: 'ALL_IN_THIS_PAGE' },
  ];
  overtimeAdjustmentType: string = '';
  dialogBreak: boolean = false;
  breakDialogStatus: boolean = false;
  getBreak: any = '';
  breakList: any = [];
  valueSchedule: any = '';

  // GETTERS
  get userRole(): any {
    return AuthModule.roles;
  }

  get params(): any {
    return SettingsStore.params;
  }

  get isLoading(): boolean {
    return AttendanceStore.isLoadingAttendance;
  }

  get attendance(): any {
    return AttendanceStore.attendance;
  }

  get listSummaryAttendance(): any {
    return AttendanceStore.listSummaryAttendance;
  }

  get listAttendance(): IAttendance[] {
    return AttendanceStore.listAttendance;
  }

  get listBaseEmployee(): IEmployee[] {
    return EmployeeStore.listBaseEmployee;
  }
  get totalData(): number {
    return AttendanceStore.totalData;
  }
  get pagination(): any {
    return AttendanceStore.pagination;
  }

  // WATCH
  @Watch('filterCount')
  changeFilterCount() {
    if (this.filterCount < 0) {
      this.filterCount = 0;
    }
  }

  @Watch('attendance.employee_id')
  getDepartmentName() {
    const attendance: any = this.listBaseEmployee.find((el: any) => {
      return el.id === this.attendance.employee_id;
    });
    if (attendance) {
      this.attendance.department_name = attendance.department.name;
    }
  }

  @Watch('options')
  getTableOptions() {
    if (
      this.listAttendance.length > 0 &&
      this.options.sortBy.length > 0 &&
      this.options.sortDesc.length > 0
    ) {
      const find = this.params.filters.find((el: any) => {
        return el.value === 'ASC' || el.value === 'DESC';
      });
      if (find) {
        this.params.filters = this.params.filters.map((el: any) => {
          if (el.value === 'ASC' || el.value === 'DESC') {
            el = {
              ...el,
              field:
                this.options.sortBy[0].toString() === 'date'
                  ? 'time_check_in'
                  : this.options.sortBy[0].toString(),
              value: this.options.sortDesc[0] ? 'DESC' : 'ASC',
            };
          }
          return el;
        });
      } else {
        this.params.filters.push({
          field:
            this.options.sortBy[0].toString() === 'date'
              ? 'time_check_in'
              : this.options.sortBy[0].toString(),
          value: this.options.sortDesc[0] ? 'DESC' : 'ASC',
        });
      }
      this.getListData(this.params);
    } else if (this.importData) {
      this.getListData(this.params);
    }
    this.formDataDelete.query = JSON.parse(JSON.stringify(this.params));
  }

  @Watch('selectionForDeleteAll')
  watchSelectionForDeleteAll() {
    if (this.selectionForDeleteAll === 'ALL') {
      this.selectAll();
    } else if (this.selectionForDeleteAll === 'ALL_IN_THIS_PAGE') {
      this.selectAllInThisPage();
    }
  }

  // created() {}

  // METHODS
  mounted() {
    this.getListData(InitQueryAttendance);
    this.getListEmployee(this.queryEmployee);
    this.checkPermission();
    this.reloadOnce();
  }

  reloadOnce() {
    if (localStorage.getItem('reloaded')) {
      localStorage.removeItem('reloaded');
    } else {
      localStorage.setItem('reloaded', '1');
      location.reload();
    }
  }

  getListDataPagination(event: any) {
    AttendanceStore.getAllAttendance(event);
  }

  convertLate(data: any) {
    let temp: any = 0;
    while (data >= 3600) {
      data = data - 3600;
      temp += 1;
    }
    let temp2: any = 0;
    while (data >= 60) {
      data -= 60;
      temp2 += 1;
    }
    return temp + ' jam ' + temp2 + ' menit';
  }

  checkFilter(data: any) {
    if (data.value) {
      this.filterCount += 1;
    } else {
      this.filterCount -= 1;
    }
  }

  showFilter() {
    this.filter = !this.filter;
  }

  checkPermission() {
    if (
      this.userRole[0] === this.branchOfficeOne ||
      this.userRole[0] === this.generalOfficeOne
    ) {
      this.addPermission = true;
    } else {
      this.addPermission = true;
    }
  }

  getListData(params: any) {
    AttendanceStore.getAllAttendance(params);
  }

  getListEmployee(params: any) {
    EmployeeStore.getBaseEmployee(params);
  }

  showForm(id: string | null = null) {
    if (id) {
      AttendanceStore.getOneAttendanceFromList(id);
    } else {
      AttendanceStore.setInitDataAttendance();
    }
    this.dialogForm = true;
  }

  setBreak(item: any, index: number) {
    // this.valueSchedule = item;
    this.getBreak = {
      ...item,
      index,
    };
  }

  confirmBreak(id: string, status: boolean) {
    this.breakList = [];
    const attendanceData: any = this.listAttendance.find((el: any) => {
      return el.id === id;
    });
    if (attendanceData) {
      this.$store.commit('setRawAttendance', attendanceData);
      this.breakDialogStatus = status;
      this.dialogBreak = true;
      if (this.breakDialogStatus) {
        // code
        const time_check_out: any = attendanceData.time_check_out_for_break;
        const time_check_in: any = attendanceData.time_check_in_for_break;
        time_check_out.forEach((el: any, index: number) => {
          this.breakList.push({
            start: el,
            end: time_check_in[index],
          });
        });
      }
      this.getBreak = convertDuration(this.attendance.totalBreak);
    } else {
      this.dialogBreak = false;
    }
  }

  filterBreakDuration(
    breakDuration: number,
    payslipType: string,
    payslipFilter: number,
    scheduleDuration: number,
  ) {
    let restDuration: any = { result: 0, leftover: 0 };
    if (payslipType !== '1' && payslipFilter === 1) {
      // selain produksi dan tipe mingguan
      const calculationResult = calculateWorkingDays(
        breakDuration,
        scheduleDuration,
      ).result;
      const calculationLeftover = calculateWorkingDays(
        breakDuration,
        scheduleDuration,
      ).leftover;
      if (calculationResult === 0) {
        restDuration = {
          result: calculationResult,
          leftover: calculationLeftover,
        };
      } else {
        restDuration = {
          result: calculationResult,
          leftover: calculationLeftover,
        };
      }
      return restDuration;
    } else if (payslipType !== '1' && payslipFilter === 2) {
      // selain produksi dan tipe bulanan
      console.info('non calculation');
    }
  }

  async adjustBreak() {
    const newMeta: any = this.listAttendance.find((el: any) => {
      return el.id === this.attendance.id;
    });
    if (!newMeta) {
      this.messageAdjustment = 'Silahkan pilih jam istirahat';
    } else {
      const breakDuration = moment(this.getBreak.end, 'HH:mm').diff(
        moment(this.getBreak.start, 'HH:mm'),
        'seconds',
        false,
      );
      const payslipType = this.attendance.employee.department.meta.payslip_type;
      const payslipFilter = this.attendance.employee.department.meta
        .payslip_filter;
      const scheduleRaw = this.attendance.meta.schedule.duration * 3600;
      let newMeta2: any = {};
      const durationNotSelected: any = 0;

      if (payslipType !== '1') {
        let breakReal: any = 0;
        let leaveReal: any = 0;
        let lateReal: any = 0;
        let tempLeave: any = 0;
        let leaveFromPreviousAttendances = 0;
        let newBreakDuration: any = {};

        // console.info('init', scheduleRaw, breakDuration);
        if (breakDuration >= scheduleRaw) {
          breakReal = scheduleRaw;
          tempLeave = breakDuration - scheduleRaw;
        } else {
          breakReal = scheduleRaw;
        }
        if (tempLeave > 0) {
          if (payslipFilter === 1) {
            newBreakDuration = lateAndLeaveLimitation(
              tempLeave,
              1800,
              1800,
              payslipFilter,
              payslipType,
            );
            lateReal = newBreakDuration.late;
            leaveReal = newBreakDuration.leave;
          }
          if (payslipFilter === 2) {
            newBreakDuration = lateAndLeaveLimitation(
              tempLeave,
              600,
              3600,
              payslipFilter,
              payslipType,
            );
            lateReal = newBreakDuration.late;
            leaveReal = newBreakDuration.leave;
          }
        }
        // hitung jam keluar lain sebagai izin dengan pembulatan sesuai tipe periode (mingguan/bulanan)
        this.breakList.forEach((el: any) => {
          if (
            el.start !== this.getBreak.start &&
            el.end !== this.getBreak.end
          ) {
            let raw: any = 0;
            raw = moment(el.end, 'HH:mm').diff(
              moment(el.start, 'HH:mm'),
              'seconds',
              false,
            );
            if (payslipFilter === 1) {
              newBreakDuration = lateAndLeaveLimitation(
                raw,
                1800,
                1800,
                payslipFilter,
                payslipType,
              );
              leaveReal += newBreakDuration.leave;
              if (newMeta.meta.time_check_in_late > 1800) {
                leaveFromPreviousAttendances += newMeta.meta.time_check_in_late;
              } else {
                lateReal += newMeta.meta.time_check_in_late;
              }
              if (newMeta.meta.time_check_out_early > 1800) {
                leaveFromPreviousAttendances += newMeta.meta.time_check_in_late;
              } else {
                lateReal += newMeta.meta.time_check_in_late;
              }
              if (newBreakDuration.late > 0) {
                // leaveReal += 1800;
                lateReal += newBreakDuration.late;
              }
            }
            if (payslipFilter === 2) {
              newBreakDuration = lateAndLeaveLimitation(
                raw,
                600,
                3600,
                payslipFilter,
                payslipType,
              );
              leaveReal += newBreakDuration.leave;
              if (newMeta.meta.time_check_in_late > 600) {
                leaveFromPreviousAttendances += newMeta.meta.time_check_in_late;
              } else {
                lateReal += newMeta.meta.time_check_in_late;
              }
              if (newMeta.meta.time_check_out_early > 600) {
                leaveFromPreviousAttendances += newMeta.meta.time_check_in_late;
              } else {
                lateReal += newMeta.meta.time_check_in_late;
              }
              if (newBreakDuration.late) {
                // leaveReal += 3600;
                lateReal += newBreakDuration.late;
              }
            }
            // console.info('else xxxx', el.end, el.start);
          }
        });
        // console.info('else 222', lateReal, breakReal, leaveReal);
        // console.info('newMeta', newMeta);
        newMeta2 = {
          ...newMeta,
          meta: {
            ...newMeta.meta,
            timeCheckIns: newMeta.meta.rawData.timeCheckInsBackup,
            timeCheckOuts: newMeta.meta.rawData.timeCheckOutsBackup,
            approvedBreak: this.breakDialogStatus ? 'approved' : 'rejected',
            totalBreak: breakReal,
            totalLeave:
              leaveFromPreviousAttendances + leaveReal > 0
                ? leaveFromPreviousAttendances + leaveReal
                : newMeta.meta.totalLeave,
            totalLate: lateReal > 0 ? lateReal : newMeta.meta.totalLate,
          },
        };
      }
      // console.info('updateAttendance after set break', newMeta2);
      const data: any = this.setData(newMeta2);
      await AttendanceStore.updateAttendance(data);
      this.dialogBreak = false;
      this.breakDialogStatus = false;
      this.getListData(this.params);
    }
  }

  async adjustOvertime() {
    const newMeta: any = this.listAttendance.find((el: any) => {
      return el.id === this.attendance.id;
    });
    const convertedOvertime: any = moment(this.getOvertime, 'HH:mm').diff(
      moment().startOf('day'),
      'seconds',
    );
    if (isNaN(convertedOvertime) || this.getOvertime.split('').length < 5) {
      this.messageAdjustment = 'Periksa kembali format jam lembur';
    } else if (convertedOvertime < 1800) {
      this.messageAdjustment = 'Durasi lembur minimal 30 menit';
    } else if (convertedOvertime % 1800) {
      this.messageAdjustment = 'Durasi lembur harus kelipatan 30 menit';
    } else {
      this.messageAdjustment = '';
      let newMeta2: any = {};
      if (this.overtimeAdjustmentType === 'early') {
        newMeta2 = {
          ...newMeta,
          meta: {
            ...newMeta.meta,
            approvedEarly: this.overtimeDialogStatus ? 'approved' : 'rejected',
            totalOvertimeEarly: this.overtimeDialogStatus
              ? convertedOvertime
              : 0,
          },
        };
      }
      if (this.overtimeAdjustmentType === 'late') {
        newMeta2 = {
          ...newMeta,
          meta: {
            ...newMeta.meta,
            approved: this.overtimeDialogStatus ? 'approved' : 'rejected',
            totalOvertime: this.overtimeDialogStatus ? convertedOvertime : 0,
          },
        };
      }
      const data: any = this.setData(newMeta2);
      await AttendanceStore.updateAttendance(data);
      this.dialogOvertime = false;
      this.overtimeDialogStatus = false;
      this.getListData(this.params);
    }
  }
  setData(newMeta2: any) {
    // console.info('this.attendance.id', this.attendance.id, newMeta2);
    return {
      attendance_id: this.attendance.id,
      data: {
        employee_id: newMeta2.employee.id,
        time_check_in: calculateDateTime(
          newMeta2.meta.rawData.date,
          newMeta2.time_check_in,
        ),
        time_check_out: calculateDateTime(
          newMeta2.meta.rawData.date,
          newMeta2.time_check_out,
        ),
        time_check_in_for_break: calculateDateTime(
          newMeta2.meta.rawData.date,
          newMeta2.time_check_in_for_break[0],
        ),
        time_check_out_for_break: calculateDateTime(
          newMeta2.meta.rawData.date,
          newMeta2.time_check_out_for_break[0],
        ),
        meta: newMeta2.meta,
      },
    };
  }
  selectGolongan(id: string) {
    this.getGroup = this.attendance.employee.meta.schedule_shift.find(
      (el: any) => {
        return el.id === id;
      },
    );
  }

  async adjustSchedule() {
    const newMeta: any = this.listAttendance.find((el: any) => {
      return el.id === this.attendance.id;
    });
    let newMeta2: any;
    // switch to other available schedule
    if (this.switchScheduleDialogStatus) {
      const newSchedules = this.groupList.find(
        (el: any) => el.id === this.getGroup.id,
      );
      let currentSchedule = newSchedules.schedule.schedules.find(
        (el: any) => el.value === this.attendance.scheduleToday[0].value,
      );
      currentSchedule = {
        ...currentSchedule,
        swappedSchedule: 'yes',
      };
      let totalDuration: any;
      if (currentSchedule) {
        totalDuration = calculateFlexibleTotalBreakAndWork(
          this.attendance.meta.rawData,
          currentSchedule,
          this.attendance.employee.department.meta.payslip_filter,
          this.attendance.employee.department.meta.payslip_type,
        );
      }
      newMeta2 = {
        ...newMeta,
        meta: {
          ...newMeta.meta,
          isSwitchSchedule: 'yes',
          totalLate: totalDuration.totalLate,
          totalOvertime: totalDuration.totalOvertime,
          totalWork: totalDuration.totalWorkingHour,
          totalBreak: totalDuration.totalBreakInHour,
          totalLeave: totalDuration.totalLeave,
          time_check_in_late: totalDuration.time_check_in_late,
          time_check_out_for_break_early:
            totalDuration.time_check_out_for_break_early,
          time_check_in_for_break_late:
            totalDuration.time_check_in_for_break_late,
          time_check_out_early: totalDuration.time_check_out_early,
          fixedSchedule: currentSchedule,
        },
      };
    } else {
      // Set to leave
      newMeta2 = {
        ...newMeta,
        meta: {
          ...newMeta.meta,
          isSwitchSchedule: 'no',
          totalLate: newMeta.totalLate,
          totalOvertime: newMeta.totalOvertime,
          totalWork: newMeta.totalWork,
          totalBreak: newMeta.totalBreak,
          totalLeave: newMeta.totalLeave !== 0 ? newMeta.totalLeave : 0,
        },
      };
    }
    const data: any = this.setData(newMeta2);
    await AttendanceStore.updateAttendance(data);
    this.dialogSwitchSchedule = false;
    this.switchScheduleDialogStatus = false;
    this.getListData(this.params);
  }

  importAttendance() {
    this.importData = !this.importData;
    this.filter = false;
  }

  successImport() {
    this.getListData(InitQueryAttendance);
    this.getListEmployee(this.queryEmployee);
    this.importData = !this.importData;
    this.filter = true;
  }

  closeForm() {
    // this.$store.commit('SET_ACTIVE_GROUP', InitGroup);
    this.dialogForm = false;
    this.$store.commit('SET_LOADING_ATTENDANCE', false);
  }

  confirmOvertime(id: string, status: boolean, type: string) {
    const attendanceData: any = this.listAttendance.find((el: any) => {
      return el.id === id;
    });
    this.overtimeAdjustmentType = type;
    if (attendanceData) {
      this.$store.commit('setRawAttendance', attendanceData);
      this.overtimeDialogStatus = status;
      this.dialogOvertime = true;
      if (this.overtimeAdjustmentType === 'early') {
        this.getOvertime = convertDuration(this.attendance.totalOvertimeEarly);
      }
      if (this.overtimeAdjustmentType === 'late') {
        this.getOvertime = convertDuration(this.attendance.totalOvertime);
      }
    } else {
      this.dialogOvertime = false;
    }
  }
  confirmSwitchSchedule(id: string, status: boolean) {
    const attendanceData: any = this.listAttendance.find((el: any) => {
      return el.id === id;
    });
    if (attendanceData) {
      this.$store.commit('setRawAttendance', attendanceData);
      this.switchScheduleDialogStatus = status;
      this.dialogSwitchSchedule = true;
      const groupId = this.attendance.employee.group_id;
      if (this.attendance.employee.meta.schedule_shift) {
        this.groupList = this.attendance.employee.meta.schedule_shift.filter(
          (el: any) => {
            return el.id !== groupId;
          },
        );
      } else {
        const snackbar = {
          ...this.snackbar,
          value: true,
          message: 'Pilihan jadwal tidak di temukan.',
          color: 'error',
        };
        openSnackbarNow(snackbar);
        this.dialogSwitchSchedule = false;
      }
    } else {
      this.dialogSwitchSchedule = false;
    }
  }

  showConfirmDelete(id: string) {
    AttendanceStore.getOneAttendanceFromList(id);
    this.dialogDelete = true;
  }

  async deleteData() {
    if (this.attendance.id) {
      await AttendanceStore.deleteAttendance(this.attendance.id);
      this.getListData(InitQueryAttendance);
      this.getListEmployee(this.queryEmployee);
    }
    // cek
    this.dialogDelete = false;
  }

  save() {
    if (
      isNaN(checkTimeFormat(this.attendance.time_check_in)) ||
      isNaN(checkTimeFormat(this.attendance.time_check_out)) ||
      isNaN(checkTimeFormat(this.attendance.time_check_in_for_break)) ||
      isNaN(checkTimeFormat(this.attendance.time_check_out_for_break)) ||
      this.attendance.time_check_in.split('').length !== 5 ||
      this.attendance.time_check_out.split('').length !== 5 ||
      this.attendance.time_check_in_for_break.split('').length !== 5 ||
      this.attendance.time_check_out_for_break.split('').length !== 5
    ) {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message: 'Format waktu tidak sesuai, harap cek kembali. contoh: 17:00',
        color: 'error',
      };
      openSnackbarNow(snackbar);
    } else {
      const employeeData: any = this.listBaseEmployee.find((el: any) => {
        return el.id === this.attendance.employee_id;
      });
      if (employeeData) {
        const newAttendance = {
          ...this.attendance,
          time_check_in: calculateDateTime(
            this.attendance.date_entry,
            this.attendance.time_check_in,
          ),
          time_check_out_for_break: calculateDateTime(
            this.attendance.date_entry,
            this.attendance.time_check_out_for_break,
          ),
          time_check_in_for_break: calculateDateTime(
            this.attendance.date_entry,
            this.attendance.time_check_in_for_break,
          ),
          time_check_out: calculateDateTime(
            this.attendance.date_entry,
            this.attendance.time_check_out,
          ),
          meta: {
            rawData: {
              breakStart: this.attendance.time_check_out_for_break,
              breakEnd: this.attendance.time_check_in_for_break,
              employeeName: employeeData.name,
              employeeNIK: employeeData.nik,
              date: formatDate(new Date(this.attendance.date_entry), 'input'),
              entries: [
                this.attendance.time_check_in,
                this.attendance.time_check_out_for_break,
                this.attendance.time_check_in_for_break,
                this.attendance.time_check_out,
              ],
              timeCheckIns: [
                this.attendance.time_check_in,
                this.attendance.time_check_in_for_break,
              ],
              timeCheckOuts: [
                this.attendance.time_check_out_for_break,
                this.attendance.time_check_out,
              ],
              timeCheckIn: this.attendance.time_check_in,
              timeCheckOut: this.attendance.time_check_out,
            },
            group_id: employeeData.group_id,
            department_id: employeeData.department_id,
            area_id: employeeData.area_id,
          },
        };
        let totalDuration: any;
        const currentSchedule =
          employeeData.group.schedule.schedules[
            new Date(newAttendance.meta.rawData.date).getDay()
          ];
        switch (employeeData.department.meta.payslip_filter) {
          case 1:
            switch (Number(employeeData.department.meta.payslip_type)) {
              // weekly fixed schedule
              case 1:
                totalDuration = calculateFixedTotalBreakWork(
                  newAttendance,
                  currentSchedule,
                );
                break;
              //  weekly flexible schedule
              case 2:
                totalDuration = calculateFlexibleTotalBreakAndWork(
                  newAttendance.meta.rawData,
                  currentSchedule,
                  employeeData.department.meta.payslip_filter,
                  employeeData.department.meta.payslip_type,
                );
                break;
              default:
            }
            break;
          //  monthly flexible schedule
          case 2:
            totalDuration = calculateFlexibleTotalBreakAndWork(
              newAttendance.meta.rawData,
              currentSchedule,
              employeeData.department.meta.payslip_filter,
              employeeData.department.meta.payslip_type,
            );
            break;
          default:
        }
        newAttendance.meta = {
          ...newAttendance.meta,
          totalLate: totalDuration.totalLate,
          totalOvertimeEarly: totalDuration.totalOvertimeEarly,
          totalOvertimeValidation: totalDuration.totalOvertimeValidation,
          totalOvertime: totalDuration.totalOvertime,
          totalWork: totalDuration.totalWorkingHour,
          totalBreak: totalDuration.totalBreakInHour,
          totalLeave: totalDuration.totalLeave,
          time_check_in_late: totalDuration.time_check_in_late,
          time_check_out_for_break_early:
            totalDuration.time_check_out_for_break_early,
          time_check_in_for_break_late:
            totalDuration.time_check_in_for_break_late,
          time_check_out_early: totalDuration.time_check_out_early,
          schedule: totalDuration.schedule,
          group_meta: employeeData.group,
        };
        AttendanceStore.saveAttendance(newAttendance);
        AttendanceStore.getAllAttendance(this.params);
        this.dialogForm = false;
        this.filter = true;
      } else {
        const snackbar = {
          ...this.snackbar,
          value: true,
          message: 'Data Karyawan tidak di temukan.',
          color: 'error',
        };
        openSnackbarNow(snackbar);
      }
    }
  }

  convertDuration(duration: number) {
    return convertDuration(duration);
  }

  selectAll() {
    this.formDataDelete.ids = this.listAttendance.map((item: any) => item.id);
    this.formDataDelete.isAllSelected = true;
    this.formDataDelete.query = JSON.parse(JSON.stringify(this.params));
  }

  selectAllInThisPage() {
    this.formDataDelete.ids = this.listAttendance.map((item: any) => item.id);
    this.formDataDelete.isAllSelected = false;
    this.formDataDelete.query = JSON.parse(JSON.stringify(this.params));
  }

  unSelectAll() {
    this.formDataDelete.ids = [];
    this.formDataDelete.isAllSelected = false;
    this.formDataDelete.query = JSON.parse(JSON.stringify(this.params));
    this.selectionForDeleteAll = null;
  }

  async deleteSelected() {
    try {
      await AttendanceStore.deleteManyAttendance(this.formDataDelete);
      this.formDataDelete = {
        isAllSelected: false,
        query: this.params,
        ids: [],
      };
      this.dialogConfirmMultiDelete = false;
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'success',
        message: 'Berhasil menghapus data kehadiran.',
      });
      this.getListData(this.params);
    } catch (err) {
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'error',
        message: 'Gagal menghapus.',
      });
      this.dialogConfirmMultiDelete = false;
    }
    this.dialogConfirmMultiDelete = false;
  }

  convertDate(date: any) {
    if (date) {
      return moment(date)
        .locale('id')
        .format('D MMMM YYYY');
    } else {
      return null;
    }
  }
}
