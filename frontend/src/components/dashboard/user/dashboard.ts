import {
  convertSecondToTimeRound,
  formatDate,
  formatPrice,
} from '@/common/utils/config';
import { calculateWorkingDays } from '@/common/utils/timeCalculation';
import { AuthModule } from '@/store/modules/auth';
import { EmployeeStore } from '@/store/modules/employee';
import { PayslipStore } from '@/store/modules/payslip';
import { ReportStore } from '@/store/modules/report';
import moment from 'moment';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';

@Component({
  name: 'BaseDashboard',
})
export default class BaseDashboard extends Vue {
  date: boolean = false;
  date2: boolean = false;
  date3: boolean = false;
  dateStart: string = new Date().toISOString().substr(0, 10);
  dateStartDiligent: string = new Date().toISOString().substr(0, 10);
  dateStartWeekly: string = new Date().toISOString().substr(0, 10);
  dateEndWeekly: string = new Date(new Date().getTime() + 604800000)
    .toISOString()
    .substr(0, 10);
  initFilterMonthly: string = new Date().toISOString().substr(0, 7);
  monthNames: any = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  monthName: any = '';
  monthNameDiligent: any = '';
  yearName: number = 0;

  get listEmployeeBirthday() {
    return EmployeeStore.listEmployeeBirthday;
  }

  get listCurrentEmployeeBirthday() {
    return EmployeeStore.listCurrentEmployeeBirthday;
  }

  get userRole() {
    return AuthModule.roles;
  }

  get listEmployeeLongest() {
    return EmployeeStore.listEmployeeLongest.slice(0, 6);
  }
  get totalEmployee() {
    return EmployeeStore.totalEmployee;
  }

  get employeeActive() {
    return EmployeeStore.employeeActive;
  }
  get newDate() {
    return moment(new Date())
      .locale('id')
      .format('DD/MM/YYYY');
  }

  get currentMonthStartAndEndDate() {
    const dateStart = moment()
      .startOf('month')
      .locale('id')
      .format('DD/MM/YYYY');
    const dateEnd = moment()
      .endOf('month')
      .locale('id')
      .format('DD/MM/YYYY');
    return dateStart + ' - ' + dateEnd;
  }

  get previousMonthStartAndEndDate() {
    const dateStart = moment()
      .subtract(1, 'months')
      .startOf('month')
      .locale('id')
      .format('DD/MM/YYYY');
    const dateEnd = moment()
      .subtract(1, 'months')
      .endOf('month')
      .locale('id')
      .format('DD/MM/YYYY');
    return dateStart + ' - ' + dateEnd;
  }

  get thisMonth() {
    if (new Date().getMonth() === 0) {
      return (
        moment(new Date())
          .locale('id')
          .format('MMMM') +
        ' ' +
        new Date().getFullYear()
      );
    } else {
      return moment(new Date())
        .locale('id')
        .format('MMMM');
    }
  }

  get previousMonth() {
    if (new Date().getMonth() === 0) {
      return (
        moment(new Date())
          .locale('id')
          .subtract(1, 'months')
          .format('MMMM') +
        ' ' +
        (new Date().getFullYear() - 1)
      );
    } else {
      return moment(new Date())
        .locale('id')
        .subtract(1, 'months')
        .format('MMMM');
    }
  }

  get newDateLong() {
    return moment(new Date())
      .locale('id')
      .format('DD MMMM YYYY');
  }
  get totalEmployeeActive() {
    return this.employeeActive.length;
  }

  get listPayslipReport() {
    return PayslipStore.listPayslipReport();
  }

  get totalExpense() {
    return ReportStore.totalExpense;
  }

  get totalOutcomeNow() {
    return ReportStore.totalOutcomeNow;
  }

  get totalOutcomePrevious() {
    return ReportStore.totalOutcomePrevious;
  }

  get totalOvertimeNow() {
    return ReportStore.totalOvertimeNow;
  }

  get totalOvertimePrevious() {
    return ReportStore.totalOvertimePrevious;
  }

