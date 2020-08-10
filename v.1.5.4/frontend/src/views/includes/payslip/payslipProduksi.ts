import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import {
  calculateUMRDaily,
  calculateWorkDurationBonus,
} from '@/common/utils/baseCalculation';
import {
  convertSecondToTime,
  formatDate,
  formatPricePayslip,
  openSnackbarNow,
  reloadOnce,
} from '@/common/utils/config';
import {
  calculateDeductionFlexible,
  calculateLateAndLeaveDeduction,
  formulaDeductionNominalLateCheckInDaily,
  setTotalLateDuration,
  totalLateDuration,
} from '@/common/utils/formulaCalculation';
import {
  getDailyOvertimeReward,
  isNeverAbsent,
  newIsNeverAbsent,
} from '@/common/utils/overtime';
import {
  calculateWorkingDays,
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
import { ILoan } from '../../../common/interfaces/loan';
import { InitQueryEmployee } from '../../../common/interfaces/query';
import { convertSecondToTimeRound } from '../../../common/utils/config';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);

@Component({
  name: 'PayslipProduksi',
  components: { Filters },
})
export default class PayslipProduksi extends Vue {
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
  isWorkDay: boolean = false;
  workDayValue: number = 0;
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
  lamaKerja: boolean = false;
  valueLamaKerja: boolean = false;
  // valueFoodDeduction: number = 0;
  foodDeduction: boolean = false;
  // valueBonDeduction: number = 0;
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
  isFilled: boolean = false;
  totalOvertimeDuration: number = 0;
  totalLateDuration: number = 0;
  dailyOvertime: any = [];
  dailyDeduction: any = [];
  totalBonDeductionValue: number = 0;
  totalBonDeductionValueNow: number = 0;
  errorBonDeduction: boolean = false;
  neverLeave: boolean = false;
  neverLeaveBonus: number = 0;

  newNeverLeave: boolean = false;
  newNeverLeaveBonus: number = 0;

  dataHolidays: string[] = [];
  totalDayWorks: number = 0;
  totalHolidays: number = 0;

  holidayBonus: number = 0; // premi hari besar
  totalAbsentDay: number = 0;

  incomeCleanNumberNegative: boolean = false;
  employeeOvertimes: any = [];
  employeeDeductions: any = [];

