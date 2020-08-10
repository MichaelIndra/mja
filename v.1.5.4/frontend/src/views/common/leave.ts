import { IDepartment } from '@/common/interfaces/department';
import { ILeave } from '@/common/interfaces/leave';
import { InitQueryLeave } from '@/common/interfaces/query';
import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import { checkTimeFormat, openSnackbarNow } from '@/common/utils/config';
import Filters from '@/components/includes/Filter.vue';
import Pagination from '@/components/includes/Pagination.vue';
import { ErrorStore } from '@/store/modules/catchError';
import { DepartmentStore } from '@/store/modules/department';
import { EmployeeStore } from '@/store/modules/employee';
import { LeaveStore } from '@/store/modules/leave';
import { SettingsStore } from '@/store/modules/settings';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { mask } from 'vue-the-mask';

@Component({
  name: 'Leave',
  components: { Pagination, Filters },
  directives: {
    mask,
  },
})
export default class Leave extends Vue {
  switchLeave: boolean = false;
  date1: any = '';
  date2: any = '';
  valid: boolean = true;
  dialogForm: boolean = false;
  dialogDelete: boolean = false;
  options: any = {};
  dateNow: string = new Date().toISOString().substring(0, 10);
  timeStart: string = '';
  timeEnd: string = '';
  mask: string = '##:##';
  employeeParams: any = {
    filters: [
      {
        field:
          'name,id,nik,date_of_birth,active_date,active,department_id,group_id,area_id',
        value: 'field',
      },
      {
        field: 'active',
        operator: 'eq',
        value: 'true',
      },
      {
        field: 'department',
        value: 'join-field',
        fieldName: 'name',
      },
    ],
  };
  headers: any[] = [
    { text: 'Nama Lengkap', value: 'employee.name' },
    { text: 'Departemen', value: 'employee.department.name' },
    { text: 'Tanggal Mulai', value: 'date_start' },
    { text: 'Tanggal Selesai', value: 'date_end' },
    { text: 'Keperluan', value: 'description', width: '350' },
    { text: 'Aksi', value: 'actions', sortable: false, align: 'center' },
  ];
  filter: boolean = false;
  filterCount: number = 0;
  departmentIdForm: string = '';
  departmentMeta: any = {};
  filterOption: any = {
    type: 'leave',
    dataDateStart: 'date_start',
    dataDateEnd: 'date_end',
  };
  snackbar: ISnackbar = InitSnackbar;
  minStartDate: any = null;
  maxDate = new Date(
    new Date().setMonth(new Date().getMonth() + 1),
  ).toISOString();

  formDataDelete: any = {
    ids: [],
    query: null,
    isAllSelected: false,
  };
  selectionForDeleteAll: any = null;
  optionsForDeleteAll: any[] = [
    { text: 'Tandai Semua', value: 'ALL' },
    { text: 'Tandai Semua Hanya Halaman Ini', value: 'ALL_IN_THIS_PAGE' },
  ];
  dialogConfirmMultiDelete: boolean = false;

  // GETTERS
  get isLoading(): boolean {
    return LeaveStore.isLoadingLeave;
  }

  get params(): any {
    return SettingsStore.params;
  }

  get leave(): any {
    return LeaveStore.leave;
  }

  get listLeave(): ILeave[] {
    return LeaveStore.listLeave;
  }

  get listEmployee(): any[] {
    return EmployeeStore.listEmployee;
  }

  get listDepartment(): IDepartment[] {
    return DepartmentStore.listDepartment;
  }

  get listDepartmentFilter(): IDepartment[] {
    return DepartmentStore.listDepartmentFilter;
  }

  get errorStatus(): any {
    return ErrorStore.errorData;
  }

  get totalData(): number {
    return LeaveStore.totalData;
  }

