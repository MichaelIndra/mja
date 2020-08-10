import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import { formatDate, openSnackbarNow } from '@/common/utils/config';
import { AttendanceStore } from '@/store/modules/attendance';
import { DepartmentStore } from '@/store/modules/department';
import { EmployeeStore } from '@/store/modules/employee';
import { PayslipStore } from '@/store/modules/payslip';
import moment from 'moment';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';

@Component({
  name: 'ReportAttendance',
})
export default class ReportAttendance extends Vue {
  headers: any[] = [
    {
      text: 'NIK',
      value: 'employee_meta.nik',
    },
    { sortable: false, text: 'Nama', value: 'employee_meta.name' },
    {
      sortable: false,
      text: 'Departemen',
      value: 'employee_meta.department.name',
    },
    {
      sortable: false,
      text: 'Total Absen (hari) ',
      value: 'payslip_meta.attendance_calculation.workDuration.totalAbsent',
    },
    { sortable: false, text: 'Potongan Absen(Rp)', value: '' },
    {
      sortable: false,
      text: 'Total Terlambat (jam)',
      value: 'payslip_meta.attendance_calculation.durasi_terlambat',
    },
    {
      sortable: false,
      text: 'Potongan Terlambat',
      value: 'payslip_meta.deductions.potongan_jam_masuk',
    },
    { sortable: false, text: 'Total Potongan', value: '' },
  ];

  choosenDepartment: any = {
    id: null,
    name: null,
  };
  choosenPeriod: any = {
    id: null,
    name: null,
  };
  listPeriod: any = [
    {
      id: 1,
      name: 'Mingguan',
    },
    {
      id: 2,
      name: 'Bulanan',
    },
    /*{
      id: 3,
      name: 'Tahunan',
    },*/
  ];
  isShown: boolean = true;
  payslipDuration: number = 0;
  date: boolean = false;
  month: boolean = false;
  year: boolean = false;
  dateStart: string = '';
  weekStart: string = '';
  monthStart: string = '';
  yearStart: string = '';
  dateEnd: string = '';
  snackbar: ISnackbar = InitSnackbar;
  dateNow: string = new Date().toISOString().substring(0, 10);
  listAttendanceReport: any = [];

  get listDepartments(): any {
    return DepartmentStore.listDepartment;
  }
  get listEmployee(): any {
    return EmployeeStore.listEmployee;
  }
  get listPayslipReport(): any {
    return PayslipStore.listPayslipReport;
  }
  get listSummaryAttendance(): any {
    return AttendanceStore.listSummaryAttendance;
  }

  @Watch('weekStart')
  changeDateStart() {
    this.dateStart = this.weekStart;
    if (this.dateStart !== '') {
      this.dateEnd = moment(this.dateStart)
        .add(6, 'd')
        .format('YYYY-MM-DD');
    }
  }

  @Watch('monthStart')
  changeMonthStart() {
    this.dateStart = moment(this.monthStart + '-1')
      .startOf('month')
      .format('YYYY-MM-DD');
    this.dateEnd = moment(this.dateStart)
      .endOf('month')
      .format('YYYY-MM-DD');
  }

  /* @Watch('yearStart')
  changeYearStart() {
    this.dateStart = moment(this.monthStart + '-1')
      .startOf('year')
      .format('YYYY-MM-DD');
    this.dateEnd = moment(this.dateStart)
      .endOf('year')
      .format('YYYY-MM-DD');
  }*/

  mounted() {
    this.getListDepartments();
  }

  clearFilter() {
    this.choosenDepartment = {
      id: null,
      name: null,
    };
    this.choosenPeriod = {
      id: null,
      name: null,
    };
    this.isShown = true;
    this.payslipDuration = 0;
    this.date = false;
    this.month = false;
    this.year = false;

    this.dateStart = '';
    // this.dateEnd = '';

    this.weekStart = '';
    this.monthStart = '';
    this.yearStart = '';
  }

  formatDate(value: any) {
    return formatDate(value, 'long');
  }
  getListDepartments() {
    DepartmentStore.getAllDepartment({});
  }

  async saveFilter() {
    if (this.dateStart === '' || this.dateEnd === '') {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message: 'Anda harus memilih tanggal mulai dan tanggal selesai!',
        color: 'warn',
      };
      openSnackbarNow(snackbar);
    } else {
      this.isShown = false;
      await EmployeeStore.getAllEmployee({});
      await PayslipStore.getPayslipReport({});
      if (
        this.listPayslipReport.length > 0 &&
        this.listEmployee.length > 0 &&
        this.dateStart &&
        this.dateEnd
      ) {
        this.listPayslipReport.map(async (el: any) => {
          const queryId = this.dateStart + ',' + this.dateEnd;
          const params: any = {
            filters: [
              {
                field: 'employee',
                value: 'join',
              },
              {
                field: 'employee.group',
                value: 'join',
              },
              {
                field: 'employee.department',
                value: 'join',
              },
            ],
          };
          if (this.choosenDepartment.id) {
            params.filters.push({
              field: 'employee.department_id',
              operator: 'eq',
              value: this.choosenDepartment.id,
            });
          }
          params.filters.push({
            field: 'employee_id',
            operator: 'eq',
            value: el.id,
          });
          await AttendanceStore.getSummaryAttendance(params);
        });
      }
    }
  }
  async getEmployeeList() {
    const query: any = {
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
          field: 'area',
          value: 'join',
        },
        {
          field: 'position',
          value: 'join',
        },
      ],
    };
    if (this.choosenDepartment.id) {
      query.filters.push({
        field: 'department_id',
        operator: 'eq',
        value: this.choosenDepartment.id,
      });
    }
    return await EmployeeStore.getAllEmployee(query);
  }

  selectDepartment(id: string) {
    this.choosenDepartment = this.listDepartments.find((el: any) => {
      return el.id === id;
    });
    this.dateStart = '';
    this.dateEnd = '';
  }
  selectPeriode(id: string) {
    this.choosenPeriod = this.listPeriod.find((el: any) => {
      return el.id === id;
    });
    this.dateStart = '';
    this.dateEnd = '';
  }
}