  get listEmployeeLateMonthly() {
    // return ReportStore.employeeLateMonthly;
    const list = ReportStore.employeeLateMonthly.map((el: any) => {
      let find: any = {};
      const payslip_type: any = el.employee_meta.department.meta.payslip_type;
      const payslip_filter: any =
        el.employee_meta.department.meta.payslip_filter;

      if (payslip_type === '1' || payslip_type === '2') {
        find = {
          ...el,
          total_late: convertSecondToTimeRound(el.total_late),
          nominal_late: formatPrice(el.nominal_late),
          total_leave: convertSecondToTimeRound(el.total_leave),
          nominal_leave: formatPrice(el.nominal_leave),
          total: formatPrice(el.total),
          periode: `${formatDate(el.start_at, 'medium')} - ${formatDate(
            el.end_at,
            'medium',
          )}`,
          created_at: formatDate(el.created_at, 'long'),
        };
      } else if (payslip_type === '3') {
        find = {
          ...el,
          total_late:
            el.payslip_meta.attendance_calculation.durasi_terlambat + ' menit',
          nominal_late: formatPrice(
            el.payslip_meta.deductions.potongan_terlambat,
          ),
          total_leave:
            el.payslip_meta.deductions.jumlah_potongan_hari +
            ' hari ' +
            el.payslip_meta.deductions.jumlah_potongan_izin +
            ' jam',
          nominal_leave: formatPrice(
            el.payslip_meta.deductions.potongan_hari_kerja,
          ),
          total: formatPrice(
            el.payslip_meta.deductions.potongan_terlambat +
              el.payslip_meta.deductions.potongan_hari_kerja,
          ),
          periode: `${formatDate(el.start_at, 'medium')} - ${formatDate(
            el.end_at,
            'medium',
          )}`,
          created_at: formatDate(el.created_at, 'long'),
        };
      } else {
        return el;
      }
      return find;
    });
    return list;
  }

  get listEmployeeDiligentMonthly() {
    return ReportStore.employeeDiligentMonthly;
  }

  get listEmployeeLateWeekly() {
    return ReportStore.employeeLateWeekly;
  }

  @Watch('dateStart')
  changeMonth() {
    const data = Number(this.dateStart.split('-')[1]) - 1;
    this.monthName = this.monthNames[data];
  }
  @Watch('dateStartDiligent')
  changeMonthDiligent() {
    const data = Number(this.dateStartDiligent.split('-')[1]) - 1;
    this.monthNameDiligent = this.monthNames[data];
  }
  @Watch('dateStartWeekly')
  changeDate() {
    this.dateEndWeekly = new Date(
      new Date(this.dateStartWeekly).getTime() + 604800000,
    )
      .toISOString()
      .substr(0, 10);
  }

  mounted() {
    this.getTotalOutcomeNow();
    this.getTotalOutcomePrevious();
    // this.getTotalExpense();
    this.getListCurrentEmployeeBirthday();
    this.getTotalEmployee();

    const data = Number(this.dateStart.split('-')[1]) - 1;
    this.monthName = this.monthNames[data];
    this.monthNameDiligent = this.monthNames[
      Number(this.dateStartDiligent.split('-')[1]) - 1
    ];
    this.getMostLateEmployeeMonthly(this.initFilterMonthly);
    this.getMostDiligentEmployeeMonthly(this.initFilterMonthly);
    const weekStart = moment()
      .startOf('week')
      .toISOString();
    const weekEnd = moment()
      .endOf('week')
      .toISOString();
    const filter = {
      weekStart,
      weekEnd,
    };
    this.getMostLateEmployeeWeekly(filter);
  }

  inputFilter() {
    this.date = false;
    this.getMostLateEmployeeMonthly(this.dateStart);
  }
  inputFilterDiligent() {
    this.date3 = false;
    this.getMostDiligentEmployeeMonthly(this.dateStartDiligent);
  }
  inputFilterWeekly() {
    this.date2 = false;
    const weekObject = {
      weekStart: new Date(this.dateStartWeekly).toISOString(),
      weekEnd: new Date(this.dateEndWeekly).toISOString(),
    };
    this.getMostLateEmployeeWeekly(weekObject);
  }

  readableDate(date: string) {
    return moment(new Date(date))
      .locale('id')
      .format('DD MMMM YYYY');
  }

  getMostLateEmployeeMonthly(filter: string) {
    console.info(filter);
    ReportStore.getMostLateEmployeeMonthly(filter);
  }

  getMostDiligentEmployeeMonthly(filter: string) {
    ReportStore.getMostDiligentEmployeeMonthly(filter);
  }