  // WATCH
  @Watch('filterCount')
  changeFilterCount() {
    if (this.filterCount < 0) {
      this.filterCount = 0;
    }
  }
  @Watch('errorStatus')
  monitorError() {
    if (this.errorStatus.status === 406 || this.errorStatus.status === 409) {
      this.leave.date_start = '';
      this.leave.date_end = '';
      this.switchLeave = false;
    }
  }
  @Watch('departmentIdForm')
  filterDepartmentIdForm() {
    if (this.departmentIdForm === '0' || this.departmentIdForm === '') {
      this.employeeParams.filters = this.employeeParams.filters.filter(
        (el: any) => {
          return el.field !== 'department_id';
        },
      );
    } else {
      const findDepartment = this.listDepartment.find((el: any) => {
        return el.id === this.departmentIdForm;
      });
      if (findDepartment) {
        this.departmentMeta = findDepartment.meta;
      }
      const find: any = this.employeeParams.filters.find((el: any) => {
        return el.field === 'department_id';
      });
      if (find) {
        this.employeeParams.filters = this.employeeParams.filters.map(
          (el: any) => {
            if (el.field === 'department_id') {
              el = {
                ...el,
                value: this.departmentIdForm,
              };
            }
            return el;
          },
        );
      } else {
        this.employeeParams.filters.push({
          field: 'department_id',
          operator: 'eq',
          value: this.departmentIdForm,
        });
      }
    }
    this.getListEmployee();
  }

  @Watch('leave.employee_id')
  filterDepartmentByEmployee() {
    if (this.listEmployee.length > 0) {
      const findEmployeeFromList = this.listEmployee.find((el: any) => {
        return el.id === this.leave.employee_id;
      });
      if (findEmployeeFromList) {
        this.departmentIdForm = findEmployeeFromList.department_id;
      }
    }
  }

  @Watch('switchLeave')
  checkSwitchLeave() {
    if (this.switchLeave) {
      this.leave.date_end = this.leave.date_start;
    } else {
      this.leave.date_end = '';
    }
  }

  // METHODS
  mounted() {
    this.getListData(InitQueryLeave);
    this.getListEmployee();
    this.getListDepartment();

    const now = new Date();
    const someMonthBefore = now.setMonth(now.getMonth() - 6);
    this.minStartDate = new Date(someMonthBefore).toISOString();
  }

  @Watch('selectionForDeleteAll')
  watchSelectionForDeleteAll() {
    if (this.selectionForDeleteAll === 'ALL') {
      this.selectAll();
    } else if (this.selectionForDeleteAll === 'ALL_IN_THIS_PAGE') {
      this.selectAllInThisPage();
    }
  }

  selectAll() {
    this.formDataDelete.ids = this.listLeave.map((item: any) => item.id);
    this.formDataDelete.isAllSelected = true;
    this.formDataDelete.query = JSON.parse(JSON.stringify(this.params));
  }

  selectAllInThisPage() {
    this.formDataDelete.ids = this.listLeave.map((item: any) => item.id);
    this.formDataDelete.isAllSelected = false;
    this.formDataDelete.query = JSON.parse(JSON.stringify(this.params));
  }

  unSelectAll() {
    this.formDataDelete.ids = [];
    this.formDataDelete.isAllSelected = false;
    this.formDataDelete.query = JSON.parse(JSON.stringify(this.params));
    this.selectionForDeleteAll = null;
  }

