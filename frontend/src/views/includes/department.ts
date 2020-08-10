import { IDepartment, InitDepartment } from '@/common/interfaces/department';
import { InitQuery, IQuery } from '@/common/interfaces/query';
import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import { formatDate, openSnackbarNow } from '@/common/utils/config';
import { branchOfficeOne, generalOfficeOne } from '@/common/utils/role';
import router from '@/router';
import { AuthModule } from '@/store/modules/auth';
import { BranchStore } from '@/store/modules/branch';
import { DepartmentStore } from '@/store/modules/department';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';
import { Validations } from 'vuelidate-property-decorators';
import { required } from 'vuelidate/lib/validators';

@Component({
  mixins: [validationMixin],
  name: 'Department',
})
export default class Department extends Vue {
  // VALIDATION
  @Validations()
  validations = {
    department: {
      name: { required },
      branch_id: { required },
      meta: {
        payslip_filter: { required },
        payslip_type: { required },
      },
    },
  };

  // DATA
  department: any = InitDepartment;
  baseDepartment: any = InitDepartment;
  snackbar: ISnackbar = InitSnackbar;
  valid: boolean = true;
  dialogForm: boolean = false;
  dialogDelete: boolean = false;
  options: any = {};
  params: IQuery = {
    filters: [
      {
        field: 'branch',
        value: 'join',
      },
      {
        field: 'name',
        value: 'ASC',
      },
    ],
  };
  headers: any[] = [
    {
      text: 'Name Departemen',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    { text: 'Ditambahkan pada', value: 'created_at' },
    { text: 'Aksi', value: 'actions', sortable: false },
  ];
  branchOfficeOne: string = branchOfficeOne;
  generalOfficeOne: string = generalOfficeOne;
  addPermission: boolean = true;
  listPayslipFilter: any = [
    {
      id: 1,
      name: 'Mingguan',
    },
    {
      id: 2,
      name: 'Bulanan',
    },
  ];
  listPayslipType: any = [
    {
      id: '1',
      name: 'Produksi',
    },
    {
      id: '2',
      name: 'Toko',
    },
    {
      id: '3',
      name: 'Kantor',
    },
  ];
  // WATCH
  @Watch('options')
  listenOptionsChanges() {
    this.getListDepartment();
  }

  // METHODS
  mounted() {
    this.getListDepartment();
    this.getListBranch();
    this.checkPermission();
  }

  checkPermission() {
    if (
      this.userRole[0] === this.branchOfficeOne ||
      this.userRole[0] === this.generalOfficeOne
    ) {
      this.addPermission = false;
    } else {
      this.addPermission = true;
    }
  }

  formatDate(date: any, type: string) {
    return formatDate(date, type);
  }

  getListDepartment() {
    DepartmentStore.getAllDepartment(this.params);
  }

  getListBranch() {
    BranchStore.getAllBranch({});
  }

  goToDetail(id: string) {
    DepartmentStore.getOneDepartmentFromList(id);
    router.push({ name: 'group-department', params: { departmentId: id } });
  }

  showForm(id: string | null = null) {
    if (id) {
      DepartmentStore.getOneDepartmentFromList(id);
    } else {
      DepartmentStore.setInitDataDepartment();
    }
    this.department = {
      ...this.dataDepartment,
    };
    this.dialogForm = true;
  }

  showConfirmDelete(id: string) {
    DepartmentStore.getOneDepartmentFromList(id);
    this.department = {
      ...this.dataDepartment,
    };
    this.dialogDelete = true;
  }

  deleteData() {
    if (this.department.id) {
      DepartmentStore.deleteDepartment(this.department.id);
      DepartmentStore.setInitDataDepartment();
    }
    this.department = {
      ...this.dataDepartment,
    };
    this.dialogDelete = false;
  }

  closeForm() {
    this.$v.$reset();
    DepartmentStore.setInitDataDepartment();
    this.$store.commit('SET_LOADING_DEPARTMENT', false);
    this.dialogForm = false;
  }

  async save() {
    if (
      this.department.name === '' ||
      this.department.branch_id === '' ||
      this.department.meta.payslip_type === '' ||
      this.department.meta.payslip_filter === ''
    ) {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message:
          'Ada form yang belum anda isi, silahkan cek kembali inputan anda',
        color: 'warn',
      };
      openSnackbarNow(snackbar);
      this.department = {
        ...this.department,
        errors: {
          name: this.department.name === '' ? true : false,
          branch_id: this.department.branch_id === '' ? true : false,
          payslip_meta: this.department.meta.payslip_meta === '' ? true : false,
          payslip_filter:
            this.department.meta.payslip_filter === '' ? true : false,
          payslip_type: this.department.meta.payslip_type === '' ? true : false,
        },
      };
    } else {
      await DepartmentStore.saveDepartment(this.department);
      DepartmentStore.setInitDataDepartment();
      this.$v.$reset();
      this.department = {
        ...this.dataDepartment,
      };
      this.dialogForm = false;
      this.getListDepartment();
    }
  }

  // GETTERS
  get userRole(): any {
    return AuthModule.roles;
  }

  get pagination(): any {
    return DepartmentStore.pagination;
  }

  get isLoading(): boolean {
    return DepartmentStore.isLoadingDepartment;
  }

  get dataDepartment(): IDepartment {
    const result = {
      ...DepartmentStore.department,
      errors: {
        name: false,
        branch_id: false,
        payslip_type: false,
        payslip_filter: false,
      },
    };
    return result;
  }

  get listDepartment(): IDepartment[] {
    return DepartmentStore.listDepartment;
  }

  get listBranch(): IDepartment[] {
    return BranchStore.listBranch;
  }
}
