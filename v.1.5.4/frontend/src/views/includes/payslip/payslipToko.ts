import { ILoan } from '@/common/interfaces/loan';
import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import {
  calculateUMRDaily,
  calculateWorkDurationBonus,
} from '@/common/utils/baseCalculation';
import {
  formatDate,
  formatPricePayslip,
  openSnackbarNow,
  reloadOnce,
} from '@/common/utils/config';
import {
  calculateDeductionFlexible,
  deductionFlexible,
  formulaDeductionNominalLateCheckInDaily,
  getMonthlyLateDeduction,
} from '@/common/utils/formulaCalculation';
import {
  checkForLateAndLeave,
  isNeverAbsent,
  isNeverLate,
} from '@/common/utils/overtime';
import {
  calculateWorkingDays,
  convertMonthlyLateToLeave,
  getAbsentFromLeaves,
} from '@/common/utils/timeCalculation';
import Filters from '@/components/includes/Filter.vue';
import { AttendanceStore } from '@/store/modules/attendance';
import { AuthModule } from '@/store/modules/auth';
import { EmployeeStore } from '@/store/modules/employee';
import { PayslipStore } from '@/store/modules/payslip';
import angkaTerbilang from '@develoka/angka-terbilang-js';
import 'jspdf-autotable';
import moment from 'moment';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { InitQueryEmployee } from '../../../common/interfaces/query';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);

@Component({
  name: 'PayslipToko',
  components: { Filters },
})
export default class PayslipToko extends Vue {
  // DATA
  showProcess: boolean = false;
  isEdited: boolean = true;
  filterOption: any = {
    type: 'attendance',
    dataDateStart: 'created_at',
    dataDateEnd: 'created_at',
  };
  filterCount: number = 0;
  filter: boolean = false;
  currency_config: any = {
    decimal: ',',
    thousands: '.',
    // prefix: 'Rp',
    precision: 0,
    masked: false,
    allowBlank: false,
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
  };
  snackbar: ISnackbar = InitSnackbar;

  /* data for payslip */
  deductions: any = [
    // {
    //   name: 'Potongan bon',
    //   value: 0,
    // },
  ];
  payslipType: string | null = null;

  // NOTE:  you should reset this indexDeduction after change payslip;
  // valueHoliday: number = 0;
  holiday: boolean = false;
  // valueExtraFull: number = 0;
  extraFull: boolean = false;
  driverExtra: boolean = false;
  extraWork: boolean = false;
  // valueFoodDeduction: number = 0;
  foodDeduction: boolean = false;
  // valueBonDeduction: number = 0;
  lamaKerja: boolean = false;
  valueLamaKerja: number = 0;
  bonDeduction: boolean = false;
  totalWorkDuration: any = 0;
  dailyOvertimeReward: number = 0;
  UMRDaily: number = 0;
  workDurationBonus: number = 0;
  deductionLateCheckin: number = 0;
  totalIncomeClean: number = 0;
  indexEmployee: number = 0;
  queryPayslipEmloyee: any = InitQueryEmployee;
  confirmGeneratePayslip: boolean = false;
  confirmUpdatePayslip: boolean = false;
  confirmSetPayslip: boolean = false;
  tabActive: string = 'process';
  temp: any = null;
  currentSave: number = 0;
  deductionTotalLeave: number = 0;
  totalDayLeave: number = 0;
  monthlyTotalDeduction: number = 0;
  monthlyLateDeduction: any = 0;
  monthlyLateDuration: number = 0;
  monthlyLeaveDuration: number = 0;
  isWorkDay: boolean = false;
  workDayValue: number = 0;
  isWeeklyWorkDay: boolean = false;
  weeklyWorkDayValue: number = 0;
  isFilled: boolean = false;
  isExtraFull: boolean = false;
  weeklyExtraFull: number = 0;
  isSevenBonus: boolean = false;
  weeklySeventhBonus: number = 0;
  isSundayBonus: boolean = false;
  weeklySundayBonus: number = 0;
  isInsentifFromOwner: boolean = false;
  insentifFromOwner: number = 0;
  isExtraFromOwner: boolean = false;
  extraFromOwner: number = 0;
  dailyDeduction: any = [];

  totalBonDeductionValue: number = 0;
  totalBonDeductionValueNow: number = 0;
  errorBonDeduction: boolean = false;
  newWeeklyExtraFull: number = 0;

  dataHolidays: string[] = [];
  totalDayWorks: number = 0;
  totalHolidays: number = 0;

  employeeOvertimes: any = [];
  employeeDeductions: any = [];

  // METHODS
  beforeRouteLeave(to: any, from: any, next: any) {
    let find = 0;
    this.listPayslip.forEach((el: any) => {
      if (el.payslips.length === 0 && el.temp_payslip_data) {
        find++;
      }
    });
    if (find > 0) {
      const answer = window.confirm(
        'Apakah anda ingin keluar dari halaman ini? Pastikan anda telah menyimpan data payslip dan mencetak payslip.',
      );
      if (answer) {
        // this.removePayslipTemp();
        next();
      } else {
        // next(false);
      }
    } else if (to.name !== 'print-payslip') {
      PayslipStore.resetListPayslip();
      next();
    } else {
      next();
    }
  }

