import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import {
  calculateUMRDaily,
  calculateWorkDurationBonus,
} from '@/common/utils/baseCalculation';
import {
  formatDate,
  formatPricePayslip,
  openSnackbarNow,
} from '@/common/utils/config';
import { formulaDeductionNominalLateCheckInDaily } from '@/common/utils/formulaCalculation';
import { getDailyOvertimeReward, isNeverAbsent } from '@/common/utils/overtime';
import Filters from '@/components/includes/Filter.vue';
import { AttendanceStore } from '@/store/modules/attendance';
import { AuthModule } from '@/store/modules/auth';
import { EmployeeStore } from '@/store/modules/employee';
import { PayslipStore } from '@/store/modules/payslip';
import angkaTerbilang from '@develoka/angka-terbilang-js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { InitQueryEmployee } from '../../common/interfaces/query';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);

@Component({
  name: 'Payslip',
  components: { Filters },
})
export default class Payslip extends Vue {
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

  // METHODS
  beforeRouteLeave(to: any, from: any, next: any) {
    if (this.listEmployee.length > 0) {
      const answer = window.confirm(
        'Apakah anda ingin keluar dari halaman ini? Pastikan anda telah menyimpan data payslip dan mencetak payslip.',
      );
      if (answer) {
        this.removePayslipTemp();
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  }

  async mounted() {
    await this.getListData();
    this.payslipType = this.employee.department.meta.payslip_type;
  }

  // GETTERS
  get isLoadingEmployee(): any {
    return EmployeeStore.isLoadingEmployee;
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

  get skillBonus(): string {
    return this.employee.area.bonus;
  }

  get positionBonus(): string {
    return this.employee.position.bonus;
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
    return (
      this.dailyOvertimeReward +
      this.employee.meta.payslip.value_extra_full +
      this.currentWorkDaysPlusDaily +
      this.employee.meta.payslip.value_holiday
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

  @Watch('indexEmployee')
  changeIndexEmployee() {
    // const findDataPayslip: any = this.listPayslip.find((el: any) => {
    //   return el.id === this.employee.id;
    // });
    // if (findDataPayslip) {
    //   if (this.indexEmployee <= 0) {
    //     this.indexEmployee = 0;
    //   } else if (this.indexEmployee >= this.listEmployee.length - 1) {
    //     this.indexEmployee = this.listEmployee.length - 1;
    //   }
    //   if (this.listPayslip.length > 0) {
    //     this.getFromTemporary(findDataPayslip);
    //   } else {
    //     this.confirmGeneratePayslip = true;
    //     this.getDataEmployee(this.indexEmployee);
    //   }
    //   this.calculateUMRDaily();
    //   this.calculateWorkDurationBonus();
    //   this.getDailyOvertimeReward();
    //   this.formulaDeductionNominalLateCheckInDaily();
    // } else {
    //   this.getDataEmployee(this.indexEmployee);
    // }
    // if (this.indexEmployee <= 0) {
    //   this.indexEmployee = 0;
    // } else if (this.indexEmployee >= this.listEmployee.length - 1) {
    //   this.indexEmployee = this.listEmployee.length - 1;
    // }
  }

  previousEmployee() {
    const findDataPaylsip: any = this.listPayslip.find((el: any) => {
      return el.id === this.employee.id;
    });
    if (findDataPaylsip) {
      if (this.indexEmployee <= 0) {
        this.indexEmployee = 0;
      } else {
        this.indexEmployee -= 1;
      }
      // this.getFromTemporaryById(findDataPaylsip.id);
      this.getFromTemporaryByIndex(this.indexEmployee);
      this.calculateUMRDaily();
      this.calculateWorkDurationBonus();
      this.getDailyOvertimeReward();
      this.formulaDeductionNominalLateCheckInDaily();
    } else {
      this.confirmGeneratePayslip = true;
    }
  }

  nextEmployee() {
    const findDataPaylsip: any = this.listPayslip.find((el: any) => {
      return el.id === this.employee.id;
    });
    if (findDataPaylsip) {
      if (this.indexEmployee >= this.listEmployee.length - 1) {
        this.indexEmployee = this.listEmployee.length - 1;
      } else {
        this.indexEmployee += 1;
      }
      this.getFromTemporaryByIndex(this.indexEmployee);
      this.calculateUMRDaily();
      this.calculateWorkDurationBonus();
      this.getDailyOvertimeReward();
      this.formulaDeductionNominalLateCheckInDaily();
    } else {
      this.confirmGeneratePayslip = true;
    }
  }

  selectDetailPayslip(id: string, index: number) {
    this.showProcess = false;
    this.indexEmployee = index;
    this.getFromTemporaryById(id);
  }

  // FORMULA
  /* upah lembur */
  getDailyOvertimeReward() {
    const dailyOvertimeReward: any = 0;
    for (const item of this.employee.attendances) {
      if (item.meta.totalOvertime) {
        /*dailyOvertimeReward += getDailyOvertimeReward(
          new Date(item.time_check_out),
          Number(this.totalDailyPayslip),
          Number(item.meta.totalOvertime) / 3600,
        );*/
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
    const currentSchedules: any = this.employee.group.schedule.schedules;
    const dateStart: string = '2019-10-01';
    const dateEnd: string = '2019-10-30';

    for (const item of this.employee.attendances) {
      currentAttendances.push(item.check_in);
    }

    this.totalWorkDuration = isNeverAbsent(
      currentAttendances,
      currentSchedules,
      dateStart,
      dateEnd,
    );
    this.workDurationBonus = calculateWorkDurationBonus(
      this.employee.active_date,
      date_now,
      decimal_result,
    );
  }

  /* potongan jam masuk */
  formulaDeductionNominalLateCheckInDaily() {
    let deduction: any = 0;
    for (const item of this.employee.attendances) {
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
      // const base_salary = this.totalDailyPayslip;
      const base_salary = this.UMRDaily;
      deduction += formulaDeductionNominalLateCheckInDaily(
        time_check_in,
        schedule,
        base_salary,
        'check_in',
      );
      deduction += formulaDeductionNominalLateCheckInDaily(
        time_check_out,
        schedule,
        base_salary,
        'check_out',
      );
      deduction += formulaDeductionNominalLateCheckInDaily(
        time_break_start,
        schedule,
        base_salary,
        'break_start',
      );
      deduction += formulaDeductionNominalLateCheckInDaily(
        time_break_end,
        schedule,
        base_salary,
        'break_end',
      );
    }
    this.deductionLateCheckin = deduction;
  }

  removePayslipTemp() {
    PayslipStore.removePayslipTemp();
  }

  async getListData() {
    const departmentId: string = this.$route.params.departmentId;
    const dateStart: any = new Date(this.$route.params.dateStart).toISOString();
    const dateEnd: any = new Date(this.$route.params.dateEnd).toISOString();
    const queryId: string = dateStart + ',' + dateEnd;
    const query: any = {
      filters: [
        {
          field: 'name',
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
          field: 'attendances.time_check_in',
          operator: 'between',
          value: queryId,
        },
      ],
    };
    await EmployeeStore.getAllEmployee(query);
    PayslipStore.setListPayslipTemp(this.listPayslip);
    if (this.listEmployee.length > 0) {
      this.getDataEmployee(this.indexEmployee);
      this.calculateUMRDaily();
      this.calculateWorkDurationBonus();
      this.getDailyOvertimeReward();
      this.formulaDeductionNominalLateCheckInDaily();
    }
  }

  savePayslipTemporary() {
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
      employee_meta: this.employee,
      base_salary: Number(this.employee.group.base_salary),
      total_day: this.workDurationBonus,
      daily_base_salary: this.UMRDaily,
      total_base_daily: this.totalDailyPayslip,
      total_base: this.currentWorkDaysPlusDaily,
      total_reward: this.totalDailyPayslip,
      total_deduction: this.totalDeduction,
      total: this.totalIncomeCleanNumber,
      payslip_meta: {
        base: {
          gaji_pokok: this.UMRDaily,
          lama_kerja: this.workDurationBonus,
          tunjangan_jabatan: this.positionBonus,
          tunjangan_skill: this.skillBonus,
          insentif: this.employee.meta.payslip.insentif,
          upah_1_hari: this.totalDailyPayslip,
        },
        rewards: {
          upah_n_kerja: this.currentWorkDaysPlusDaily,
          extra_full: this.employee.meta.payslip.value_extra_full,
          lembur: this.dailyOvertimeReward,
          premi_hari_besar: this.employee.meta.payslip.value_holiday,
          total_pendapatan: this.totalIncome,
        },
        deductions: {
          potongan_astek: this.employee.meta.payslip.astek_deduction,
          potongan_spsi: this.employee.meta.payslip.spsi_deduction,
          potongan_uang_makan: this.employee.meta.payslip.value_food_deduction,
          potongan_jam_masuk: this.deductionLateCheckin,
          potongan_bon: this.employee.meta.payslip.value_bon_deduction,
          total_potongan: this.totalDeduction,
        },
      },
    };
    const newEmployee: any = {
      ...this.employee,
      temp_payslip_data: dataPayslip,
    };
    const findDataPayslip: any = this.listPayslip.find((el: any) => {
      return this.employee.id === el.id;
    });
    if (this.listPayslip.length > 0 && findDataPayslip) {
      PayslipStore.updatePayslipTemp(newEmployee);
    } else {
      PayslipStore.setPayslipTemp(newEmployee);
      const snackbar = {
        ...this.snackbar,
        value: true,
        message: 'Berhasil menyimpan data',
        color: 'success',
      };
      openSnackbarNow(snackbar);
      if (this.indexEmployee + 1 >= this.listEmployee.length - 1) {
        this.indexEmployee = this.listEmployee.length - 1;
      } else {
        this.indexEmployee += 1;
      }
      this.getDataEmployee(this.indexEmployee);
    }
    this.confirmSetPayslip = false;
  }

  convertPeriodDate(date: string) {
    return formatDate(date, 'long');
  }

  convertDate(date: string, type: string) {
    return formatDate(date, type);
  }

  checkConfirm() {
    this.confirmSetPayslip = true;
  }

  updatePayslipTemporary() {
    const dataPayslip: any = {
      start_at: new Date(this.$route.params.dateStart).toISOString(),
      end_at: new Date(this.$route.params.dateEnd).toISOString(),
      print_at: this.dateNow.toISOString(),
      employee_id: this.employee.id,
      employee_meta: this.employee,
      base_salary: Number(this.employee.group.base_salary),
      total_day: this.workDurationBonus,
      daily_base_salary: this.UMRDaily,
      total_base_daily: this.totalDailyPayslip,
      total_base: this.currentWorkDaysPlusDaily,
      total_reward: this.totalDailyPayslip,
      total_deduction: this.totalDeduction,
      total: this.totalIncomeCleanNumber,
      payslip_meta: {
        base: {
          gaji_pokok: this.UMRDaily,
          lama_kerja: this.workDurationBonus,
          tunjangan_jabatan: this.positionBonus,
          tunjangan_skill: this.skillBonus,
          insentif: this.employee.meta.payslip.insentif,
          upah_1_hari: this.totalDailyPayslip,
        },
        rewards: {
          upah_n_kerja: this.currentWorkDaysPlusDaily,
          extra_full: this.employee.meta.payslip.value_extra_full,
          lembur: this.dailyOvertimeReward,
          premi_hari_besar: this.employee.meta.payslip.value_holiday,
          total_pendapatan: this.totalIncome,
        },
        deductions: {
          potongan_astek: this.employee.meta.payslip.astek_deduction,
          potongan_spsi: this.employee.meta.payslip.spsi_deduction,
          potongan_uang_makan: this.employee.meta.payslip.value_food_deduction,
          potongan_jam_masuk: this.deductionLateCheckin,
          potongan_bon: this.employee.meta.payslip.value_bon_deduction,
          total_potongan: this.totalDeduction,
        },
      },
    };
    const newEmployeepayslip: any = {
      ...this.employee,
      payslip_data: dataPayslip,
    };
    PayslipStore.updatePayslipTemp(newEmployeepayslip);
  }

  getDataEmployee(index: number) {
    EmployeeStore.setEmployeeData(index);
  }

  getFromTemporary(data: any) {
    EmployeeStore.setRawEmployeeData(data);
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
}
