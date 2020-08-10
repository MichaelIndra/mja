import { formatPrice } from '@/common/utils/config';
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

  get listEmployeeLateMonthly() {
    return ReportStore.employeeLateMonthly;
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
    this.getTotalExpense();
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
