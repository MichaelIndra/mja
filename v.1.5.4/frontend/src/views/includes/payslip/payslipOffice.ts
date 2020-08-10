import { ILoan } from '@/common/interfaces/loan';
import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import {
  calculateUMRDaily,
  calculateWorkDurationBonus,
} from '@/common/utils/baseCalculation';
import {
  formatDate,
  formatPrice,
  formatPricePayslip,
  openSnackbarNow,
  reloadOnce,
} from '@/common/utils/config';
import {
  deductionFlexible,
  getMonthlyLateDeduction,
  lateAndLeaveLimitation,
} from '@/common/utils/formulaCalculation';
import { getDailyOvertimeReward, isNeverAbsent } from '@/common/utils/overtime';
import {
  calculateEarlyCheckOut,
  calculateLateCheckIn,
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
import jsPDF from 'jspdf';
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
  name: 'PayslipOffice',
  components: { Filters },
})
export default class PayslipOffice extends Vue {
  // GETTERS
  get userRole(): any {
    return AuthModule.roles;
  }

  get isLoadingEmployee(): any {
    return EmployeeStore.isLoadingEmployee;
  }

  get isLoadingAttendance(): any {
    return AttendanceStore.isLoadingAttendance;
  }

  get isLoadingPayslip(): any {
    return PayslipStore.isLoading;
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

  get userId(): string {
    return AuthModule.id;
  }

  get skillBonus(): string {
    return this.employee.area.bonus;
  }

  get positionBonus(): number {
    if (this.employee.position && this.employee.position.bonus) {
      return Number(this.employee.position.bonus);
    } else {
      return 0;
    }
  }

  get currentWorkDaysPlusDaily(): number {
    return this.workDayValue * this.totalDailyPayslip;
  }

  get totalDailyPayslip(): number {
    return (Number(this.positionBonus) + this.UMRDaily) / 25;
  }

  get totalIncome(): number {
    if (this.userRole && this.userRole[0] === 'owner') {
      if (!this.employee.temp_payslip_data) {
        return 0;
      } else {
        return (
          this.employee.temp_payslip_data.payslip_meta.base.upah_1_hari *
            this.employee.temp_payslip_data.payslip_meta.base
              .jumlah_hari_kerja +
          this.employee.meta.payslip.insentif *
            this.employee.temp_payslip_data.payslip_meta.total_hari_masuk +
          this.employee.meta.payslip.insentif_khusus *
            this.employee.temp_payslip_data.payslip_meta.total_hari_masuk +
          this.employee.meta.payslip.tambahan *
            this.employee.temp_payslip_data.payslip_meta.total_hari_masuk +
          this.employee.meta.payslip.bonus_lembur *
            (this.employee.temp_payslip_data.payslip_meta.total_hari_masuk -
              Number(
                this.employee.temp_payslip_data.payslip_meta.base
                  .jumlah_hari_kerja,
              )) +
          (this.employee.temp_payslip_data.payslip_meta.owner_rewards
            .extra_from_owner
            ? this.employee.temp_payslip_data.payslip_meta.owner_rewards
                .extra_from_owner
            : 0)
        );
      }
    } else {
      return this.positionBonus + this.UMRDaily + this.currentInsentif;
    }
  }

  get totalIncomeOwner(): number {
    const nominalBonusKhusus: number =
      this.employee.meta.payslip.nominal_bonus_khusus || 0;
    return (
      this.employee.temp_payslip_data.payslip_meta.base.gaji_pokok +
      this.employee.temp_payslip_data.payslip_meta.base.tunjangan_jabatan +
      this.employee.meta.payslip.insentif *
        this.employee.temp_payslip_data.payslip_meta.total_hari_masuk +
      this.ownerCurrentInsentif +
      this.ownerAdditional +
      this.ownerOvertimeCalculation +
      nominalBonusKhusus
    );
  }

  get totalBookTwo() {
    const nominalBonusKhusus: number =
      this.employee.meta.payslip.nominal_bonus_khusus || 0;
    return (
      // this.employee.temp_payslip_data.payslip_meta.base.gaji_pokok +
      // this.employee.temp_payslip_data.payslip_meta.base.tunjangan_jabatan +
      // this.employee.meta.payslip.insentif *
      // this.employee.temp_payslip_data.payslip_meta.total_hari_masuk +

      /* insentif khusus */
      this.ownerCurrentInsentif +
      /* tambahan reguler/khusus */
      this.ownerAdditional +
      /* lembur */
      this.ownerOvertimeCalculation +
      /* bonus khusus */
      nominalBonusKhusus
    );
  }

  get insentifDuration() {
    if (
      this.totalWorkNett.currentWorkDays >= this.totalWorkDuration.totalWorkDays
    ) {
      return `(${this.totalWorkDuration.totalWorkDays} hari x ${formatPrice(
        this.employee.meta.payslip.insentif,
      )})`;
    } else {
      if (this.totalWorkNett.currentWorkDays > 0) {
        return `(${this.totalWorkNett.currentWorkDays} hari ${
          this.totalWorkNett.currentWorkHours
        } jam x ${formatPrice(this.employee.meta.payslip.insentif)})`;
      } else {
        return `(${this.totalWorkNett.currentWorkHours} jam x ${formatPrice(
          this.employee.meta.payslip.insentif,
        )})`;
      }
    }
  }

  get currentInsentif() {
    let total = 0;
    if (
      this.totalWorkNett.currentWorkDays >= this.totalWorkDuration.totalWorkDays
    ) {
      total =
        this.totalWorkDuration.totalWorkDays *
        this.employee.meta.payslip.insentif;
    } else {
      if (
        this.employee.meta.payslip.insentif > 0 &&
        this.totalWorkNett.currentWorkDays > 0 &&
        this.totalWorkNett.currentWorkHours >= 0
      ) {
        total +=
          this.totalWorkNett.currentWorkDays *
            this.employee.meta.payslip.insentif +
          (this.totalWorkNett.currentWorkHours / 8) *
            this.employee.meta.payslip.insentif;
      } else if (
        this.employee.meta.payslip.insentif > 0 &&
        this.totalWorkNett.currentWorkDays === 0 &&
        this.totalWorkNett.currentWorkHours >= 0
      ) {
        total +=
          (this.totalWorkNett.currentWorkHours / 8) *
          this.employee.meta.payslip.insentif;
      }
    }
    return total;
    // return this.employee.meta.payslip.insentif * totalWorkDuration.currentWorkDays
  }
  get ownerCurrentInsentifDuration() {
    if (
      this.employee.temp_payslip_data.payslip_meta.attendance_calculation
        .workDuration.currentWorkDays -
        this.employee.temp_payslip_data.payslip_meta.attendance_calculation
          .total_hari_kerja >=
      0
    ) {
      return this.employee.temp_payslip_data.payslip_meta.attendance_calculation
        .total_hari_kerja + ' hari';
    } else {
      return (
        this.employee.temp_payslip_data.payslip_meta.attendance_calculation
          .workDuration.currentWorkDays +
        ' hari ' +
        this.employee.temp_payslip_data.payslip_meta.attendance_calculation
          .workDuration.currentWorkHours +
        ' jam'
      );
    }
  }
  get ownerCurrentInsentif() {
    if (
      this.employee.temp_payslip_data.payslip_meta.attendance_calculation
        .workDuration.currentWorkDays -
        this.employee.temp_payslip_data.payslip_meta.attendance_calculation
          .total_hari_kerja >=
      0
    ) {
      return (
        this.employee.meta.payslip.owner_special_insentif *
        this.employee.temp_payslip_data.payslip_meta.attendance_calculation
          .total_hari_kerja
      );
    } else {
      return (
        this.employee.meta.payslip.owner_special_insentif *
        (this.employee.temp_payslip_data.payslip_meta.total_hari_masuk +
          this.employee.temp_payslip_data.payslip_meta.attendance_calculation
            .workDuration.currentWorkHours /
            8)
      );
    }
  }
  get ownerAdditional() {
    // KHUSUS
    if (this.employee.meta.payslip.status_tambahan) {
      return this.employee.meta.payslip.owner_additional;
    } else {
      // REGULER
      let totalWork =
        this.employee.temp_payslip_data.payslip_meta.total_hari_masuk +
        this.employee.temp_payslip_data.payslip_meta.attendance_calculation
          .workDuration.currentWorkHours /
          8;
      if (
        totalWork >
        this.employee.temp_payslip_data.payslip_meta.attendance_calculation
          .workDuration.totalWorkDays
      ) {
        totalWork = this.employee.temp_payslip_data.payslip_meta
          .attendance_calculation.workDuration.totalWorkDays;
      }
      console.info(
        'tambahanOwner',
        this.employee.meta.payslip.owner_additional,
        totalWork,
        this.employee.temp_payslip_data.payslip_meta.attendance_calculation
          .total_hari_kerja,
      );
      return (
        this.employee.meta.payslip.owner_additional *
        (totalWork /
          this.employee.temp_payslip_data.payslip_meta.attendance_calculation
            .total_hari_kerja)
      );
    }
  }

  get convertOwnerOvertimeDuration() {
    let result: any = 0;
    if (this.ownerOvertimeDuration.toString().includes('.')) {
      const day: any = this.ownerOvertimeDuration.toString().split('.')[0];
      const hour: any = this.ownerOvertimeDuration.toString().split('.')[1];

      if (day && hour) {
        const newHour = '0.' + hour.toString();
        const hours = Number(newHour) * 8;
        if (Number(day) > 0) {
          result = day + ' hari ' + hours + ' jam';
        } else {
          result = hours + ' jam';
        }
      } else {
        if (Number(day) > 0) {
          result = day + ' hari';
        }
      }
    } else {
      result = this.ownerOvertimeDuration + ' hari';
    }
    return result;
  }

  get ownerOvertimeDuration() {
    if (
      this.employee.temp_payslip_data.payslip_meta.attendance_calculation
        .total_hari_masuk >=
      this.employee.temp_payslip_data.payslip_meta.attendance_calculation
        .total_hari_kerja
    ) {
      if (
        this.employee.temp_payslip_data.payslip_meta.attendance_calculation
          .workDuration.currentWorkHours > 0
      ) {
        return (
          this.employee.temp_payslip_data.payslip_meta.attendance_calculation
            .total_hari_masuk -
          this.employee.temp_payslip_data.payslip_meta.attendance_calculation
            .total_hari_kerja +
          this.employee.temp_payslip_data.payslip_meta.attendance_calculation
            .workDuration.currentWorkHours /
            8
        );
      } else {
        return (
          this.employee.temp_payslip_data.payslip_meta.attendance_calculation
            .total_hari_masuk -
          this.employee.temp_payslip_data.payslip_meta.attendance_calculation
            .total_hari_kerja
        );
      }
    } else {
      return 0;
    }
  }
  get ownerOvertimeCalculation() {
    return (
      this.ownerOvertimeDuration * this.employee.meta.payslip.owner_overtime
    );
  }
  get totalDeduction(): number {
    return (
      this.monthlyLateDeduction +
      this.employee.meta.payslip.astek_deduction +
      // this.employee.meta.payslip.value_bon_deduction +
      this.monthlyDayOffDeduction
    );
  }
  get totalDeductionOwner(): number {
    const astekOwner: number =
      this.employee.meta.payslip.astek_deduction_owner || 0;
    return (
      this.employee.temp_payslip_data.payslip_meta.deductions
        .potongan_hari_kerja +
      this.employee.temp_payslip_data.payslip_meta.deductions
        .potongan_terlambat +
      this.employee.temp_payslip_data.payslip_meta.deductions.potongan_astek +
      astekOwner +
      this.employee.meta.payslip.value_bon_deduction
    );
  }

  get totalDeductionBookTwo() {
    const astekOwner: number =
      this.employee.meta.payslip.astek_deduction_owner || 0;
    return astekOwner + this.employee.meta.payslip.value_bon_deduction;
  }

  get dayDeduction(): any {
    let dayCalculation =
      this.totalWorkDuration.currentWorkDays -
      this.totalWorkDuration.totalWorkDays;
    const workDayInSecond = this.totalWorkDuration.currentWorkDays * 3600;

    const hou = moment(111600).hours();
    if (this.totalWorkDuration.currentWorkHours > 0 && dayCalculation < 0) {
      dayCalculation = dayCalculation * -1;
      return {
        days: dayCalculation - 1 > 0 ? dayCalculation - 1 : 0,
        hours: 8 - this.totalWorkDuration.currentWorkHours,
      };
    } else {
      return {
        days: dayCalculation * -1 > 0 ? dayCalculation * -1 : 0,
        hours: 0,
      };
    }
  }
  get leaveDeduction(): number {
    return 0;
    // if (this.monthlyLeaveDuration > 0) {
    //   let hour = 0;
    //   let minutes = this.monthlyLeaveDuration;
    //   while (minutes >= 3600) {
    //     hour++;
    //     minutes -= 3600;
    //   }
    //   return hour;
    // } else {
    //   return 0;
    // }
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
      if (totalSucksDays > 0) {
        leaveAfterOvertime =
          this.totalDayAbsent.totalInSeconds -
          this.totalOvertimeDuration.totalInSeconds;
        totalDayLeave =
          (this.totalDayAbsent.dayLeave - totalSucksDays) * 8 +
          this.totalDayAbsent.hourLeave;
      }
      // console.info('totalLateConvert', leaveFromLate, currentWorkDaysInHour,
      // totalDayLeave, (this.totalOvertimeDuration.totalInSeconds / 3600));
      calculatedWorkingDays = calculateWorkingDays(
        currentWorkDaysInHour -
          // ((totalDayLeave + leaveFromLate) + // calculate late as leave
          totalDayLeave +
          this.totalOvertimeDuration.totalInSeconds / 3600,
        8,
      );
      currentWorkDays = calculatedWorkingDays.result / 8;
      currentWorkHours = calculatedWorkingDays.leftover;
      console.info(
        'sucksDays',
        totalSucksDays,
        leaveAfterOvertime,
        totalDayLeave,
        leaveFromLate,
        this.totalOvertimeDuration.totalInSeconds / 3600,
        currentWorkDaysInHour,
      );
      if (overtimeAfterLeave > 0) {
        overtime = calculateWorkingDays(overtimeAfterLeave, 28800);
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
      overtimeDays: overtime ? overtime.result / 28800 : 0,
      overtimeHours: overtime ? overtime.leftover / 3600 : 0,
      leaveDays: leave ? leave.result / 8 : 0,
      leaveHours: leave ? leave.leftover : 0,
    };
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
    if (
      Number(this.$route.params.payslipFilter) === 2 &&
      this.employee.attendances
    ) {
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
      totalInSeconds: overtimeTemp
        ? overtimeTemp.result + overtimeTemp.leftover
        : 0,
      daysOvertime,
      hoursOvertime,
    };
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

  get monthlyDayOffDeduction(): number {
    /*let totalDayLeave = 0;
    if (this.totalDayAbsent.dayLeave > 0) {
      totalDayLeave = this.totalDayAbsent.dayLeave;
    }
    const totalDayDeduction = this.oneDayRevenue * totalDayLeave;
    const totalHourDeduction =
      (this.totalDayAbsent.hourLeave / 8) * this.oneDayRevenue;
    return Number(totalDayDeduction + totalHourDeduction);
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

  get totalIncomeCleanValue(): any {
    if (this.userRole && this.userRole[0] === 'owner') {
      return (
        angkaTerbilang(
          this.totalIncomeCleanNumberOwner.toString(),
        ).toUpperCase() + ' RUPIAH'
      );
    } else {
      return (
        angkaTerbilang(this.totalIncomeCleanNumber.toString()).toUpperCase() +
        ' RUPIAH'
      );
    }
  }

  get totalIncomeCleanNumber(): any {
    return Math.floor(this.totalIncome - Math.floor(this.totalDeduction));
  }

  get totalPendapatanPlusOwner() {
    return (
      (this.employee.temp_payslip_data
        ? this.employee.temp_payslip_data.payslip_meta.owner_rewards
            .insentif_from_owner
        : 0) +
      (this.employee.temp_payslip_data
        ? this.employee.temp_payslip_data.payslip_meta.owner_rewards
            .extra_from_owner
        : 0) +
      (this.employee.temp_payslip_data
        ? this.employee.temp_payslip_data.payslip_meta.total_pendapatan
        : 0)
    );
  }

  // get totalIncomeFormOwner(): number {
  //   return this.employee.temp_payslip_data
  //     ? this.employee.temp_payslip_data.payslip_meta.total_pendapatan
  //     : 0;
  // }

  get totalIncomeCleanNumberOwner(): any {
    return Math.floor(this.totalIncomeOwner - this.totalDeductionOwner);
  }

  get totalIncomeCleanNumberOwnerTwo(): any {
    return Math.floor(
      this.totalBookOne +
        this.totalBookTwo -
        (this.totalDeductionBookOne + this.totalDeductionBookTwo),
    );
  }

  get selectedPayslip(): any {
    return PayslipStore.selectedPayslip;
  }
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
  employeeDeductions: any;
  employeeOvertimes: any;
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
  // valueFoodDeduction: number = 0;
  foodDeduction: boolean = false;
  // valueBonDeduction: number = 0;
  bonDeduction: boolean = false;
  totalWorkDuration: any = {
    currentWorkDays: 0,
    currentWorkHours: 0,
    dataHolidays: '',
    dateEnd: '',
    dateStart: '',
    departmentId: '',
    payslipFilter: 0,
    payslipType: 0,
    totalDays: 0,
    totalHolidays: 0,
    totalWorkDays: 0,
  };
  dailyOvertimeReward: number = 0;
  UMRDaily: number = 0;
  workDurationBonus: number = 0;
  deductionLateCheckin: number = 0;
  deductionDayOff: number = 0;
  monthlyLateDeduction: number | any = 0;
  monthlyLateDuration: number = 0;
  monthlyLeaveDuration: number = 0;
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
  isWorkDay: boolean = false;
  workDayValue: number = 0;
  isFilled: boolean = false;
  isFilledOwner: boolean = false;
  isInsentifFromOwner: boolean = false;
  insentifFromOwner: number = 0;
  isExtraFromOwner: boolean = false;
  extraFromOwner: number = 0;

  totalBonDeductionValue: number = 0;
  totalBonDeductionValueNow: number = 0;
  errorBonDeduction: boolean = false;

  dataHolidays: string[] = [];
  totalDayWorks: number = 0;
  totalHolidays: number = 0;

  potongan: any = {};

  // METHODS
  beforeRouteLeave(to: any, from: any, next: any) {
    let find = 0;
    this.listPayslip.forEach((el: any) => {
      if (el.payslips.length === 0 && el.temp_payslip_data) {
        find++;
      }
    });
    if (this.userRole && this.userRole[0] === 'owner') {
      next();
    } else if (find > 0) {
      const answer = window.confirm(
        'Apakah anda ingin keluar dari halaman ini? Pastikan anda telah menyimpan data payslip dan mencetak payslip.',
      );
      if (answer) {
        // this.removePayslipTemp();
        next();
      } else {
        next(false);
      }
    } else if (to.name !== 'print-payslip') {
      PayslipStore.resetListPayslip();
      next();
    } else {
      next();
    }
  }

  @Watch('listPayslip')
  changeListPayslip() {
    if (this.userRole && this.userRole[0] === 'owner') {
      const filter: any = this.listPayslip.filter((el: any) => {
        console.info('filterPayslip', el);
        if (
          el.temp_payslip_data.owner_payslip ||
          el.temp_payslip_data.payslip_meta.owner_payslip
        ) {
          return el;
        }
      });
      this.currentSave = filter.length;
    } else {
      const filter: any = this.listPayslip.filter((el: any) => {
        if (el.temp_payslip_data) {
          return el;
        }
      });
      this.currentSave = filter.length;
    }
  }

  async mounted() {
    if (this.$route.params.payslipType !== '3') {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message: 'Anda tidak diperbolehkan mengakses halaman ini',
        color: 'warn',
      };
      openSnackbarNow(snackbar);
      this.$router.push({ name: 'choose-report-payslip' });
    } else {
      await this.getListData();
      this.payslipType = this.employee.department.meta.payslip_type;
    }
    /*if (this.userRole && this.userRole[0] === 'owner') {
      this.listPayslip.forEach((el: any) => {
        if (
          !el.temp_payslip_data ||
          typeof el.temp_payslip_data === undefined
        ) {
          this.isFilledOwner = true;
        }
      });
    }*/
    reloadOnce();
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
    this.calculateDeductionOffice();
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
      this.getFromTemporaryByIndex(this.indexEmployee);
      // this.getDataEmployee(this.indexEmployee);
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
      this.calculateDeductionOffice();
      this.getEmployeeLoans();
    }
  }

  nextEmployeeOwner() {
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
      this.getFromTemporaryByIndex(this.indexEmployee);
      this.temp = this.employee;
      if (this.temp) {
        EmployeeStore.setRawEmployeeData(this.temp);
        this.temp = '';
      } else {
        this.getFromTemporaryByIndex(this.indexEmployee);
      }
      // this.calculateUMRDaily();
      // this.calculateWorkDurationBonus();
      // this.getDailyOvertimeReward();
      // this.calculateDeductionOffice();
      this.getEmployeeLoans();
      // this.getDataEmployeeOwner(this.indexEmployee);
      this.changeListPayslip();
    }
  }

