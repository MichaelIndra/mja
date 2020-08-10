import { InitEmployee } from '@/common/interfaces/employee';
import { ILoan } from '@/common/interfaces/loan';
import { InitQueryEmployee, IQuery } from '@/common/interfaces/query';
import { formatDate, formatPrice } from '@/common/utils/config';
import Filters from '@/components/includes/Filter.vue';
import Pagination from '@/components/includes/Pagination.vue';
import { AuthModule } from '@/store/modules/auth';
import { EmployeeStore } from '@/store/modules/employee';
import { LoanStore } from '@/store/modules/loan';
import { SettingsStore } from '@/store/modules/settings';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { IEmployee } from '../../../common/interfaces/employee';

@Component({
  name: 'LoanManagement',
  components: {
    Pagination,
    Filters,
  },
})
export default class LoanManagement extends Vue {
  dialog: boolean = false;
  dialogPay: boolean = false;
  detail: boolean = false;
  filter: boolean = false;
  filterCount: number = 0;
  filterOption: any = {
    type: 'employee',
    dataDateStart: 'created_at',
    dataDateEnd: 'created_at',
  };
  headers: any[] = [
    {
      align: 'middle',
      sortable: false,
      text: 'NIK',
      value: 'nik',
    },
    {
      align: 'left',
      sortable: false,
      text: 'Nama',
      value: 'name',
    },
    {
      align: 'left',
      sortable: false,
      text: 'Departemen',
      value: 'department.name',
    },
    {
      align: 'left',
      sortable: true,
      text: 'Sisa Pinjaman',
      value: 'latestLoan.total_loan_current',
    },
    {
      align: 'left',
      sortable: false,
      text: 'Pilihan',
      value: 'actions',
    },
  ];
  headersLoanDetail: any[] = [
    {
      align: 'middle',
      sortable: false,
      text: 'Deskripsi',
      value: 'description',
      width: 300,
    },
    {
      align: 'left',
      sortable: false,
      text: 'Tanggal Transaksi',
      value: 'created_at',
    },
    {
      align: 'center',
      sortable: false,
      text: 'Jenis',
      value: 'type',
    },
    {
      align: 'left',
      sortable: false,
      text: 'Nominal',
      value: 'nominal',
    },
  ];
  currency_config: any = {
    decimal: ',',
    thousands: '.',
    prefix: 'Rp',
    precision: 0,
    masked: false,
    allowBlank: false,
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
  };
  loan: any = {
    nominal: 0,
    description: null,
    employee_id: '',
    created_by_id: '',
    type: 'LOAN',
    loan_date: '',
  };

  get params(): any {
    return SettingsStore.params;
  }

  get listEmployee(): any {
    return EmployeeStore.listEmployee;
  }

  get employee(): any {
    return EmployeeStore.employee;
  }

  get userId(): string {
    return AuthModule.id;
  }

  get loading(): boolean {
    return LoanStore.isLoadingLoan;
  }

  get loadingEmployee(): boolean {
    return EmployeeStore.isLoadingEmployee;
  }

  get listLoan(): any[] {
    return LoanStore.listLoans;
  }
  get totalLoanByDepartment(): any {
    return LoanStore.totalLoanByDepartment;
  }

  formatDate(data: any) {
    return formatDate(data, 'short-dateTime');
  }

  mounted() {
    const params: any = {
      page: 1,
      per_page: 10,
      filters: [
        {
          field: 'name',
          value: 'ASC',
        },
        {
          field: 'active',
          operator: 'eq',
          value: true,
        },
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
        {
          field: 'loans',
          value: 'join',
        },
      ],
    };
    this.getListData(params);
  }

  showFilter() {
    this.filter = !this.filter;
  }

  getListData(params: IQuery) {
    EmployeeStore.getAllEmployee(params);
    LoanStore.getTotalLoanByDepartment();
  }

  showConfirm(item: any) {
    this.loan = {
      nominal: 0,
      description: null,
      employee_id: '',
      created_by_id: item.id,
      type: 'LOAN',
      loan_date: '',
    };
    EmployeeStore.getOneEmployeeFromList(item.id);
    this.dialog = true;
  }

  showPay(item: any) {
    this.loan = {
      nominal: 0,
      description: null,
      employee_id: item.id,
      created_by_id: '',
      type: 'PAY',
      loan_date: '',
    };
    EmployeeStore.getOneEmployeeFromList(item.id);
    this.dialogPay = true;
  }

  getListLoanByEmployee(employee_id: string) {
    const params = {
      filters: [
        {
          field: 'employee_id',
          operator: 'eq',
          value: employee_id,
        },
      ],
      page: 1,
      per_page: 10,
      sort: 'created_at,DESC',
    };
    LoanStore.getListLoan(params);
  }

  showDetail(employee_id: string) {
    EmployeeStore.setInitDataEmployee();
    this.getListLoanByEmployee(employee_id);
    this.detail = true;
    EmployeeStore.getOneEmployeeFromList(employee_id);
  }

  dismisDialogDetail() {
    this.detail = false;
    const params: any = {
      page: 1,
      per_page: 10,
      filters: [
        {
          field: 'name',
          value: 'ASC',
        },
        {
          field: 'active',
          operator: 'eq',
          value: true,
        },
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
        {
          field: 'loans',
          value: 'join',
        },
      ],
    };
    this.getListData(params);
    EmployeeStore.setInitDataEmployee();
  }

  dismisDialog() {
    this.dialog = false;
    this.dialogPay = false;
    LoanStore.setInitLoan();
  }

  async saveLoan(): Promise<void> {
    this.loan = {
      ...this.loan,
      created_by_id: this.userId,
      employee_id: this.employee.id,
      loan_date: new Date(),
    };
    await LoanStore.setLoanData(this.loan);
    const params: any = {
      page: 1,
      per_page: 10,
      filters: [
        {
          field: 'name',
          value: 'ASC',
        },
        {
          field: 'active',
          operator: 'eq',
          value: true,
        },
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
        {
          field: 'loans',
          value: 'join',
        },
      ],
    };
    this.getListLoanByEmployee(this.employee.id);
    this.dialog = false;
    this.dialogPay = false;
    this.detail = true;
  }

  formatPriceToText(number: number): string {
    return formatPrice(number);
  }
}