  totalLeaveCalculated: number = 0;
  totalLateCalculated: number = 0;

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
    if (this.$route.params.payslipType !== '1') {
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
      this.getDataHolidays();
      this.payslipType = this.employee.department.meta.payslip_type;
    }
    reloadOnce();
  }

  getDataHolidays() {
    this.totalDayWorks = 0;
    if (this.$route.params.dataHolidays !== '0') {
      const data = this.$route.params.dataHolidays.split(',');
      this.dataHolidays = data;
    }
    this.employee.attendances[0].meta.group_meta.schedule.schedules.forEach(
      (el: any) => {
        if (el.active) {
          this.totalDayWorks++;
        }
      },
    );
    // this.totalDayWorks = Number(this.$route.params.totalDayWorks);
    this.totalHolidays = Number(this.$route.params.totalHolidays);
    if (this.totalHolidays > 0) {
      this.totalDayWorks--;
    }
  }

  // GETTERS
  get isLoadingEmployee(): any {
    return EmployeeStore.isLoadingEmployee;
  }

  get isLoadingAttendance(): any {
    return AttendanceStore.isLoadingAttendance;
  }

  get isLoadingPayslip(): any {
    return PayslipStore.isLoading;
  }

  // get totalAbsentDay(): number {
  // const value = this.totalWorkDuration.currentWorkDays - this.workDayValue;
  // return value < 0 ? value * -1 : 0;
  // }

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

  get skillBonus(): string {
    let area: string = '0';
    if (this.employee.area) {
      area = this.employee.area.bonus;
    } else {
      area = '0';
    }
    return area;
  }

  get positionBonus(): string {
    let position: string = '0';
    if (this.employee.position) {
      position = this.employee.position.bonus;
    } else {
      position = '0';
    }
    return position;
  }

  get currentWorkDaysPlusDaily(): number {
    return this.totalWorkDuration.currentWorkDays * this.totalDailyPayslip;
  }

  get totalDailyPayslip(): number {
    return (
      (this.employee.meta.payslip.lama_kerja &&
      this.employee.meta.payslip.lama_kerja > 0
        ? this.employee.meta.payslip.lama_kerja
        : this.workDurationBonus) +
      this.UMRDaily +
      Number(this.positionBonus) +
      Number(this.skillBonus) +
      this.employee.meta.payslip.insentif
    );
  }
  get humanizeActiveDate(): any {
    if (this.employee.active_date) {
      return (
        moment().diff(this.employee.active_date, 'years', false) + ' Tahun'
      );
    }
  }
  get totalIncome(): number {
    // this.employee.meta.payslip.value_extra_full +
    // this.neverLeaveBonus +
    return (
      this.dailyOvertimeReward +
      this.newNeverLeaveBonus +
      this.currentWorkDaysPlusDaily +
      this.holidayBonus
    );
  }

  get totalDeduction(): number {
    return (
      this.deductionLateCheckin +
      this.employee.meta.payslip.astek_deduction +
      this.employee.meta.payslip.value_food_deduction +
      this.employee.meta.payslip.value_bon_deduction +
      this.employee.meta.payslip.spsi_deduction
    );
  }

  get totalIncomeCleanValue(): any {
    return (
      angkaTerbilang(this.totalIncomeCleanNumber.toString()).toUpperCase() +
      ' RUPIAH'
    );
  }

  get totalIncomeCleanNumber(): any {
    return Math.floor(this.totalIncome - Math.floor(this.totalDeduction));
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
    this.calculateWorkDurationBonusEmployee();
    this.getExtraFull();
    this.getHolidayBonus();
    this.getOvertimeReward();
    this.newCalculateLateAndLeaveDeduction();
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
      this.calculateWorkDurationBonusEmployee();
      this.getExtraFull();
      this.getHolidayBonus();
      this.getOvertimeReward();
      this.newCalculateLateAndLeaveDeduction();
      this.getEmployeeLoans();
    }
  }

  selectDetailPayslip(id: string, index: number) {
    this.showProcess = false;
    // this.indexEmployee = index;
    const findDataPaylsip: any = this.listPayslip.find((el: any) => {
      return el.id === this.employee.id;
    });
    if (!findDataPaylsip) {
      this.confirmGeneratePayslip = true;
    } else {
      // if (this.indexEmployee >= this.listEmployee.length - 1) {
      //   this.indexEmployee = this.listEmployee.length - 1;
      // } else {
      // }
      this.indexEmployee = index;
      this.getDataEmployee(this.indexEmployee);
      this.temp = this.employee;
      if (this.temp) {
        EmployeeStore.setRawEmployeeData(this.temp);
        this.temp = '';
      } else {
        this.getFromTemporaryByIndex(this.indexEmployee);
      }
      this.calculateUMRDaily();
      this.calculateWorkDurationBonusEmployee();
      this.getExtraFull();
      this.getHolidayBonus();
      this.getOvertimeReward();
      this.newCalculateLateAndLeaveDeduction();
      this.getEmployeeLoans();
    }
    // this.calculateUMRDaily();
    // this.calculateWorkDurationBonus();
    // this.getExtraFull();
    // this.getHolidayBonus();
    // this.getOvertimeReward();
    // this.newCalculateLateAndLeaveDeduction();
    // this.getEmployeeLoans();
    this.getFromTemporaryById(id);
    this.changeTabActive('process');
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
    } else {
      this.employee.meta.payslip.lama_kerja = 0;
    }
    this.lamaKerja = false;
  }

  resetEditLamaKerja() {
    const data: any = {
      ...this.employee.meta.payslip,
      lama_kerja: 0,
    };
    EmployeeStore.assignEmployeeData(data);
    this.lamaKerja = false;
  }

  // FORMULA
  /* extra full */
  getExtraFull() {
    this.newNeverLeaveBonus = 0;
    if (this.employee.attendances && this.employee.attendances.length >= 6) {
      let counter = 0;
      this.employee.attendances.forEach((el: any) => {
        if (el.meta.totalLate > 0 || el.meta.totalLeave > 0) {
          counter += 1;
        }
      });
      if (counter === 0) {
        if (this.employee.meta.payslip.extra_full.indicator) {
          this.newNeverLeaveBonus = this.employee.meta.payslip.extra_full.nominal;
        }
      }
    }
  }

  /* upah lembur */
  getOvertimeReward() {
    this.totalOvertimeDuration = 0;
    let dailyOvertimeReward: any = 0;
    let totalOvertime: number = 0;
    this.employeeOvertimes = [];
    for (const item of this.employee.attendances) {
      let holidays: any = [];
      let sameDay = '';
      if (this.$route.params.dataHolidays !== '0') {
        holidays = this.$route.params.dataHolidays.split(',');
        sameDay = holidays.find((el: any) => {
          const a = moment(el).date();
          const b = moment(item.time_check_out).date();
          return a === b;
        });
      }
      if (
        item.meta.totalOvertime > 0 ||
        item.meta.totalOvertimeEarly > 0 ||
        sameDay
      ) {
        console.info('total work', item);
        /*
          NOTE:
          atau opsi lain tambahi parameter lembur akhir di parameter dibawah
        */
        const timezone: number = -1 * new Date().getTimezoneOffset() * 60000;
        const dataTimeCheckIn =
          moment(item.time_check_in)
            .locale('id')
            .toDate()
            .getTime() - timezone;
        const dataTimeCheckOut =
          moment(item.time_check_out)
            .locale('id')
            .toDate()
            .getTime() - timezone;

        const cost: number = getDailyOvertimeReward(
          new Date(dataTimeCheckIn),
          new Date(dataTimeCheckOut),
          Number(this.totalDailyPayslip),
          Number(item.meta.totalOvertime) / 3600,
          Number(item.meta.totalOvertimeEarly) / 3600,
          holidays.length > 0 ? holidays : [],
          Number(item.meta.totalWork) / 3600,
          sameDay,
        );
        this.employeeOvertimes.push({
          time_check_in: item.time_check_in,
          salary: this.currentWorkDaysPlusDaily,
          daily_salary: this.totalDailyPayslip,
          total_work: item.totalWork,
          total_overtime: item.meta.totalOvertime,
          total_overtime_early: item.meta.totalOvertimeEarly,
          overtime_cost: cost,
          total_salary: this.currentWorkDaysPlusDaily + cost,
        });

        this.dailyOvertime.push({
          date: item.date,
          value: item.meta.totalOvertime,
          cost,
        });
        if (sameDay) {
          totalOvertime += calculateWorkingDays(item.meta.totalWork, 1800)
            .result;
        } else {
          totalOvertime +=
            item.meta.totalOvertime +
            item.meta.totalOvertimeEarly /* + item.meta.totalOvertimeEarly */;
        }
        dailyOvertimeReward += cost;
      }
    }
    this.totalOvertimeDuration = totalOvertime;
    this.dailyOvertimeReward = dailyOvertimeReward;
  }

  /* gaji pokok */
  calculateUMRDaily() {
    this.UMRDaily = calculateUMRDaily(
      this.employee.department.meta.payslip_filter,
      Number(this.employee.group.base_salary),
    );
  }

  /* premi hari besar */
  getHolidayBonus() {
    this.holidayBonus =
      this.UMRDaily * Number(this.$route.params.totalHolidays);
  }

  /* lama kerja/durasi */
  calculateWorkDurationBonusEmployee() {
    this.totalAbsentDay = 0;

    const date_now: Date = new Date();
    const decimal_result: boolean = true;
    // TODO:  array time_check_in attendance
    const currentAttendances: any = [];
    const currentSchedules: any = this.employee.attendances[0].meta.group_meta
      .schedule.schedules;
    const dateStart: string = this.$route.params.dateStart;
    const dateEnd: string = this.$route.params.dateEnd;

    for (const item of this.employee.attendances) {
      currentAttendances.push(item.check_in);
    }
    this.totalWorkDuration = newIsNeverAbsent(
      currentAttendances,
      currentSchedules,
      Number(this.$route.params.totalDayWorks),
      this.$route.params.dataHolidays,
      dateStart,
      dateEnd,
    );
    if (this.totalWorkDuration.totalAbsent > 0) {
      this.totalAbsentDay += this.totalWorkDuration.totalAbsent;
    }
    this.workDurationBonus = calculateWorkDurationBonus(
      this.employee.active_date,
      date_now,
      decimal_result,
    );
  }

  /* potongan jam masuk */
  newCalculateLateAndLeaveDeduction() {
    this.totalLateDuration = 0;
    this.employeeDeductions = [];

    this.totalLateCalculated = 0;
    this.totalLeaveCalculated = 0;

    this.dailyDeduction = [];
    let tempLeave: any = {
      nominal: 0,
      calculated_duration: 0,
    };
    let tempLate: any = {
      nominal: 0,
      calculated_duration: 0,
    };
    const tempDataLeave: any = {};
    let deductionCost: number = 0;
    const attendances: any = this.employee.attendances;
    const validateLeave: any = {
      dayLeave: 0,
      hourLeave: 0,
      duration: 0,
      dates: [],
    };
    let leaveManual: any = [];
    if (this.employee.leaves.length > 0) {
      leaveManual = getAbsentFromLeaves(
        this.employee.leaves,
        this.$route.params,
      );
      console.info('leave manual', leaveManual);
      // tempDataLeave = calculateLateAndLeaveDeduction(
      //   validateLeave.duration,
      //   validateLeave.date,
      //   this.UMRDaily,
      // );
      // this.totalLateDuration += tempDataLeave.calculated_duration;
      // leaveDeduction = tempDataLeave.nominal;
      // if (validateLeave.dayLeave > 0) {
      //   const value =
      //     this.totalWorkDuration.currentWorkDays - this.workDayValue;
      //   this.totalAbsentDay += value < 0 ? value * -1 : 0;
      //   this.totalAbsentDay += validateLeave.dayLeave;
      // }
    }
    this.totalLateDuration += validateLeave.hourLeave * 3600;

    for (const item of attendances) {
      this.totalLateCalculated += item.meta.totalLate;
      this.totalLeaveCalculated += item.meta.totalLeave;

      let checkHoliday: boolean = false;
      this.$route.params.dataHolidays.split(',').forEach((el: any) => {
        const dateHoliday = Number(el.substring(8, 10));
        const dateCheckIn = Number(item.time_check_in.substring(8, 10));
        if (dateHoliday === dateCheckIn) {
          checkHoliday = true;
        }
      });

      if (!checkHoliday) {
        const dailyDeduction: any = {
          real_duration: 0,
          calculated_duration: 0,
          cost: 0,
          date: item.date,
        };
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

        const totalAbsensi = leaveManual.find((el: any) => {
          return (
            moment(item.time_check_in).get('date') ===
            moment(el.date).get('date')
          );
        });

        // {hourLeave: 1, duration: 3600, date: "2020-02-09T02:00:00.000Z"}
        const total_deduction_value =
          item.meta.totalLeave +
          item.meta.totalLate +
          (totalAbsensi ? totalAbsensi.duration : 0);
        tempLeave = calculateLateAndLeaveDeduction(
          item.time_check_in,
          item.meta.totalLeave + (totalAbsensi ? totalAbsensi.duration : 0),
          item.time_check_in,
          this.UMRDaily,
        );

        tempLate = calculateLateAndLeaveDeduction(
          item.time_check_in,
          item.meta.totalLate,
          item.time_check_in,
          this.UMRDaily,
        );
        dailyDeduction.cost += tempLeave.nominal + tempLate.nominal;
        dailyDeduction.real_duration += total_deduction_value;
        dailyDeduction.calculated_duration +=
          tempLeave.calculated_duration + tempLate.calculated_duration;
        deductionCost += dailyDeduction.cost;

        this.totalLateDuration += dailyDeduction.calculated_duration;
        this.employeeDeductions.push({
          type,
          time_check_in: item.time_check_in,
          total_late: item.meta.totalLate,
          total_leave: item.meta.totalLeave,
          cost: dailyDeduction.cost,
        });
        this.dailyDeduction.push(dailyDeduction);
      }
    }

    const leaveDeduction = 0;
    this.deductionLateCheckin = deductionCost + leaveDeduction;
  }

  get getDeductionDuration() {
    if (this.totalLateDuration >= 3600) {
      return convertSecondToTimeRound(
        calculateWorkingDays(this.totalLateDuration, 1800).result,
      );
    } else if (
      this.totalLateDuration < 3600 &&
      this.totalLateDuration >= 1800
    ) {
      const total =
        calculateWorkingDays(this.totalLateDuration, 1800).result +
        calculateWorkingDays(this.totalLateDuration, 1800).leftover;
      return `(${convertSecondToTime(total)})`;
    } else {
      const time = this.totalLateDuration;
      return `(${convertSecondToTime(this.totalLateDuration)})`;
    }
  }

  get getOvertimeValue() {
    return convertSecondToTimeRound(this.totalOvertimeDuration);
  }

  /* potongan jam mdasdasukdd */
  getDeductionLateCheckIn() {
    setTotalLateDuration(0);
    let deduction: any = 0;
    const base_salary = this.UMRDaily;
    for (const item of this.employee.attendances) {
      const dailyDeduction: any = {
        real_duration: 0,
        calculated_duration: 0,
        cost: 0,
        date: item.date,
      };

      let tempData: any = {};
      const time_check_in: string = item.time_check_in;
      const time_break_start: string = item.time_check_out_for_break;
      const time_break_end: string = item.time_check_in_for_break;
      const time_check_out: string = item.time_check_out;
      const schedule: any = {
        time_check_in: item.scheduleToday.start_one,
        time_check_out: item.scheduleToday.start_two,
        time_break_start: item.scheduleToday.end_one,
        time_break_end: item.scheduleToday.end_two,
      };
      const dayStatus: boolean = item.scheduleToday.active;
      let checkHoliday: boolean = false;
      this.dataHolidays.forEach((el: any) => {
        const dateHoliday = Number(el.substring(8, 10));
        const dateCheckIn = Number(item.time_check_in.substring(8, 10));
        console.info(
          'pajak',
          dateHoliday === dateCheckIn,
          dateHoliday,
          dateCheckIn,
        );
        if (dateHoliday === dateCheckIn) {
          checkHoliday = true;
        }
      });
      if (!checkHoliday) {
        tempData = formulaDeductionNominalLateCheckInDaily(
          time_check_in,
          schedule,
          base_salary,
          'check_in',
        );
        dailyDeduction.cost += tempData.nominal;
        dailyDeduction.real_duration += tempData.real_duration;
        dailyDeduction.calculated_duration += tempData.calculated_duration;

        if (dayStatus) {
          tempData = formulaDeductionNominalLateCheckInDaily(
            time_check_out,
            schedule,
            base_salary,
            'check_out',
          );
          dailyDeduction.cost += tempData.nominal;
          dailyDeduction.real_duration += tempData.real_duration;
          dailyDeduction.calculated_duration += tempData.calculated_duration;

          tempData = formulaDeductionNominalLateCheckInDaily(
            time_break_start,
            schedule,
            base_salary,
            'break_start',
          );
          dailyDeduction.cost += tempData.nominal;
          dailyDeduction.real_duration += tempData.real_duration;
          dailyDeduction.calculated_duration += tempData.calculated_duration;

          tempData = formulaDeductionNominalLateCheckInDaily(
            time_break_end,
            schedule,
            base_salary,
            'break_end',
          );
          dailyDeduction.cost += tempData.nominal;
          dailyDeduction.real_duration += tempData.real_duration;
          dailyDeduction.calculated_duration += tempData.calculated_duration;
        }
      }
      this.dailyDeduction.push(dailyDeduction);
      deduction += dailyDeduction.cost;
    }

    if (this.employee.leaves.length > 0) {
      for (const leave of this.employee.leaves) {
        const dateStart: any = new Date(this.$route.params.dateStart).getTime();
        const dateEnd: any = new Date(this.$route.params.dateEnd).getTime();
        const leaveStart: any = new Date(leave.date_start).getTime();
        const leaveEnd: any = new Date(leave.date_end).getTime();
        if (
          leaveStart >= dateStart &&
          leaveStart <= dateEnd &&
          leaveEnd >= dateStart &&
          leaveEnd <= dateEnd
        ) {
          // calculate time leave
          let tempData: any = {};
          const dailyDeduction: any = {
            real_duration: 0,
            calculated_duration: 0,
            cost: 0,
            date: leave.date_start,
          };
          const totalLeaveDuration =
            (new Date(leave.date_end).getTime() -
              new Date(leave.date_start).getTime()) /
            1000;
          if (totalLeaveDuration > 0) {
            tempData = calculateDeductionFlexible(
              totalLeaveDuration,
              leave.date_start,
              base_salary,
            );
            dailyDeduction.cost += tempData.nominal;
            dailyDeduction.real_duration += tempData.real_duration;
            dailyDeduction.calculated_duration += tempData.calculated_duration;
          }
          this.dailyDeduction.push(dailyDeduction);
          deduction += dailyDeduction.cost;
        }
      }
    } else {
      this.neverLeave = true;
      if (this.employee.meta.payslip.extra_full.indicator) {
        this.neverLeaveBonus = this.employee.meta.payslip.extra_full.nominal;
      }
    }
    this.deductionLateCheckin = deduction;
    this.totalLateDuration = totalLateDuration / 60;
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
    const query: any = {
      department_id: departmentId,
      date_start: dateStart,
      date_end: dateEnd[0] + '.000Z',
    };
    await EmployeeStore.getEmployeeDataForPayslip(query);
    // const query: any = {
    //   filters: [
    //     {
    //       field: 'name',
    //       value: 'ASC',
    //     },
    //     {
    //       field: 'attendances.time_check_in',
    //       value: 'ASC',
    //     },
    //     {
    //       field: 'department',
    //       value: 'join',
    //     },
    //     {
    //       field: 'department_id',
    //       operator: 'eq',
    //       value: departmentId,
    //     },
    //     {
    //       field: 'group',
    //       value: 'join',
    //     },
    //     {
    //       field: 'area',
    //       value: 'join',
    //     },
    //     {
    //       field: 'position',
    //       value: 'join',
    //     },
    //     {
    //       field: 'attendances',
    //       value: 'join',
    //     },
    //     {
    //       field: 'leaves',
    //       value: 'join',
    //     },
    //     {
    //       field: 'loans',
    //       value: 'join',
    //     },
    //     {
    //       field: 'attendances.time_check_in',
    //       operator: 'between',
    //       value: queryId,
    //     },
    //   ],
    // };
    // await EmployeeStore.getAllEmployee(query);
    this.listPayslip.forEach((el: any) => {
      if (el.temp_payslip_data) {
        this.isFilled = true;
      }
    });
    if (!this.isFilled) {
      PayslipStore.setListPayslipTemp(this.listEmployee);
    }
    if (this.listEmployee.length > 0) {
      this.getDataEmployee(this.indexEmployee);
      this.calculateUMRDaily();
      this.calculateWorkDurationBonusEmployee();
      this.getExtraFull();
      this.getHolidayBonus();
      this.getOvertimeReward();
      this.newCalculateLateAndLeaveDeduction();
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
    const attendances: any = this.employee.attendances.map((el: any) => {
      const dailyOvertime: any = this.dailyOvertime.find(
        (item: any) => el.date === item.date,
      );
      const dailyDeduction: any = this.dailyDeduction.find(
        (item: any) => el.date === item.date,
      );
      el = {
        ...el,
        dailyOvertime,
        dailyDeduction,
      };
      return el;
    });
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
      total_day:
        this.employee.meta.payslip.lama_kerja &&
        this.employee.meta.payslip.lama_kerja !== 0
          ? this.employee.meta.payslip.lama_kerja
          : this.workDurationBonus.toFixed(2),
      daily_base_salary: this.UMRDaily.toFixed(2),
      total_base_daily: this.totalDailyPayslip.toFixed(2),
      total_base: this.currentWorkDaysPlusDaily.toFixed(2),
      total_reward: this.totalDailyPayslip.toFixed(2),
      total_deduction: this.totalDeduction.toFixed(2),
      total: this.totalIncomeCleanNumber.toFixed(2),
      payslip_meta: {
        // data overtime
        employee_overtimes: this.employeeOvertimes,
        employee_deductions: this.employeeDeductions,
        base: {
          gaji_pokok: this.UMRDaily,
          lama_kerja:
            this.employee.meta.payslip.lama_kerja &&
            this.employee.meta.payslip.lama_kerja !== 0
              ? this.employee.meta.payslip.lama_kerja
              : this.workDurationBonus,
          tunjangan_jabatan: this.positionBonus,
          tunjangan_skill: this.skillBonus,
          insentif: this.employee.meta.payslip.insentif,
          upah_1_hari: this.totalDailyPayslip,
          durasi_lama_kerja: this.humanizeActiveDate,
        },
        rewards: {
          upah_n_kerja: this.currentWorkDaysPlusDaily,
          extra_full: this.newNeverLeaveBonus,
          lembur: this.dailyOvertimeReward,
          durasi_lembur: this.getOvertimeValue,
          premi_hari_besar: this.holidayBonus,
          total_pendapatan: this.totalIncome,
        },
        deductions: {
          data_potongan: this.dailyDeduction,
          potongan_astek: this.employee.meta.payslip.astek_deduction,
          potongan_spsi: this.employee.meta.payslip.spsi_deduction,
          potongan_lain_lain: this.employee.meta.payslip.value_food_deduction,
          potongan_jam_masuk: this.deductionLateCheckin,
          potongan_jam_masuk_real: this.getDeductionDuration,
          potongan_bon: this.employee.meta.payslip.value_bon_deduction,
          total_potongan: this.totalDeduction,
        },
        // TODO: add leave duration and cost
        attendance_calculation: {
          // total_hari_kerja: this.workDayValue,
          total_hari_kerja: this.totalDayWorks,
          total_hari_tidak_masuk: this.totalAbsentDay,
          total_hari_masuk: this.totalWorkDuration.currentWorkDays,
          total_hari_libur: this.totalHolidays,
          durasi_izin: this.totalLeaveCalculated,
          satuan_izin: '',
          potongan_izin: 0,
          durasi_terlambat: this.totalLateCalculated,
          potongan_terlambat: this.deductionLateCheckin,
          durasi_lembur: this.totalOvertimeDuration,
          tambahan_lembur: this.dailyOvertimeReward,
          workDuration: this.totalWorkDuration,
        },
        total_pendapatan: this.totalIncome,
        total_potongan: this.totalDeduction,
        pendapatan_gaji: this.totalIncomeCleanNumber,
        pendapatan_gaji_nominal: this.totalIncomeCleanValue,
        sisa_pinjaman: this.totalBonDeductionValueNow,
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
      console.info('ful berkah');
      PayslipStore.updatePayslipTemp(newEmployee);
      this.temp = this.employee;
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
      } else {
        this.indexEmployee += 1;
      }
      this.getDataEmployee(this.indexEmployee);
      this.calculateUMRDaily();
      this.calculateWorkDurationBonusEmployee();
      this.getExtraFull();
      this.getHolidayBonus();
      this.getOvertimeReward();
      this.newCalculateLateAndLeaveDeduction();
      this.getEmployeeLoans();
    }
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
      this.incomeCleanNumberNegative = true;
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

  generatePayslip() {
    // let find: boolean = false;
    // this.listPayslip.forEach((el: any) => {
    //   if (!el.temp_payslip_data) {
    //     find = true;
    //   }
    // });
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
      PayslipStore.setListPayslipTemp(payload);
      this.$router.push({
        name: 'print-payslip',
        params: {
          ...this.$route.params,
        },
      });
    }
  }

  getDataEmployee(index: number) {
    const find = this.listPayslip[index];
    EmployeeStore.choosePayslip(find);
  }

  getFromTemporaryByIndex(index: any) {
    const findPayslipByIndex: any = this.listPayslip[index];
    console.info('index');
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