  async mounted() {
    if (this.$route.params.payslipType !== '2') {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message: 'Anda tidak diperbolehkan mengakses halaman ini',
        color: 'warn',
      };
      openSnackbarNow(snackbar);
      this.$router.push({ name: 'choose-report-payslip' });
    } else {
      this.getDataHolidays();
      await this.getListData();
      this.payslipType = this.employee.department.meta.payslip_type;
    }
    reloadOnce();
  }

  getDataHolidays() {
    if (this.$route.params.dataHolidays !== '0') {
      const data = this.$route.params.dataHolidays.split(',');
      this.dataHolidays = data;
    }
    this.totalDayWorks = Number(this.$route.params.totalDayWorks);
    this.totalHolidays = Number(this.$route.params.totalHolidays);
  }

  @Watch('listPayslip')
  changeListPayslip() {
    const filter: any = this.listPayslip.filter((el: any) => {
      if (el.temp_payslip_data) {
        return el;
      }
    });
    this.currentSave = filter.length;
  }

  // GETTERS
  get userRole(): any {
    return AuthModule.roles;
  }

  get weeklyTotalAbsent(): any {
    const value =
      this.totalWorkDuration.totalWorkDays -
      this.totalWorkDuration.currentWorkDays;
    return value < 0 ? 0 : value;
  }

  get isLoadingEmployee(): any {
    return EmployeeStore.isLoadingEmployee;
  }

  get loadingPayslip(): any {
    return PayslipStore.loadingPayslip;
  }

  get listPayslip(): any {
    return PayslipStore.listPayslip;
  }

  get dateNow(): any {
    return new Date();
  }

  get userFullName(): string {
    return AuthModule.name;
  }

  get attendance(): any {
    return AttendanceStore.attendance;
  }

  get listAttendance(): any {
    return AttendanceStore.listAttendance;
  }

  get employee(): any {
    return EmployeeStore.employee;
  }

  get listEmployee(): any {
    return EmployeeStore.listEmployee;
  }

  get listPayslipCount(): number {
    return PayslipStore.listPayslipCount;
  }

  get skillBonus(): number {
    return Number(this.employee.area.bonus);
  }

  get positionBonus(): number {
    return this.employee.position ? Number(this.employee.position.bonus) : 0;
  }

  get currentWorkDaysPlusDaily(): number {
    return this.totalWorkDuration.currentWorkDays * this.totalDailyPayslip;
  }

  get totalDailyPayslip(): number {
    return (
      this.workDurationBonus +
      this.UMRDaily +
      Number(this.positionBonus) +
      Number(this.skillBonus) +
      this.employee.meta.payslip.insentif
    );
  }

  get totalIncome(): number {
    /*console.info('totalIncome',
      this.UMRDaily ,
      this.positionBonus ,
      this.monthlyInsentifExtra ,
      this.extraWorkAddition ,
      this.extraForDriver
    );*/
    return (
      this.UMRDaily +
      this.positionBonus +
      this.monthlyInsentifExtra +
      this.extraWorkAddition +
      this.extraForDriver
    );
  }
  get totalIncomeWeekly() {
    return (
      this.aWeekIncome +
      this.weeklySundayBonus +
      this.holidayBonus +
      this.newWeeklyExtraFull +
      // this.weeklyExtraFull +
      this.weeklySeventhBonus +
      this.insentifFromOwner +
      this.extraFromOwner
    );
  }
  get aWeekIncome() {
    return (
      (this.employee.meta.payslip.insentif +
        this.workDurationBonus +
        this.UMRDaily) *
      this.totalWorkDuration.currentWorkDays
    );
  }
  get oneDayRevenueWeekly() {
    return (
      Number(this.employee.meta.payslip.insentif) +
      this.workDurationBonus +
      Number(this.UMRDaily)
    );
  }
  get oneDayRevenue(): number {
    return (Number(this.positionBonus) + Number(this.UMRDaily)) / 25;
  }

  get oneMonthRevenue(): number {
    return this.oneDayRevenue * Number(this.totalWorkDuration.totalWorkDays);
  }

  get sundayBonus(): number {
    let val = 0;
    if (this.employee.attendances) {
      const checkDay = this.employee.attendances.find(
        (el: any) => new Date(el.time_check_in).getDay() === 0,
      );
      if (checkDay) {
        val = 2000;
      }
    } else {
      val = 0;
    }
    return val;
  }
  get totalDeduction(): number {
    return (
      Number(this.employee.meta.payslip.spsi_deduction) +
      Number(this.employee.meta.payslip.astek_deduction) +
      Number(this.employee.meta.payslip.value_bon_deduction) +
      Number(this.deductionLateCheckin) +
      Number(this.deductionTotalLeave)
    );
  }
  get dayLeave(): number {
    const leaveDay = this.totalWorkDuration.currentWorkDays - this.workDayValue;
    return leaveDay < 0 ? leaveDay * -1 : 0;
  }
  get hourLeave(): number {
    let hours = 0;
    let leaveDuration = this.monthlyLeaveDuration;
    while (leaveDuration >= 3600) {
      hours++;
      leaveDuration -= 3600;
    }
    return hours;
  }
  get monthlyDayOffDeduction(): number {
    /*
    let totalDayLeave = 0;
    if (this.totalDayAbsent.dayLeave > 0) {
      totalDayLeave = this.totalDayAbsent.dayLeave;
    }
    let hourOfLeave: number = 0;
    let leaveDuration = this.monthlyLeaveDuration;
    if (leaveDuration >= 3600) {
      while (leaveDuration >= 3600) {
        leaveDuration -= 3600;
        hourOfLeave++;
      }
    }
    const totalDayDeduction = this.oneDayRevenue * totalDayLeave;
    const totalHourDeduction =
      (this.totalDayAbsent.hourLeave / 8) * this.oneDayRevenue;
    */
    if (this.totalWorkNett.leaveDays || this.totalWorkNett.leaveHours) {
      return (
        this.oneDayRevenue * this.totalWorkNett.leaveDays +
        (this.totalWorkNett.leaveHours / 8) * this.oneDayRevenue
      );
    } else {
      return 0;
    }
  }
  get totalMonthlyDeduction(): number {
    return Number(
      this.monthlyDayOffDeduction +
        this.monthlyLateDeduction +
        this.employee.meta.payslip.astek_deduction +
        this.employee.meta.payslip.spsi_deduction +
        this.employee.meta.payslip.value_bon_deduction,
    );
  }
  get totalOvertimeDuration(): any {
    let daysOvertime = 0;
    let hoursOvertime = 0;
    let overtimeTemp: any;
    if (
      this.totalWorkDuration.currentWorkDays -
        Number(this.$route.params.totalDayWorks) >=
      0
    ) {
      daysOvertime =
        this.totalWorkDuration.currentWorkDays -
        Number(this.$route.params.totalDayWorks);
      hoursOvertime = this.totalWorkDuration.currentWorkHours;
    }
    if (Number(this.$route.params.payslipFilter) === 2) {
      let totalOvertimeInSeconds = 0;
      this.employee.attendances.forEach((a: any) => {
        if (a.meta.totalOvertime) {
          totalOvertimeInSeconds += a.meta.totalOvertime;
        }
      }, []);
      overtimeTemp = calculateWorkingDays(totalOvertimeInSeconds, 28800);
      daysOvertime = overtimeTemp.result / 28800;
      hoursOvertime = overtimeTemp.leftover / 3600;
    }
    return {
      totalInSeconds: overtimeTemp ? overtimeTemp.result + overtimeTemp.leftover : 0,
      daysOvertime,
      hoursOvertime,
    };
  }
  get totalDayAbsent(): any {
    let hours = 0;
    let day = 0;
    let leaveDuration = this.monthlyLeaveDuration;
    while (leaveDuration >= 3600) {
      hours++;
      leaveDuration -= 3600;
      if (hours % 8 === 0) {
        hours -= 8;
        day++;
      }
    }
    // const totalSucksDays = 0;
    const totalSucksDays =
      this.totalWorkDuration.totalWorkDays - this.employee.attendances.length;
    if (totalSucksDays > 0) {
      /*console.info(
        'leaveDuration potongan hari kerja',
        this.monthlyLeaveDuration,
        totalSucksDays,
      );*/
      return {
        totalInSeconds: (day + totalSucksDays) * 28800 + hours * 3600,
        dayLeave: day + totalSucksDays,
        hourLeave: hours,
      };
    } else {
      return {
        totalInSeconds: day * 28800 + hours * 3600,
        dayLeave: day,
        hourLeave: hours,
      };
    }
  }
  get monthlyInsentifExtraDuration(): string {
    if (
      this.totalWorkNett.currentWorkDays >=
        this.totalWorkDuration.totalWorkDays
    ) {
      return (
        this.totalWorkDuration.totalWorkDays +
        ' hari x ' +
        this.formatPrice(Number(this.employee.meta.payslip.insentif))
      );
    } else {
      return (
        this.totalWorkNett.currentWorkDays +
        ' hari ' +
        this.totalWorkNett.currentWorkHours +
        ' jam x ' +
        this.formatPrice(Number(this.employee.meta.payslip.insentif))
      );
    }
  }

  get monthlyInsentifExtra(): number {
    if (
      this.totalWorkNett.currentWorkDays >=
        this.totalWorkDuration.totalWorkDays
    ) {
      return (
        this.totalWorkDuration.totalWorkDays *
        Number(this.employee.meta.payslip.insentif)
      );
    } else {
      return (
        this.totalWorkNett.currentWorkDays *
          Number(this.employee.meta.payslip.insentif) +
        (this.totalWorkNett.currentWorkHours / 8) *
          Number(this.employee.meta.payslip.insentif)
      );
    }
  }
  get totalIncomeCleanValue(): any {
    return (
      angkaTerbilang(this.totalIncomeCleanNumber.toString()).toUpperCase() +
      ' RUPIAH'
    );
  }
  get totalIncomeCleanValueWeekly(): any {
    return (
      angkaTerbilang(
        this.totalIncomeCleanNumberWeekly.toString(),
      ).toUpperCase() + ' RUPIAH'
    );
  }

  get totalIncomeCleanNumber(): any {
    return Math.floor(
      this.totalIncome - Math.floor(this.totalMonthlyDeduction),
    );
  }
  get totalIncomeCleanNumberWeekly(): any {
    return Math.floor(this.totalIncomeWeekly - Math.floor(this.totalDeduction));
  }
  get extraWorkAddition(): number {
    if (
      (this.totalWorkNett.overtimeHours > 0 ||
        this.totalWorkNett.overtimeDays > 0) &&
      this.employee.meta.payslip.value_extra_full > 0
    ) {
      return (
        this.totalWorkNett.overtimeDays *
          this.employee.meta.payslip.value_extra_full +
        (this.totalWorkNett.overtimeHours / 8) *
          this.employee.meta.payslip.value_extra_full
      );
    } else {
      return 0;
    }
  }
  get extraForDriver(): number {
    if (
      this.employee.area &&
      this.employee.area.name.toLowerCase().includes('driver') &&
      this.totalWorkNett.currentWorkDays >=
        this.totalWorkDuration.totalWorkDays
    ) {
      return Number(this.employee.area.bonus);
    } else {
      return 0;
    }
  }
  get holidayBonus(): number {
    return this.UMRDaily * this.totalWorkDuration.totalHolidays;
  }
  get totalWorkNett(): any {
    let currentWorkDays: number = 0;
    let currentWorkHours: number = 0;
    let leaveAfterOvertime: number = 0;
    let overtimeAfterLeave: number = 0;
    let calculatedWorkingDays: any;
    let overtime: any;
    let leave: any;
    if (
      Number(this.$route.params.payslipFilter) === 2 &&
      this.employee.attendances
    ) {
      const currentWorkDaysInHour = this.employee.attendances.length * 8;
      const leaveFromLate = convertMonthlyLateToLeave(this.monthlyLateDuration);
      let totalDayLeave =
        this.totalDayAbsent.dayLeave * 8 + this.totalDayAbsent.hourLeave;
      overtimeAfterLeave =
        this.totalOvertimeDuration.totalInSeconds -
        this.totalDayAbsent.totalInSeconds;
      leaveAfterOvertime =
        this.totalDayAbsent.totalInSeconds -
        this.totalOvertimeDuration.totalInSeconds;
      const totalSucksDays =
        this.totalWorkDuration.totalWorkDays - this.employee.attendances.length;
      // console.info('sucksDays', totalSucksDays);
      if (totalSucksDays > 0) {
        leaveAfterOvertime =
          this.totalDayAbsent.totalInSeconds -
          this.totalOvertimeDuration.totalInSeconds;
        totalDayLeave =
          (this.totalDayAbsent.dayLeave - totalSucksDays) * 8 +
          this.totalDayAbsent.hourLeave;
      }
      calculatedWorkingDays = calculateWorkingDays(
        currentWorkDaysInHour -
          // ((totalDayLeave + leaveFromLate ) + // calculate late as leave
          totalDayLeave +
          this.totalOvertimeDuration.totalInSeconds / 3600,
        8,
      );
      currentWorkDays = calculatedWorkingDays.result / 8;
      currentWorkHours = calculatedWorkingDays.leftover;
      if (
        currentWorkDays >= this.totalWorkDuration.totalWorkDays &&
        currentWorkHours >= 0
      ) {
        overtime = calculateWorkingDays(
          calculatedWorkingDays.result +
            calculatedWorkingDays.leftover -
            this.totalWorkDuration.totalWorkDays * 8,
          8,
        );
      }
      if (leaveAfterOvertime > 0) {
        if (
          currentWorkDays >= this.totalWorkDuration.totalWorkDays &&
          currentWorkHours >= 0
        ) {
          leave = {
            result: 0,
            leftover: 0,
          };
        } else {
          //  command if else above if want to ignore comparing currentWorkDay and totalWorkDay
          // leave = calculateWorkingDays(leaveAfterOvertime, 28800);
          //  potongan hari masuk ( total hari efektif - total hari masuk)
          leave = calculateWorkingDays(
            this.totalWorkDuration.totalWorkDays * 8 -
              (calculatedWorkingDays.result + calculatedWorkingDays.leftover),
            8,
          );
        }
      }
    }
    return {
      currentWorkDays,
      currentWorkHours,
      overtimeDays: overtime ? overtime.result / 8 : 0,
      overtimeHours: overtime ? overtime.leftover : 0,
      leaveDays: leave ? leave.result / 8 : 0,
      leaveHours: leave ? leave.leftover : 0,
    };
  }
  changeLamaKerja() {
    if (!this.employee.meta.payslip.lama_kerja) {
      const data: any = {
        ...this.employee.meta.payslip,
        lama_kerja: 0,
      };
      EmployeeStore.assignEmployeeData(data);
    }
    this.lamaKerja = true;
  }

  cancelEditLamaKerja() {
    if (this.employee.meta.payslip.lama_kerja === 0) {
      delete this.employee.meta.payslip.lama_kerja;
      EmployeeStore.assignEmployeeData(this.employee.meta.payslip);
    }
    this.lamaKerja = false;
  }
  extraFullReward(): any {
    this.newWeeklyExtraFull = 0;
    this.weeklySeventhBonus = 0;
    const newSchedule = this.employee.attendances[0].meta.group_meta.schedule
      .schedules;
    const currentAttendance: any = [];
    let workDaySequence:boolean = true;
    for (const item of this.employee.attendances) {
      currentAttendance.push(item.check_in);
      const index = currentAttendance.indexOf(item.check_in);
      if (index > 0
        && index < currentAttendance.length) {
        if(new Date(item.check_in).getDay() - new Date(currentAttendance[index-1]).getDay() > 1) {
          workDaySequence = false;
        }
      }
      if (item.meta.fixedSchedule) {
        const replaceSchedule = newSchedule.find(
          (el: any) => el.value === item.meta.fixedSchedule.value,
        );
        if (replaceSchedule) {
          newSchedule.splice(
            item.meta.fixedSchedule.value,
            1,
            item.meta.fixedSchedule,
          );
        }
      }
    }
    let startDate = '';
    let endDate = '';
    if (this.$route.params.dateStart) {
      startDate = this.$route.params.dateStart + 'T00:00:00';
    }
    if (this.$route.params.dateEnd) {
      endDate = this.$route.params.dateEnd + 'T00:00:00';
    }
    let extra6: any = 0;
    let extra7: any = 0;
    /*  replaced with validation of current total working day vs current attendance length
    const absent = isNeverAbsent(
      currentAttendance,
      newSchedule,
      startDate,
      endDate,
    );
*/
    if (
      startDate !== '' &&
      endDate !== '' &&
      this.totalWorkDuration.currentWorkDays >=
        this.totalWorkDuration.currentWorkDays
    ) {
      extra6 = isNeverLate(currentAttendance, newSchedule, 6);
      extra7 = isNeverLate(currentAttendance, newSchedule, 7);
    }
    /*
    console.info(
      'extarlkalkadlkasfifalksjdlaksjflafla',
      this.employee.meta.payslip.extra_full.indicator,
      this.totalWorkDuration.currentWorkDays,
      this.deductionTotalLeave,
      this.deductionLateCheckin,
      checkForLateAndLeave(this.employee.attendances,6),
      checkForLateAndLeave(this.employee.attendances,7),
    );
*/
    // console.info('workDaySequence', workDaySequence);
    if (
      this.employee.meta.payslip.extra_full.indicator &&
      this.totalWorkDuration.currentWorkDays >= 6 &&
      workDaySequence &&
      checkForLateAndLeave(this.employee.attendances, 6)
    ) {
      this.newWeeklyExtraFull = this.employee.meta.payslip.extra_full.nominal;
    }
    if (
      this.employee.meta.payslip.value_day_7.indicator &&
      this.totalWorkDuration.currentWorkDays >= 7 &&
      workDaySequence &&
      checkForLateAndLeave(this.employee.attendances, 7)
    ) {
      this.weeklySeventhBonus = this.employee.meta.payslip.value_day_7.nominal;
    }
  }
  resetEditLamaKerja() {
    const data: any = {
      ...this.employee.meta.payslip,
      lama_kerja: 0,
    };
    EmployeeStore.assignEmployeeData(data);
    this.lamaKerja = false;
  }

  previousEmployee() {
    this.getDataEmployee(this.indexEmployee);
    this.temp = this.employee;
    if (this.indexEmployee <= 0) {
      this.indexEmployee = 0;
    } else {
      this.indexEmployee -= 1;
    }
    this.getFromTemporaryByIndex(this.indexEmployee);
    this.calculateUMRDaily();
    this.calculateWorkDurationBonus();
    this.getDailyOvertimeReward();
    this.formulaDeductionNominalLateCheckInDaily();
    this.getEmployeeLoans();
  }

  nextEmployee() {
    const findDataPaylsip: any = this.listPayslip.find((el: any) => {
      return el.id === this.employee.id;
    });
    if (!findDataPaylsip) {
      this.confirmGeneratePayslip = true;
    } else {
      if (this.indexEmployee >= this.listEmployee.length - 1) {
        this.indexEmployee = this.listEmployee.length - 1;
      } else {
        this.indexEmployee += 1;
      }
      this.getDataEmployee(this.indexEmployee);
      this.temp = this.employee;
      if (this.temp) {
        EmployeeStore.setRawEmployeeData(this.temp);
        this.temp = '';
      } else {
        this.getFromTemporaryByIndex(this.indexEmployee);
      }
      this.calculateUMRDaily();
      this.calculateWorkDurationBonus();
      this.getDailyOvertimeReward();
      this.formulaDeductionNominalLateCheckInDaily();
      this.getEmployeeLoans();
    }
  }

  getMonthOnly(date: any) {
    return moment(date)
      .locale('id')
      .format('MMMM YYYY');
  }

  selectDetailPayslip(id: string, index: number) {
    this.showProcess = false;
    this.indexEmployee = index;
    this.getFromTemporaryById(id);
    this.changeTabActive('process');
    this.calculateUMRDaily();
    this.calculateWorkDurationBonus();
    this.getDailyOvertimeReward();
    this.formulaDeductionNominalLateCheckInDaily();
    this.getEmployeeLoans();
  }

  // FORMULA
  /* upah lembur */
  getDailyOvertimeReward() {
    const dailyOvertimeReward: any = 0;
    for (const item of this.employee.attendances) {
      if (item.meta.totalOvertime) {
        // dailyOvertimeReward += getDailyOvertimeReward(
        //   new Date(item.time_check_out),
        //   Number(this.totalDailyPayslip),
        //   Number(item.meta.totalOvertime) / 3600,
        // );
      }
    }
    this.dailyOvertimeReward = dailyOvertimeReward;
  }

  /* gaji pokok */
  calculateUMRDaily() {
    this.UMRDaily = calculateUMRDaily(
      this.employee.department.meta.payslip_filter,
      Number(this.employee.group.base_salary),
    );
  }

  /* lama kerja/durasi */
  calculateWorkDurationBonus() {
    const date_now: Date = new Date();
    const decimal_result: boolean = true;
    // TODO:  array time_check_in attendance
    const currentAttendances: any = [];
    const payslipFilter = Number(this.employee.department.meta.payslip_filter);
    this.weeklySundayBonus = 0;
    for (const item of this.employee.attendances) {
      currentAttendances.push(item.check_in);
      if (
        moment(item.check_in).day() === 0 &&
        this.employee.meta.payslip.extra_sunday.indicator
      ) {
        const end_work_time = item.meta.fixedSchedule
          ? item.meta.fixedSchedule.start_two
          : item.meta.schedule.start_two;
        const start_work_time = item.meta.fixedSchedule
          ? item.meta.fixedSchedule.start_one
          : item.meta.schedule.start_one;
        const break_hour_time = item.meta.fixedSchedule
          ? item.meta.fixedSchedule.duration_hours * 3600
          : item.meta.schedule.duration_hours * 3600;
        const break_minute_time = item.meta.fixedSchedule
          ? item.meta.fixedSchedule.duration_minutes * 60
          : item.meta.schedule.duration_minutes * 60;
        const totalScheduleWork =
          moment(
            new Date().toISOString().substring(0, 10) + ' ' + end_work_time,
          ).diff(
            moment(
              new Date().toISOString().substring(0, 10) + ' ' + start_work_time,
            ),
            'seconds',
          ) -
          (break_hour_time + break_minute_time);
        // console.info('checkSunday', item, totalScheduleWork);
        if (item.meta.totalWork >= totalScheduleWork) {
          this.weeklySundayBonus = this.employee.meta.payslip.extra_sunday.nominal;
        }
      }
    }
    let totalOvertimeInSeconds: number = 0;
    const totalWorkInSeconds = this.employee.attendances.reduce(
      (a: any, b: any, i: number) => {
        if (b.meta.totalWork) {
          totalOvertimeInSeconds += b.meta.totalOvertime;
          return a + b.meta.totalWork;
        }
      },
      0,
    );
    const calculatedTotalWorkInSeconds = calculateWorkingDays(
      totalWorkInSeconds,
      28800,
    );
    const calculatedTotalWorkInHours =
      calculateWorkingDays(calculatedTotalWorkInSeconds.leftover, 3600).result /
      3600;
    let currentWorkDays = calculatedTotalWorkInSeconds.result / 28800;
    if (payslipFilter) {
      currentWorkDays = this.employee.attendances.length;
    }
    this.totalWorkDuration = {
      dataHolidays: this.$route.params.dataHolidays,
      dateEnd: this.$route.params.dateEnd,
      dateStart: this.$route.params.dateStart,
      departmentId: this.$route.params.departmentId,
      payslipFilter: Number(this.$route.params.payslipFilter),
      payslipType: Number(this.$route.params.payslipType),
      totalWorkDays: Number(this.$route.params.totalDayWorks), // total work day
      totalDays: Number(this.$route.params.totalDays), // total day of the period
      totalHolidays: Number(this.$route.params.totalHolidays),
      currentWorkDays,
      currentWorkHours: calculatedTotalWorkInHours,
    };
    this.workDurationBonus = calculateWorkDurationBonus(
      this.employee.active_date,
      date_now,
      decimal_result,
    );
  }

  /* potongan jam masuk */
  formulaDeductionNominalLateCheckInDaily() {
    let deduction: any = 0;
    let totalLeaveDeduction: number = 0;
    this.monthlyLeaveDuration = 0;
    this.monthlyLateDuration = 0;
    this.employeeDeductions = [];

    for (const item of this.employee.attendances) {
      let type = '';
      if (item.meta.totalLeave > 0 && item.meta.totalLate > 0) {
        type = 'both';
      } else if (item.meta.totalLeave > 0) {
        type = 'leave';
      } else if (item.meta.totalLate > 0) {
        type = 'late';
      } else {
        type = 'none';
      }
      const countLeaveDeduction = totalLeaveDeduction;
      const countLateDeduction = deduction;

      this.monthlyLateDuration +=
        item.meta.totalLate > 0 ? item.meta.totalLate : 0;
      this.monthlyLeaveDuration +=
        item.meta.totalLeave > 0 ? item.meta.totalLeave : 0;
      if (
        item.meta.time_check_in_late <= 1800 &&
        item.meta.time_check_in_late > 0
      ) {
        deduction += deductionFlexible(
          item.meta.time_check_in_late,
          this.UMRDaily,
        );
      } else {
        totalLeaveDeduction += deductionFlexible(
          item.meta.time_check_in_late,
          this.UMRDaily,
        );
      }

      if (
        item.meta.time_check_out_for_break_early <= 1800 &&
        item.meta.time_check_out_for_break_early > 0
      ) {
        deduction += deductionFlexible(
          item.meta.time_check_out_for_break_early,
          this.UMRDaily,
        );
      } else {
        totalLeaveDeduction += deductionFlexible(
          item.meta.time_check_out_for_break_early,
          this.UMRDaily,
        );
      }

      if (
        item.meta.time_check_in_for_break_late <= 1800 &&
        item.meta.time_check_in_for_break_late > 0
      ) {
        deduction += deductionFlexible(
          item.meta.time_check_in_for_break_late,
          this.UMRDaily,
        );
      } else {
        totalLeaveDeduction += deductionFlexible(
          item.meta.time_check_in_for_break_late,
          this.UMRDaily,
        );
      }

      if (
        item.meta.time_check_out_early <= 1800 &&
        item.meta.time_check_out_early > 0
      ) {
        deduction += deductionFlexible(
          item.meta.time_check_out_early,
          this.UMRDaily,
        );
      } else {
        totalLeaveDeduction += deductionFlexible(
          item.meta.time_check_out_early,
          this.UMRDaily,
        );
      }

      let cost: number = 0;
      if (type === 'late') {
        cost = deduction - countLateDeduction;
      } else if (type === 'leave') {
        cost = totalLeaveDeduction - countLeaveDeduction;
      } else if (type === 'both') {
        cost =
          deduction -
          countLateDeduction +
          (totalLeaveDeduction - countLeaveDeduction);
      } else {
        cost = 0;
      }

      this.employeeDeductions.push({
        type,
        time_check_in: item.time_check_in,
        total_late: item.meta.totalLate,
        total_leave: item.meta.totalLeave,
        cost,
      });
    }
    // potongan terlambat mingguan
    this.deductionLateCheckin = deduction;
    // this.deductionTotalLeave = totalLeaveDeduction;
    this.deductionTotalLeave =
      (this.monthlyLeaveDuration / 3600) * (this.UMRDaily / 8);
    // potongan terlambat bulanan
    this.monthlyLateDeduction = getMonthlyLateDeduction(
      this.monthlyLateDuration,
      this.oneDayRevenue,
    );
  }

  removePayslipTemp() {
    PayslipStore.removePayslipTemp();
  }

  async getListData() {
    const departmentId: string = this.$route.params.departmentId;
    const dateStart: any = new Date(this.$route.params.dateStart).toISOString();
    const dateEnd: any = moment(this.$route.params.dateEnd)
      .add(23, 'hours')
      .add(59, 'minutes')
      .add(59, 'seconds')
      .format()
      .split('+');
    /*const query: any = {
      filters: [
        {
          field: 'attendances.time_check_in',
          value: 'ASC',
        },
        {
          field: 'department',
          value: 'join',
        },
        {
          field: 'department_id',
          operator: 'eq',
          value: departmentId,
        },
        {
          field: 'group',
          value: 'join',
        },
        {
          field: 'area',
          value: 'join',
        },
        {
          field: 'position',
          value: 'join',
        },
        {
          field: 'attendances',
          value: 'join',
        },
        {
          field: 'leaves',
          value: 'join',
        },
        {
          field: 'loans',
          value: 'join',
        },
        {
          field: 'attendances.time_check_in',
          operator: 'between',
          value: queryId,
        },
      ],
    };*/
    /*if (this.userRole && this.userRole[0] === 'owner') {
      query.filters.push({
        field: 'status',
        operator: 'eq',
        value: 'KHUSUS',
      });
    }*/
    const query: any = {
      department_id: departmentId,
      date_start: dateStart,
      date_end: dateEnd[0] + '.000Z',
    };
    await EmployeeStore.getEmployeeDataForPayslip(query);
    this.listPayslip.forEach((el: any) => {
      if (el.temp_payslip_data || (el.payslips && el.payslips.length > 0)) {
        this.isFilled = true;
      }
    });
    if (!this.isFilled) {
      PayslipStore.setListPayslipTemp(this.listEmployee);
    }
    if (this.listEmployee.length > 0) {
      this.getDataEmployee(this.indexEmployee);
      this.calculateUMRDaily();
      this.calculateWorkDurationBonus();
      this.getDailyOvertimeReward();
      this.formulaDeductionNominalLateCheckInDaily();
      this.getEmployeeLoans();
    }
  }

  changeBonDeduction() {
    if (this.totalBonDeductionValueNow > 0) {
      this.bonDeduction = !this.bonDeduction;
    }
  }

  saveBonDeduction() {
    this.totalBonDeductionValueNow = this.totalBonDeductionValue;
    if (
      this.employee.meta.payslip.value_bon_deduction >
      this.totalBonDeductionValue
    ) {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message: `Potongan bon tidak boleh melebihi sisa simpanan`,
        color: 'info',
      };
      openSnackbarNow(snackbar);
      this.bonDeduction = true;
      this.errorBonDeduction = true;
    } else if (this.employee.meta.payslip.value_bon_deduction < 0) {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message: `Potongan bon tidak boleh kurang dari 0`,
        color: 'info',
      };
      openSnackbarNow(snackbar);
      this.bonDeduction = true;
      this.errorBonDeduction = true;
    } else {
      this.errorBonDeduction = false;
      this.bonDeduction = !this.bonDeduction;
      if (this.employee.meta.payslip.value_bon_deduction <= 0) {
        this.employee.meta.payslip.value_bon_deduction = 0;
      }
      this.employee.meta.payslip = {
        ...this.employee.meta.payslip,
        total_bon_now: this.totalBonDeductionValueNow,
      };
      this.totalBonDeductionValueNow =
        this.totalBonDeductionValueNow -
        this.employee.meta.payslip.value_bon_deduction;
    }
  }

  getEmployeeLoans() {
    this.extraFullReward();
    if (this.employee.latestLoan) {
      this.totalBonDeductionValueNow =
        this.employee.latestLoan.total_loan_current -
        this.employee.meta.payslip.value_bon_deduction;
      this.totalBonDeductionValue =
        this.employee.latestLoan.total_loan_current -
        this.employee.meta.payslip.value_bon_deduction;
    } else {
      this.totalBonDeductionValueNow = 0;
      this.totalBonDeductionValue = 0;
    }
  }

  savePayslipTemporary() {
    let payslip_meta_data: any = {};
    const attendances: any = this.employee.attendances.map((el: any) => {
      const dailyDeduction: any = this.dailyDeduction.find(
        (item: any) => el.date === item.date,
      );
      el = {
        ...el,
        dailyDeduction,
      };
      return el;
    });
    if (this.$route.params.payslipFilter === '1') {
      // payslip weekly
      payslip_meta_data = {
        // data overtime
        employee_overtimes: this.employeeOvertimes,
        employee_deductions: this.employeeDeductions,
        base: {
          gaji_pokok: this.UMRDaily,
          lama_kerja: this.workDurationBonus,
          lembur_extra: this.employee.meta.payslip.insentif,
          upah_1_hari: this.oneDayRevenueWeekly,
          hari_masuk: this.totalWorkDuration.currentWorkDays,
        },
        rewards: {
          upah_1_minggu: this.aWeekIncome,
          extra_full: this.newWeeklyExtraFull,
          hari_ke_7: this.weeklySeventhBonus,
          tambahan_hari_minggu: this.weeklySundayBonus,
          premi_hari_besar: this.holidayBonus,
        },
        deductions: {
          potongan_hari_kerja: this.deductionTotalLeave,
          potongan_terlambat: this.deductionLateCheckin,
          potongan_astek: this.employee.meta.payslip.astek_deduction,
          potongan_spsi: this.employee.meta.payslip.spsi_deduction,
          potongan_bon: this.employee.meta.payslip.value_bon_deduction,
        },
        owner_rewards: {
          insentifFromOwner: this.insentifFromOwner,
          extraFromOwner: this.extraFromOwner,
        },
        attendance_calculation: {
          total_hari_kerja: this.totalWorkDuration.totalWorkDays,
          total_hari_libur: this.totalWorkDuration.totalHolidays,
          total_hari_tidak_masuk: this.weeklyTotalAbsent,
          total_hari_masuk: this.totalWorkDuration.currentWorkDays,
          durasi_terlambat:
            this.monthlyLateDuration / 60 > 0
              ? this.monthlyLateDuration / 60
              : 0,
          potongan_terlambat: this.deductionLateCheckin,
          durasi_izin:
            this.monthlyLeaveDuration / 3600 > 0
              ? this.monthlyLeaveDuration / 3600
              : 0,
          potongan_izin: this.deductionTotalLeave,
          satuan_izin: 'hours',
          durasi_lembur: this.totalOvertimeDuration.totalInSeconds,
          tambahan_lembur: this.employee.meta.payslip.insentif,
          workDuration: this.totalWorkDuration,
        },
        total_pendapatan: this.totalIncomeWeekly,
        total_potongan: this.totalDeduction,
        pendapatan_gaji: this.totalIncomeCleanNumberWeekly,
        pendapatan_gaji_nominal: this.totalIncomeCleanValueWeekly,
        sisa_pinjaman:
          this.totalBonDeductionValue -
          this.employee.meta.payslip.value_bon_deduction,
      };
    } else {
      // payslip monthly
      payslip_meta_data = {
        employee_overtimes: this.employeeOvertimes,
        employee_deductions: this.employeeDeductions,
        base: {
          gaji_pokok: this.UMRDaily,
          tunjangan_jabatan: this.positionBonus,
          insentif_extra: this.monthlyInsentifExtra,
          upah_1_hari: this.oneDayRevenue,
          hari_masuk: this.totalWorkDuration.currentWorkDays,
        },
        rewards: {
          upah_1_bulan: this.workDayValue,
          extra_tambahan_kerja: this.extraWorkAddition,
          tambahan_gaji_driver: this.extraForDriver,
        },
        deductions: {
          potongan_hari_kerja: this.monthlyDayOffDeduction,
          potongan_terlambat: this.monthlyLateDeduction,
          potongan_astek: this.employee.meta.payslip.astek_deduction,
          potongan_spsi: this.employee.meta.payslip.spsi_deduction,
          potongan_bon: this.employee.meta.payslip.value_bon_deduction,
        },
        owner_rewards: {
          insentif_from_owner: this.insentifFromOwner,
          extra_from_owner: this.extraFromOwner,
        },
        attendance_calculation: {
          total_hari_kerja: this.totalWorkDuration.totalWorkDays,
          total_hari_libur: this.totalWorkDuration.totalHolidays,
          total_hari_tidak_masuk:
            this.totalDayAbsent.dayLeave +
            ' hari' +
            this.totalDayAbsent.hourLeave +
            ' jam',
          total_hari_masuk: this.totalWorkNett.currentWorkDays,
          durasi_terlambat:
            this.monthlyLateDuration / 60 > 0
              ? this.monthlyLateDuration / 60
              : 0,
          durasi_izin: this.monthlyLeaveDuration / 3600,
          durasi_lembur: this.totalOvertimeDuration.totalInSeconds,
          tambahan_lembur: this.extraWorkAddition,
          potongan_izin: this.deductionTotalLeave,
          potongan_terlambat: this.deductionLateCheckin,
          workDuration: {
            ...this.totalWorkDuration,
            currentWorkDays: this.totalWorkNett.currentWorkDays,
            currentWorkHours: this.totalWorkNett.currentWorkHours,
          },
        },
        total_pendapatan: this.totalIncome,
        total_potongan: this.totalMonthlyDeduction,
        pendapatan_gaji: this.totalIncomeCleanNumber,
        pendapatan_gaji_nominal: this.totalIncomeCleanValue,
        sisa_pinjaman: this.totalBonDeductionValueNow,
      };
    }

    const dataPayslip: any = {
      // TODO:  delete this value before push to api
      department: this.employee.department,
      area: this.employee.area,
      position: this.employee.position,
      group: this.employee.group,
      meta: this.employee.meta,
      attendances: this.employee.attendances,
      start_at: new Date(this.$route.params.dateStart).toISOString(),
      end_at: new Date(this.$route.params.dateEnd).toISOString(),
      print_at: this.dateNow.toISOString(),
      employee_id: this.employee.id,
      employee_meta: { ...this.employee, attendances },
      base_salary: Number(this.employee.group.base_salary),
      total_day: this.workDurationBonus.toFixed(2),
      daily_base_salary: this.UMRDaily,
      total_base_daily: this.totalDailyPayslip.toFixed(2),
      total_base: this.currentWorkDaysPlusDaily.toFixed(2),
      total_reward: this.totalDailyPayslip.toFixed(2),
      total_deduction: this.totalDeduction.toFixed(2),
      total:
        this.$route.params.payslipFilter === '1'
          ? this.totalIncomeCleanNumberWeekly.toFixed(2)
          : this.totalIncomeCleanNumber.toFixed(2),
      payslip_meta: {
        ...payslip_meta_data,
      },
    };
    const newEmployee: any = {
      ...this.employee,
      temp_payslip_data: dataPayslip,
    };
    const findDataPayslip: any = this.listPayslip.find((el: any) => {
      return this.employee.id === el.id;
    });
    if (this.listPayslip.length > 0 && findDataPayslip.temp_payslip_data) {
      PayslipStore.updatePayslipTemp(newEmployee);
    } else {
      PayslipStore.setPayslipTemp(newEmployee);
      const snackbar = {
        ...this.snackbar,
        value: true,
        message: `Berhasil menyimpan data '${newEmployee.name}'`,
        color: 'success',
      };
      openSnackbarNow(snackbar);
      this.temp = newEmployee;
      if (this.indexEmployee + 1 >= this.listEmployee.length - 1) {
        this.indexEmployee = this.listEmployee.length - 1;
      } else {
        this.indexEmployee += 1;
      }
      this.getDataEmployee(this.indexEmployee);
      this.calculateUMRDaily();
      this.calculateWorkDurationBonus();
      this.getDailyOvertimeReward();
      this.formulaDeductionNominalLateCheckInDaily();
      this.getEmployeeLoans();
    }
    this.insentifFromOwner = 0;
    this.extraFromOwner = 0;
    this.confirmSetPayslip = false;
  }

  convertPeriodDate(date: string) {
    return formatDate(date, 'long');
  }

  convertDate(date: string, type: string) {
    return formatDate(date, type);
  }

  cancelUpdate() {
    EmployeeStore.setRawEmployeeData(this.temp);
    this.confirmSetPayslip = false;
  }

  checkConfirm() {
    if (this.$route.params.payslipFilter === '1') {
      if (this.totalIncomeCleanNumberWeekly <= 0) {
        const snackbar = {
          ...this.snackbar,
          value: true,
          message: 'Ada perhitungan yang belum sesuai',
          color: 'warn',
        };
        openSnackbarNow(snackbar);
      } else {
        this.temp = this.employee;
        this.confirmSetPayslip = true;
      }
    } else if (this.$route.params.payslipFilter === '2') {
      if (this.totalIncomeCleanNumber <= 0) {
        const snackbar = {
          ...this.snackbar,
          value: true,
          message: 'Ada perhitungan yang belum sesuai',
          color: 'warn',
        };
        openSnackbarNow(snackbar);
      } else {
        this.temp = this.employee;
        this.confirmSetPayslip = true;
      }
    }
  }

  generatePayslip() {
    // let find: boolean = false;
    // this.listPayslip.forEach((el: any) => {
    //   if (!el.temp_payslip_data) {
    //     find = true;
    //   }
    // });
    // if (find) {
    //   const snackbar = {
    //     ...this.snackbar,
    //     value: true,
    //     message: `Ada data yang belum disimpan, cek kembali data payslip anda`,
    //     color: 'info',
    //   };
    //   openSnackbarNow(snackbar);
    // } else {
    //   this.$router.push({
    //     name: 'print-payslip',
    //     params: {
    //       ...this.$route.params,
    //     },
    //   });
    // }
    const payload: any = this.listPayslip.filter((el: any) => {
      if (el.temp_payslip_data) {
        return el;
      }
    });
    PayslipStore.setListPayslipTemp(payload);
    this.$router.push({
      name: 'print-payslip',
      params: {
        ...this.$route.params,
      },
    });
  }

  getDataEmployee(index: number) {
    // EmployeeStore.setEmployeeData(index);
    const find = this.listPayslip[index];
    EmployeeStore.choosePayslip(find);
  }

  getFromTemporaryByIndex(index: any) {
    const findPayslipByIndex: any = this.listPayslip[index];
    EmployeeStore.setRawEmployeeData(findPayslipByIndex);
  }

  getFromTemporaryById(id: any) {
    const findPayslipByIndex: any = this.listPayslip.find((el: any) => {
      return el.id === id;
    });
    EmployeeStore.setRawEmployeeData(findPayslipByIndex);
  }

  formatPrice(value: number) {
    return formatPricePayslip(value);
  }

  formatDate(data: any, type: string): any {
    return formatDate(data, type);
  }

  showFilter() {
    this.filter = !this.filter;
  }

  changeTabActive(type: string) {
    this.tabActive = type;
  }

  checkFilter(data: any) {
    if (data.value) {
      this.filterCount += 1;
    } else {
      this.filterCount -= 1;
    }
  }

  isHasBeenGenerated(data: any) {
    return data.payslips && data.payslips.length > 0;
  }
}