  async deleteSelected() {
    try {
      await LeaveStore.deleteManyLeave(this.formDataDelete);
      this.formDataDelete = {
        isAllSelected: false,
        query: this.params,
        ids: [],
      };
      this.dialogConfirmMultiDelete = false;
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'success',
        message: 'Berhasil menghapus data absensi.',
      });
      this.getListData(this.params);
    } catch (err) {
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'error',
        message: 'Gagal menghapus.',
      });
      this.dialogConfirmMultiDelete = false;
    }
    this.dialogConfirmMultiDelete = false;
  }

  checkFilter(data: any) {
    if (data.value) {
      this.filterCount += 1;
    } else {
      this.filterCount -= 1;
    }
  }

  clearFilterForm() {
    this.departmentIdForm = '';
    this.leave.employee_id = '';
    this.leave.description = '';
    this.leave.date_end = '';
    this.timeStart = '';
    this.timeEnd = '';
  }

  showFilter() {
    this.filter = !this.filter;
  }

  getListData(params: any) {
    LeaveStore.getAllLeave(params);
  }

  getListDepartment(params: any = {}) {
    DepartmentStore.getAllDepartment(params);
  }

  getListEmployee() {
    EmployeeStore.getAllEmployeeWithoutParams(this.employeeParams);
  }

  showForm(id: string | null = null) {
    if (id) {
      LeaveStore.getOneLeaveFromList(id);
    } else {
      LeaveStore.setInitDataLeave();
    }
    this.dialogForm = true;
  }

  showConfirmDelete(id: string) {
    LeaveStore.getOneLeaveFromList(id);
    this.dialogDelete = true;
  }

  async deleteData() {
    if (this.leave.id) {
      await LeaveStore.deleteLeave(this.leave.id);
      this.getListData(InitQueryLeave);
    }
    this.dialogDelete = false;
    this.clearFilterForm();
  }

  async save() {
    if (
      this.departmentMeta &&
      this.switchLeave &&
      Number(this.departmentMeta.payslip_type) === 1 &&
      Number(this.departmentMeta.payslip_filter) === 1 &&
      (isNaN(checkTimeFormat(this.timeStart)) ||
        isNaN(checkTimeFormat(this.timeEnd)) ||
        this.timeStart.split('').length !== 5 ||
        this.timeEnd.split('').length !== 5)
    ) {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message: 'Format waktu tidak sesuai, harap cek kembali. contoh: 17:00',
        color: 'error',
      };
      openSnackbarNow(snackbar);
    } else if (this.leave.description.toString().trim().length === 0) {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message: 'Keperluan izin wajib di isi.',
        color: 'error',
      };
      openSnackbarNow(snackbar);
    } else {
      if (
        this.departmentMeta &&
        this.switchLeave &&
        Number(this.departmentMeta.payslip_type) === 1
      ) {
        this.leave.date_end = this.leave.date_start;
      }
      if (this.timeEnd.length === 5 && this.leave.date_end.length === 10) {
        this.leave.date_end = this.leave.date_end + ' ' + this.timeEnd;
      } else if (this.leave.date_end.length === 10) {
        this.leave.date_end = this.leave.date_end + ' 23:59:59';
      } else {
        return this.leave.date_end;
      }
      if (this.timeStart.length === 5 && this.leave.date_start.length === 10) {
        this.leave.date_start = this.leave.date_start + ' ' + this.timeStart;
      } else if (this.leave.date_start.length === 10) {
        this.leave.date_start = this.leave.date_start + ' 00:00:00';
      } else {
        return this.leave.date_start;
      }
      const newLeave = {
        ...this.leave,
        date_start: new Date(this.leave.date_start),
        date_end: new Date(this.leave.date_end),
      };
      if (this.switchLeave && newLeave.date_start >= newLeave.date_end) {
        const snackbar = {
          ...this.snackbar,
          value: true,
          message: 'Jam Selesai Izin harus lebih dari Jam Mulai Izin.',
          color: 'error',
        };
        openSnackbarNow(snackbar);
      } else {
        await LeaveStore.saveLeave(newLeave);
        this.getListData(InitQueryLeave);
        this.dialogForm = false;
        this.clearFilterForm();
      }
    }
  }

  closeForm() {
    // this.$store.commit('SET_ACTIVE_GROUP', InitGroup);
    this.departmentIdForm = '';
    this.dialogForm = false;
    this.$store.commit('SET_LOADING_LEAVE', false);
  }
}
