import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import { formatDate, openSnackbarNow } from '@/common/utils/config';
import {isDateArrayInsideRange} from '@/common/utils/timeCalculation';
import { DepartmentStore } from '@/store/modules/department';
import moment from 'moment';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';

@Component({
  name: 'ChoosePayslip',
})
export default class ChoosePayslip extends Vue {
  choosenDepartment: any = {
    name: null,
    meta: {
      payslip_type: '0',
    },
  };
  payslipDurationList: any = [
    {
      id: 1,
      name: 'Payslip Mingguan',
    },
    {
      id: 2,
      name: 'Payslip Bulanan',
    },
  ];
  payslipDuration: number = 0;
  date: boolean = false;
  month: boolean = false;
  dateStart: string = '';
  monthStart: string = '';
  dateEnd: string = '';
  snackbar: ISnackbar = InitSnackbar;
  dateNow: string = new Date().toISOString().substring(0, 10);
  allowedDates: any = {};
  allowedDatesHoliday: any = {};

  holidays: any = [];
  isHoliday: boolean = false;

  weekStart: string = '';
  weekEnd: string = '';

  totalDays: number = 0;
  totalDayWork: number = 0;

  get listDepartments(): any {
    return DepartmentStore.listDepartment;
  }

  @Watch('dateStart')
  changeDateStart() {
    if (this.payslipDuration === 1 && this.dateStart !== '') {
      this.holidays = [];
      this.dateEnd = moment(this.dateStart)
        .add(6, 'd')
        .format('YYYY-MM-DD');

      this.totalDays =
        moment(this.dateStart)
          .endOf('week')
          .diff(moment(this.dateStart).startOf('week'), 'days') + 1;
    }
  }

  @Watch('payslipDuration')
  changePayslipDuration() {
    this.monthStart = '';
    this.dateStart = '';
    this.dateEnd = '';
    this.totalDayWork = 0;
    this.totalDays = 0;
    this.holidays = [];
  }

  @Watch('monthStart')
  changeMonthStart() {
    if (this.monthStart !== '') {
      this.holidays = [];
      this.dateStart = moment(this.monthStart + '-1')
        .startOf('month')
        .format('YYYY-MM-DD');
      this.dateEnd = moment(this.dateStart)
        .endOf('month')
        .format('YYYY-MM-DD');
      this.totalDays = moment(this.monthStart).daysInMonth();
    }
  }

  @Watch('holidays')
  changeHolidays() {
    this.totalDayWork = 0;
    this.totalDayWork = this.totalDays - this.holidays.length;
  }

  mounted() {
    this.getListDepartments();
    this.setAllowedDays();
  }

  setAllowedDays() {
    this.allowedDates = (val: any) => ![0].includes(new Date(val).getDay());
    this.allowedDatesHoliday = (val: any) =>
      ![0].includes(new Date(val).getDay());
  }

  formatDate(value: any) {
    return formatDate(value, 'long');
  }

  getListDepartments() {
    DepartmentStore.getAllDepartment({});
  }

  saveFilter() {
    if (
      this.choosenDepartment === null ||
      this.dateStart === '' ||
      this.dateEnd === ''
    ) {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message:
          'Anda harus memilih departemen, tanggal mulai dan tanggal selesai!',
        color: 'warn',
      };
      openSnackbarNow(snackbar);
    } else if(!isDateArrayInsideRange(this.holidays, this.dateStart, this.dateEnd)) {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message:
          'Anda harus memilih hari libur di antara tanggal mulai dan selesai periode!',
        color: 'error',
      };
      openSnackbarNow(snackbar);
    } else {
      const filteredAllowedHoliday:any=[];
      for (const [idx,holidayItem] of this.holidays.entries()) {
        if(moment(holidayItem).diff(this.dateStart) >= 0 && moment(this.dateEnd).diff(holidayItem) >= 0) {
            filteredAllowedHoliday.push(holidayItem);
        }
      }
      this.holidays = filteredAllowedHoliday;
      if (this.choosenDepartment.meta.payslip_type === '1') {
        // produksi
        this.$router.push({
          name: 'report-payslip-produksi',
          params: {
            payslipType: '1',
            dataHolidays:
              this.holidays.length > 0 ? this.holidays.toString() : '0',
            totalHolidays: this.holidays.length,
            totalDayWorks: this.totalDayWork.toString(),
            totalDays: this.totalDays.toString(),
            payslipFilter: this.choosenDepartment.meta.payslip_filter.toString(),
            departmentId: this.choosenDepartment.id,
            dateStart: this.dateStart,
            dateEnd: moment(this.dateEnd)
              .add(23, 'hours')
              .format('YYYY-MM-DD'),
          },
        });
      } else if (this.choosenDepartment.meta.payslip_type === '2') {
        // toko
        this.$router.push({
          name: 'report-payslip-toko',
          params: {
            payslipType: '2',
            dataHolidays:
              this.holidays.length > 0 ? this.holidays.toString() : '0',
            totalHolidays: this.holidays.length,
            totalDayWorks: this.totalDayWork.toString(),
            totalDays: this.totalDays.toString(),
            payslipFilter: this.choosenDepartment.meta.payslip_filter.toString(),
            departmentId: this.choosenDepartment.id,
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
          },
        });
      } else if (this.choosenDepartment.meta.payslip_type === '3') {
        // office
        this.$router.push({
          name: 'report-payslip-kantor',
          params: {
            payslipType: '3',
            dataHolidays:
              this.holidays.length > 0 ? this.holidays.toString() : '0',
            totalHolidays: this.holidays.length,
            totalDayWorks: this.totalDayWork.toString(),
            totalDays: this.totalDays.toString(),
            payslipFilter: this.choosenDepartment.meta.payslip_filter.toString(),
            departmentId: this.choosenDepartment.id,
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
          },
        });
      }
    }
  }

  selectDepartment(id: string) {
    this.choosenDepartment = this.listDepartments.find((el: any) => {
      return el.id === id;
    });
    this.payslipDuration = this.choosenDepartment.meta.payslip_filter;
    if (this.choosenDepartment.meta.payslip_type === '1') {
      // this.payslipDuration = this.choosenDepartment.meta.payslip_filter;
    } else if (this.choosenDepartment.meta.payslip_type === '3') {
      // this.payslipDuration = this.choosenDepartment.meta.payslip_filter;
    }
    // this.dateStart = '';
    // this.dateEnd = '';
  }

  selectPayslipType(id: number) {
    // this.payslipDuration = this.choosenDepartment.meta.payslip_filter;
    if (this.choosenDepartment.meta.payslip_type === '2') {
      this.dateStart = '';
      this.dateEnd = '';
    }
  }
}