  getMostLateEmployeeWeekly(filter: any) {
    ReportStore.getMostLateEmployeeWeekly(filter);
  }

  formatPrice(value: number) {
    return formatPrice(value);
  }
  getListCurrentEmployeeBirthday() {
    return EmployeeStore.getCurrentEmployeeBirthday();
  }
  getTotalEmployee() {
    return EmployeeStore.getTotalEmployee();
  }
  getTotalExpense() {
    const data: any = {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    };
    ReportStore.getTotalExpense(data);
  }

  getTotalOutcomeNow() {
    const startOfMonth = moment()
      .startOf('month')
      .subtract(7, 'days')
      .format('YYYY-MM-DD 00:00:00');
    const endOfMonth = moment()
      .endOf('month')
      .add(7, 'days')
      .format('YYYY-MM-DD 23:59:59');
    const query = {
      filters: [
        {
          field: 'start_at',
          operator: 'gte',
          value: startOfMonth,
        },
        {
          field: 'end_at',
          operator: 'lte',
          value: endOfMonth,
        },
        {
          field: 'start',
          operator: 'gte',
          value: moment()
            .startOf('month')
            .format('YYYY-MM-DD 00:00:00'),
        },
        {
          field: 'end',
          operator: 'lte',
          value: moment()
            .endOf('month')
            .format('YYYY-MM-DD 23:59:59'),
        },
      ],
    };
    ReportStore.getTotalOutcomeNow(query);
    ReportStore.getTotalOvertimeNow(query);
  }

  getTotalOutcomePrevious() {
    const startOfMonth = moment()
      .subtract(1, 'month')
      .startOf('month')
      .subtract(7, 'days')
      .format('YYYY-MM-DD 00:00:00');
    const endOfMonth = moment()
      .subtract(1, 'month')
      .endOf('month')
      .add(7, 'days')
      .format('YYYY-MM-DD 23:59:59');
    const query = {
      filters: [
        {
          field: 'start_at',
          operator: 'gte',
          value: startOfMonth,
        },
        {
          field: 'end_at',
          operator: 'lte',
          value: endOfMonth,
        },
        {
          field: 'start',
          operator: 'gte',
          value: moment()
            .subtract(1, 'month')
            .startOf('month')
            .format('YYYY-MM-DD 00:00:00'),
        },
        {
          field: 'end',
          operator: 'lte',
          value: moment()
            .subtract(1, 'month')
            .endOf('month')
            .format('YYYY-MM-DD 23:59:59'),
        },
      ],
    };
    ReportStore.getTotalOutcomePrevious(query);
    ReportStore.getTotalOvertimePrevious(query);
  }

  goToEmployee() {
    this.$router.push({
      name: 'employee',
    });
  }

  getListEmployee() {
    EmployeeStore.getEmployeeBirthday();
  }

  getReportPayslip() {
    const month: any = new Date().getMonth() + 1;
    const year: any = new Date().getFullYear();

    /* Date start and end this month */
    const dateStartNow: any = moment(`${year}-${month}-01`)
      .startOf('month')
      .format('YYYY-MM-DD');
    const dateEndNow: any = moment(dateStartNow)
      .endOf('month')
      .format('YYYY-MM-DD');

    /* Date start and end previous month */
    let previousMonth = month - 1;
    let previousYear = year;
    if (previousMonth <= 0) {
      previousMonth = 12;
      previousYear = year - 1;
    }
    const dateStartPrevious: any = moment(`${previousYear}-${previousMonth}-01`)
      .startOf('month')
      .format('YYYY-MM-DD');
    const dateEndPrevious: any = moment(dateStartNow)
      .endOf('month')
      .format('YYYY-MM-DD');

    const paramsThisMonth: any = {
      filters: [
        {
          field: 'created_at',
          operator: 'between',
          value: `${new Date(dateStartNow).toISOString()},${new Date(
            dateEndNow,
          ).toISOString()}`,
        },
      ],
    };
    const paramsPreviousMonth: any = {
      filters: [
        {
          field: 'created_at',
          operator: 'between',
          value: `${new Date(dateStartPrevious).toISOString()},${new Date(
            dateEndPrevious,
          ).toISOString()}`,
        },
      ],
    };
    PayslipStore.getPayslipReportThisMonth(paramsThisMonth);
    PayslipStore.getPayslipReportPreviousMonth(paramsPreviousMonth);
  }
}