  previousEmployeeOwner() {
    this.getDataEmployee(this.indexEmployee);
    this.temp = this.employee;
    if (this.indexEmployee <= 0) {
      this.indexEmployee = 0;
    } else {
      this.indexEmployee -= 1;
    }
    // this.getDataEmployeeOwner(this.indexEmployee);
    this.changeListPayslip();

    this.getFromTemporaryByIndex(this.indexEmployee);
    // this.calculateUMRDaily();
    // this.calculateWorkDurationBonus();
    // this.getDailyOvertimeReward();
    // this.calculateDeductionOffice();
    this.getEmployeeLoans();

    // if (this.indexEmployee <= 0) {
    //   this.indexEmployee = 0;
    // } else {
    //   this.indexEmployee -= 1;
    // }
  }

  get totalMonthlyDeduction(): number {
    return Number(
      this.monthlyDayOffDeduction +
        this.monthlyLateDeduction +
        this.employee.meta.payslip.astek_deduction +
        this.employee.meta.payslip.astek_deduction +
        this.employee.meta.payslip.value_bon_deduction,
    );
  }

  selectDetailPayslip(id: string, index: number) {
    this.showProcess = false;
    this.indexEmployee = index;
    this.getFromTemporaryById(id);
    this.changeTabActive('process');
    this.calculateUMRDaily();
    this.calculateWorkDurationBonus();
    this.getDailyOvertimeReward();
    this.calculateDeductionOffice();
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
      this.employee.department
        ? this.employee.department.meta.payslip_filter
        : 0,
      this.employee.group
        ? Number(this.employee.group.base_salary)
        : this.employee.payslip_temp_data
        ? this.employee.payslip_temp_data.employee_meta.group.base_salary
        : 0,
    );
  }

  /* lama kerja/durasi */
  calculateWorkDurationBonus() {
    const date_now: Date = new Date();
    const decimal_result: boolean = true;
    // TODO:  array time_check_in attendance
    const currentAttendances: any = [];
    const payslipType = Number(this.employee.department.meta.payslip_type);
    for (const item of this.employee.attendances) {
      currentAttendances.push(item.check_in);
      if (
        moment(item.check_in).day() === 0 &&
        this.employee.meta.payslip.extra_sunday.indicator
      ) {
        // this.weeklySundayBonus = this.employee.meta.payslip.extra_sunday.nominal;
      }
    }
    // const totalWorkInSeconds = this.employee.attendances.reduce(
    //   (a: any, b: any) => {
    //     if (b.meta.totalWork) {
    //       return (a += b.meta.totalWork);
    //     }
    //   },
    //   0,
    // );
    let totalWorkInSeconds: number = 0;
    this.employee.attendances.forEach((el: any) => {
      totalWorkInSeconds += el.meta.totalWork;
      if (el.meta.approved) {
        if (el.meta.approved === 'approved') {
          totalWorkInSeconds += el.meta.totalOvertime;
        }
      }
    });
    const calculatedTotalWorkInSeconds = calculateWorkingDays(
      totalWorkInSeconds,
      28800,
    );
    const calculatedTotalWorkInHours =
      calculateWorkingDays(calculatedTotalWorkInSeconds.leftover, 3600).result /
      3600;
    let currentWorkDays = calculatedTotalWorkInSeconds.result / 28800;
    if (payslipType === 2) {
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
  calculateDeductionOffice() {
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
    this.deductionTotalLeave = totalLeaveDeduction;
    // potongan terlambat bulanan
    this.monthlyLateDeduction = getMonthlyLateDeduction(
      this.monthlyLateDuration,
      this.oneDayRevenue,
    );
    // this.monthlyLeaveDuration = 0;
    // this.monthlyLateDuration = 0;
    // for (const item of this.employee.attendances) {
    //   const time_check_in: string = item.time_check_in;
    //   const time_break_start: string = item.time_check_out_for_break;
    //   const time_break_end: string = item.time_check_in_for_break;
    //   const time_check_out: string = item.time_check_out;
    //   const schedule: any = {
    //     time_check_in: item.meta.fixedSchedule
    //       ? item.meta.fixedSchedule.start_one
    //       : item.scheduleToday.start_one,
    //     time_check_out: item.meta.fixedSchedule
    //       ? item.meta.fixedSchedule.start_two
    //       : item.scheduleToday.start_two,
    //     time_break_start: item.meta.fixedSchedule
    //       ? item.meta.fixedSchedule.end_one
    //       : item.scheduleToday.end_one,
    //     time_break_end: item.meta.fixedSchedule
    //       ? item.meta.fixedSchedule.end_two
    //       : item.scheduleToday.end_two,
    //   };
    //   let lateDuration = 0;
    //   let leaveDuration = 0;
    //   // validate late check in
    //   if (item.meta.totalLeave && item.meta.totalLeave >= 0) {
    //     leaveDuration = item.meta.totalLeave;
    //     lateDuration = item.meta.totalLate;
    //   } else {
    //     lateDuration = calculateLateCheckIn(
    //       time_check_in,
    //       schedule.time_check_in,
    //     );
    //   }
    //   let check = lateAndLeaveLimitation(
    //     lateDuration,
    //     600,
    //     1800,
    //     this.employee.department.meta.payslip_filter,
    //     this.employee.department.meta.payslip_type,
    //   );
    //   this.monthlyLateDuration += check.late;
    //   this.monthlyLeaveDuration += check.leave;
    //   // validate late break
    //   const breakDuration = moment(time_break_end).diff(
    //     time_break_start,
    //     'seconds',
    //     true,
    //   );
    //   if (breakDuration >= 3600 && breakDuration - 3600 > 0) {
    //     check = lateAndLeaveLimitation(
    //       breakDuration - 3600,
    //       600,
    //       1800,
    //       this.employee.department.meta.payslip_filter,
    //       this.employee.department.meta.payslip_type,
    //     );
    //     this.monthlyLateDuration += check.late;
    //     this.monthlyLeaveDuration += check.leave;
    //   }
    //   // add early checkout as leave
    //   const earlyCheckOut = calculateEarlyCheckOut(
    //     time_check_out,
    //     schedule.time_check_out,
    //   );
    //   check = lateAndLeaveLimitation(
    //     earlyCheckOut,
    //     600,
    //     1800,
    //     this.employee.department.meta.payslip_filter,
    //     this.employee.department.meta.payslip_type,
    //   );
    //   this.monthlyLateDuration += check.late;
    //   this.monthlyLeaveDuration += check.leave;
    // }
    // this.deductionLateCheckin = getMonthlyLateDeduction(
    //   this.monthlyLateDuration,
    //   this.totalDailyPayslip,
    // );
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
    let query: any = {
      department_id: departmentId,
      date_start: dateStart,
      date_end: dateEnd[0] + '.000Z',
    };
    if (this.userRole && this.userRole[0] === 'owner') {
      query = {
        ...query,
        status: 'KHUSUS',
      };
    }
    await EmployeeStore.getEmployeeDataForPayslip(query);
    // check if payslip is already saved locally
    this.listPayslip.forEach((el: any) => {
      if (el.temp_payslip_data) {
        this.isFilled = true;
      }
    });
    if (!this.isFilled) {
      PayslipStore.setListPayslipTemp(this.listEmployee);
    }
    if (
      this.listEmployee.length > 0 &&
      this.userRole &&
      this.userRole[0] !== 'owner'
    ) {
      // PayslipStore.MATCH_PAYSLIP_CURRENT(this.listPayslip);
      this.getDataEmployee(this.indexEmployee);
      this.calculateUMRDaily();
      this.calculateWorkDurationBonus();
      this.getDailyOvertimeReward();
      this.calculateDeductionOffice();
      this.getEmployeeLoans();
    }
    if (this.userRole && this.userRole[0] === 'owner') {
      // PayslipStore.MATCH_PAYSLIP(this.listPayslip);
      this.getDataEmployeeOwner(this.indexEmployee);
      this.calculateUMRDaily();
      this.calculateWorkDurationBonus();
      this.getDailyOvertimeReward();
      this.calculateDeductionOffice();
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
      this.totalBonDeductionValueNow =
        this.totalBonDeductionValueNow -
        this.employee.meta.payslip.value_bon_deduction;
    }
  }

  getEmployeeLoans() {
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

  getDataEmployeeOwner(index: any) {
    EmployeeStore.setEmployeeData(index);
  }

  checkConfirmOwner() {
    this.savePayslipTemporary();
  }

  get totalBookOne() {
    if (this.userRole && this.userRole[0] === 'owner') {
      return this.employee.temp_payslip_data.payslip_meta.total_pendapatan;
    }
  }

  get totalDeductionBookOne() {
    if (this.userRole && this.userRole[0] === 'owner') {
      return this.employee.temp_payslip_data.payslip_meta.total_potongan;
    }
  }

  savePayslipTemporary() {
    let owner_rewards: any = {};
    let owner_deductions: any = {};
    let dataPayslipOwner: any = {};
    if (this.userRole && this.userRole[0] === 'owner') {
      owner_rewards = {
        insentif_khusus: this.ownerCurrentInsentif,
        tambahan: this.ownerAdditional,
        lembur: this.ownerOvertimeCalculation,
        bonus_khusus: this.employee.meta.payslip.nominal_bonus_khusus || 0,
      };
      owner_deductions = {
        owner_astek_deduction:
          this.employee.temp_payslip_data.employee_meta.meta.payslip
            .astek_deduction_owner || 0,
      };
      dataPayslipOwner = {
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
        employee_meta: this.employee.temp_payslip_data.employee_meta,
        base_salary: Number(this.employee.group.base_salary),
        total_day: this.employee.temp_payslip_data.payslip_meta
          .total_hari_masuk,
        daily_base_salary: this.employee.temp_payslip_data.daily_base_salary,
        total_base_daily: this.employee.temp_payslip_data.total_base_daily,
        total_base: this.employee.temp_payslip_data.total_base,
        total_reward: this.employee.temp_payslip_data.total_reward,
        total_deduction: this.employee.temp_payslip_data.total_deduction,
        total: this.employee.temp_payslip_data.total,
        payslip_meta: this.employee.temp_payslip_data.payslip_meta,
        owner_payslip: {
          base: this.employee.temp_payslip_data.payslip_meta.base,
          deductions: {
            ...this.employee.temp_payslip_data.payslip_meta.deductions,
            potongan_bon: this.employee.meta.payslip.value_bon_deduction,
          },
          attendance_calculation: this.employee.temp_payslip_data.payslip_meta
            .attendance_calculation,
          total_pendapatan: this.totalIncomeOwner,
          total_potongan: this.totalDeductionOwner,
          total_buku_1: this.totalBookOne,
          total_buku_2: this.totalBookTwo,
          total_potongan_1: this.totalDeductionBookOne,
          total_potongan_2: this.totalDeductionBookTwo,
          pendapatan_gaji: this.totalIncomeCleanNumberOwnerTwo,
          pendapatan_gaji_nominal: this.totalIncomeCleanValue,
          total_hari_masuk: this.employee.temp_payslip_data.payslip_meta
            .total_hari_masuk,
          owner_rewards,
          owner_deductions,
          sisa_pinjaman:
            this.totalBonDeductionValue -
            this.employee.meta.payslip.value_bon_deduction,
        },
      };
    }

    const dataPayslip: any = {
      // TODO:  delete this value before push to api
      department: this.employee.department,
      area: this.employee.area,
      position: this.employee.position,
      group: this.employee.temp_payslip_data
        ? this.employee.group
        : this.employee.group,
      meta: this.employee.meta,
      attendances: this.employee.attendances,
      start_at: new Date(this.$route.params.dateStart).toISOString(),
      end_at: new Date(this.$route.params.dateEnd).toISOString(),
      print_at: this.dateNow.toISOString(),
      employee_id: this.employee.id,
      employee_meta: this.employee,
      base_salary: Number(
        this.employee.temp_payslip_data
          ? this.employee.group.base_salary
          : this.employee.group.base_salary,
      ),
      total_day: this.totalWorkDuration.currentWorkDays,
      daily_base_salary: this.UMRDaily.toFixed(2),
      total_base_daily: this.totalDailyPayslip.toFixed(2),
      total_base: this.currentWorkDaysPlusDaily.toFixed(2),
      total_reward: this.totalDailyPayslip.toFixed(2),
      total_deduction: this.totalDeduction.toFixed(2),
      total: this.totalIncomeCleanNumber,
      payslip_meta: {
        base: {
          gaji_pokok: this.UMRDaily,
          tunjangan_jabatan: this.positionBonus,
          insentif: this.currentInsentif,
          upah_1_hari: this.totalDailyPayslip,
          jumlah_hari_kerja: this.totalWorkDuration.totalWorkDays,
        },
        deductions: {
          jumlah_potongan_hari: this.totalDayAbsent.dayLeave,
          jumlah_potongan_izin: this.totalDayAbsent.hourLeave,
          jumlah_potongan_bulanan: this.monthlyLateDuration,
          potongan_bon: this.employee.meta.payslip.value_bon_deduction,
          potongan_hari_kerja: this.monthlyDayOffDeduction,
          potongan_terlambat: this.monthlyLateDeduction,
          potongan_astek: this.employee.meta.payslip.astek_deduction,
        },
        employee_overtimes: this.employeeOvertimes,
        employee_deductions: this.employeeDeductions,
        attendance_calculation: {
          total_hari_kerja: this.totalWorkDuration.totalWorkDays,
          total_hari_tidak_masuk:
            this.totalWorkNett.leaveDays +
            ' hari ' +
            this.totalWorkNett.leaveHours +
            ' jam',
          total_hari_masuk: this.totalWorkNett.currentWorkDays,
          total_hari_libur: this.totalWorkDuration.totalHolidays,
          durasi_izin: this.monthlyLeaveDuration,
          satuan_izin: 'hours',
          potongan_izin: this.monthlyDayOffDeduction,
          durasi_terlambat:
            this.monthlyLateDuration > 0 ? this.monthlyLateDuration / 60 : 0,
          durasi_lembur: this.totalOvertimeDuration.totalInSeconds,
          tambahan_lembur: 0,
          workDuration: {
            ...this.totalWorkDuration,
            currentWorkDays: this.totalWorkNett.currentWorkDays,
            currentWorkHours: this.totalWorkNett.currentWorkHours,
          },
        },
        total_pendapatan: this.totalIncome,
        total_potongan: this.totalDeduction,
        pendapatan_gaji: this.totalIncomeCleanNumber,
        pendapatan_gaji_nominal: this.totalIncomeCleanValue,
        total_hari_masuk: this.totalWorkNett.currentWorkDays,
        owner_rewards,
        sisa_pinjaman:
          this.totalBonDeductionValue -
          this.employee.meta.payslip.value_bon_deduction,
      },
    };
    let newEmployee: any = {
      name: '',
    };
    if (this.userRole && this.userRole[0] === 'owner') {
      /*let temp: any = this.employee.temp_payslip_data;
      temp = {
        ...temp,
        owner_rewards,
      };*/
      this.getDataEmployee(this.indexEmployee);
      newEmployee = {
        ...this.employee,
        temp_payslip_data: dataPayslipOwner,
      };
    } else {
      newEmployee = {
        ...this.employee,
        temp_payslip_data: dataPayslip,
      };
    }
    const findDataPayslip: any = this.listPayslip.find((el: any) => {
      return this.employee.id === el.id;
    });
    if (
      this.listPayslip.length > 0 &&
      findDataPayslip.temp_payslip_data &&
      this.userRole &&
      this.userRole[0] !== 'owner'
    ) {
      PayslipStore.updatePayslipTemp(newEmployee);
    } else {
      PayslipStore.setPayslipTemp(newEmployee);
      const snackbar = {
        ...this.snackbar,
        value: true,
        message: `Berhasil menyimpan data ${newEmployee.name}`,
        color: 'success',
      };
      openSnackbarNow(snackbar);
      this.temp = newEmployee;
      if (this.indexEmployee + 1 >= this.listEmployee.length - 1) {
        this.indexEmployee = this.listEmployee.length - 1;
        if (this.userRole[0] === 'owner') {
          EmployeeStore.setRawEmployeeData(newEmployee);
          this.getDataEmployee(this.indexEmployee);
        } else {
          EmployeeStore.setRawEmployeeData(
            this.listPayslip[this.indexEmployee],
          );
        }
      } else {
        this.indexEmployee += 1;
        if (this.userRole[0] === 'owner') {
          EmployeeStore.setRawEmployeeData(newEmployee);
          this.getDataEmployee(this.indexEmployee);
        } else {
          // this.indexEmployee += 1;
          EmployeeStore.setRawEmployeeData(
            this.listPayslip[this.indexEmployee],
          );
        }
      }
      this.calculateUMRDaily();
      this.calculateWorkDurationBonus();
      this.getDailyOvertimeReward();
      this.calculateDeductionOffice();
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

  generatePayslipOwner() {
    this.checkConfirmOwner();
    this.$router.push({
      name: 'print-payslip',
      params: {
        ...this.$route.params,
      },
    });
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
    // }
    const isPayslipGeneratedExist = this.listPayslip.find(
      (item: any) => item.payslips && item.payslips.length > 0,
    );
    if (this.currentSave === 0 && !isPayslipGeneratedExist) {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message: `Tidak ada data yang disimpan, cek kembali data payslip anda`,
        color: 'info',
      };
      openSnackbarNow(snackbar);
    } else {
      const payload: any = this.listPayslip.filter((el: any) => {
        if (el.temp_payslip_data) {
          return el;
        }
      });
      console.info('payload', payload);
      PayslipStore.setListPayslipTemp(payload);
      this.$router.push({
        name: 'print-payslip',
        params: {
          ...this.$route.params,
        },
      });
    }
  }

  pushBulk() {
    const dataBulk: any = this.listPayslip.map((el: any) => {
      delete el.temp_payslip_data.attendances;
      delete el.temp_payslip_data.area;
      delete el.temp_payslip_data.department;
      delete el.temp_payslip_data.group;
      delete el.temp_payslip_data.position;
      return {
        ...el.temp_payslip_data,
        base_salary: String(el.temp_payslip_data.base_salary),
        total_day: String(el.temp_payslip_data.total_day),
        daily_base_salary: String(el.temp_payslip_data.daily_base_salary),
        total_base_daily: String(el.temp_payslip_data.total_base_daily),
        total_base: String(el.temp_payslip_data.total_base),
        total_reward: String(el.temp_payslip_data.total_reward),
        total_deduction: String(el.temp_payslip_data.total_deduction),
        total: String(el.temp_payslip_data.total),
        created_by_id: this.userId,
      };
    });
    PayslipStore.generatePayslip({ bulk: dataBulk });
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

  printPayslip() {
    this.isEdited = false;
    const doc = new jsPDF('l', 'mm');
    doc.autoTable({
      html: '#table-payslip',
      useCss: true,
      styles: {
        cellPadding: 0.5,
        fontSize: 6,
        textColor: '#000000',
        valign: 'middle',
        // lineColor: '#000000',
        overflow: 'linebreak',
        cellWidth: 'wrap',
        lineWidth: 1.02,
        lineColor: [44, 62, 80],
      },
      // pageBreak: 'avoid',
      theme: 'grid',
      // didDrawCell: (data: any) => {},
      didParseCell: (data: any) => {
        if (data.row.index === 5) {
          data.cell.styles.fillColor = [90, 70, 10];
        }
      },
      // Use for changing styles with jspdf functions or customize the positioning of cells or cell text
      // just before they are drawn to the page.
      willDrawCell: (data: any) => {
        if (data.row.section === 'body' && data.column.dataKey === 'expenses') {
          if (data.cell.raw > 750) {
            doc.setTextColor(231, 76, 60); // Red
            doc.setFontStyle('bold');
          }
        }
      },
      columnStyles: { note: { cellWidth: 'auto' } },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 1,
      headStyles: {
        fillColor: [241, 196, 15],
        fontSize: 15,
      },
      footStyles: {
        fillColor: [241, 196, 15],
        fontSize: 15,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: 240,
      },
      alternateRowStyles: {
        fillColor: [74, 96, 117],
      },
    });
    doc.save('table.pdf');
    // html2canvas(document.querySelector('#table-payslip'), {
    //   imageTimeout: 5000,
    //   useCORS: true,
    // }).then((canvas: any) => {
    //   const img = canvas.toDataURL('image/jpg', 1.0);
    //   const pdf = new jsPDF('p', 'mm', 'a4');
    //   pdf.addImage(img, 'jpg', 5, -20, 199, 220, 'alias', 'NONE');
    //   pdf.save('relatorio-remoto.pdf');
    // });
    // const data: any = this.$refs.tablePayslip;
    // const win: any = window.open('');
    // win.document.write(data.outerHTML);
    // win.print();
    // win.close();
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
    if (this.userRole && this.userRole[0] === 'owner') {
      return (
        data.payslips &&
        data.payslips.length > 0 &&
        !data.payslips[0].payslip_meta.owner_payslip
      );
    } else {
      return data.payslips && data.payslips.length > 0;
    }
  }

  isHasBeenGeneratedByOwner(data: any) {
    if (
      data.payslips &&
      data.payslips.length > 0 &&
      data.payslips[0].payslip_meta.owner_payslip
    ) {
      return true;
    }
  }

  isOwner() {
    return this.userRole && this.userRole[0] === 'owner';
  }
}
