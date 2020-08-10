import { IArea } from '@/common/interfaces/area';
import { IDepartment } from '@/common/interfaces/department';
import { IEmployee, InitEmployee } from '@/common/interfaces/employee';
import { IGroup, InitGroup } from '@/common/interfaces/group';
import { IPosition } from '@/common/interfaces/position';
import { InitQueryEmployee } from '@/common/interfaces/query';
import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import { formatPrice, openSnackbarNow } from '@/common/utils/config';
import { branchOfficeOne, generalOfficeOne } from '@/common/utils/role';
import DataGroup from '@/components/department/DataGroup.vue';
import Filters from '@/components/includes/Filter.vue';
import Pagination from '@/components/includes/Pagination.vue';
import router from '@/router';
import { AreaStore } from '@/store/modules/area';
import { AuthModule } from '@/store/modules/auth';
import { DepartmentStore } from '@/store/modules/department';
import { EmployeeStore } from '@/store/modules/employee';
import { GroupStore } from '@/store/modules/group';
import { PositionStore } from '@/store/modules/position';
import { SettingsStore } from '@/store/modules/settings';
import ImportEmployee from '@/views/includes/ImportEmployee.vue';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';
import { Validations } from 'vuelidate-property-decorators';
import { maxLength, numeric, required } from 'vuelidate/lib/validators';

@Component({
  mixins: [validationMixin],
  name: 'Employee',
  components: { ImportEmployee, DataGroup, Pagination, Filters },
})
export default class Employee extends Vue {
  // VALIDATION
  @Validations()
  validations = {
    employee: {
      nik: { required, numeric, maxLength: maxLength(20) },
      bpjs_id: { required, maxLength: maxLength(20) },
      npwp_id: { maxLength: maxLength(20) },
      name: { required },
      address: { required },
      department_id: { required },
      group_id: { required },
      area_id: { required },
      position_id: { required },
      date_of_birth: { required },
      place_of_birth: { required },
      phone_no: { required },
      status: { required },
      active: { required },
      meta: {
        payslip: {
          insentif: required,
          astek_deduction: required,
          spsi_deduction: required,
          astek_deduction_owner: {},
          insentif_khusus: {},
          tambahan: {},
          bonus_lembur: {},
          ket_bonus_khusus: {},
          nominal_bonus_khusus: {},
        },
      },
    },
  };
  // Data
  snackbar: ISnackbar = InitSnackbar;
  dateNow: any = new Date().toISOString().substr(0, 10);
  importData: boolean = false;
  employee: any = InitEmployee;
  valid: boolean = true;
  menu2: boolean = false;
  menu3: boolean = false;
  dialogForm: boolean = false;
  dialogDelete: boolean = false;
  keyword: string = '';
  options: any = {};
  filter: boolean = false;
  filterCount: number = 0;
  departmentId: string = '';
  groupId: string = '';
  areaId: string = '';
  positionId: string = '';
  headers: any[] = [
    { text: 'NIK', value: 'nik' },
    { text: 'Nama Lengkap', value: 'name' },
    { text: 'Departemen', value: 'department.name' },
    { text: 'Golongan', value: 'group.name' },
    { text: 'Tempat/Tanggal Lahir', value: 'created_at', sortable: false },
    {
      text: 'Status',
      align: 'left',
      sortable: false,
      value: 'status_active',
    },
    { text: 'Lama Kerja', value: 'active_date' },
    { text: 'Status Karyawan', value: 'status' },
  ];
  headersOwner: any[] = [
    { text: 'NIK', value: 'nik' },
    { text: 'Nama Lengkap', value: 'name' },
    { text: 'Departemen', value: 'department.name' },
    { text: 'Golongan', value: 'group.name' },
    { text: 'Tempat/Tanggal Lahir', value: 'created_at', sortable: false },
    {
      text: 'Status Keaktifan',
      align: 'left',
      sortable: false,
      value: 'status_active',
    },
    { text: 'Lama Kerja', value: 'active_date' },
    { text: 'Status Karyawan', value: 'status' },
  ];
  groupDetail: any = {};
  branchOfficeOne: string = branchOfficeOne;
  generalOfficeOne: string = generalOfficeOne;
  addPermission: boolean = true;
  filterOption: any = {
    type: 'employee',
    dataDateStart: 'created_at',
    dataDateEnd: 'created_at',
  };
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
  employeeStatus: any = ['REGULER', 'KHUSUS'];
  choosenDepartment: any = {};

  // GETTERS
  get params(): any {
    return SettingsStore.params;
  }

  get userRole(): any {
    return AuthModule.roles;
  }

  get isLoading(): boolean {
    return EmployeeStore.isLoadingEmployee;
  }

  get dataEmployee(): IEmployee {
    const employee: any = EmployeeStore.employee;
    // if (employee.id !== '') {
    //   employee.active = true;
    // }
    if (employee.area_id) {
      const data = {
        ...employee,
        departmentId: employee.department_id,
        areaId: employee.area_id,
      };
      AreaStore.getOneArea(data);
    }
    if (employee.position_id) {
      const data = {
        ...employee,
        areaId: employee.area_id,
        positionId: employee.position_id,
      };
      PositionStore.getOnePosition(data);
    }
    return employee;
  }

  get activeGroup(): IGroup {
    return GroupStore.activeGroup;
  }

  get listEmployee(): IEmployee[] {
    return EmployeeStore.listEmployee;
  }

  get listDepartment(): IDepartment[] {
    return DepartmentStore.listDepartment;
  }

  get listGroup(): IGroup[] {
    return GroupStore.listGroup;
  }

  get listArea(): IArea[] {
    return AreaStore.listArea;
  }

  get listPosition(): IPosition[] {
    return PositionStore.listPosition;
  }

  get area(): IArea {
    return AreaStore.area;
  }

  get position(): IPosition {
    return PositionStore.position;
  }

  get totalData(): number {
    return EmployeeStore.totalData;
  }

  // WATCH
  @Watch('filterCount')
  changeFilterCount() {
    if (this.filterCount < 0) {
      this.filterCount = 0;
    }
  }

  @Watch('employee.department_id')
  changeDepartment() {
    if (this.employee.department_id) {
      this.getListGroup(this.employee.department_id);
      const departmentId: any = this.employee.department_id;
      const data = {
        params: {
          filters: [
            {
              field: 'name',
              value: 'ASC',
            },
          ],
        },
      };
      this.groupDetail = {};
      this.getListArea(departmentId);
      this.choosenDepartment = this.listDepartment.find(
        (el: any) => el.id === departmentId,
      );
      EmployeeStore.setDepartment(this.choosenDepartment);
    }
  }

  @Watch('options')
  getTableOptions() {
    if (
      this.listEmployee.length > 0 &&
      this.options.sortBy.length > 0 &&
      this.options.sortDesc.length > 0
    ) {
      const find = this.params.filters.find((el: any) => {
        return el.value === 'ASC' || el.value === 'DESC';
      });
      if (find) {
        this.params.filters = this.params.filters.map((el: any) => {
          if (el.value === 'ASC' || el.value === 'DESC') {
            el = {
              ...el,
              field: this.options.sortBy[0].toString(),
              value: this.options.sortDesc[0] ? 'DESC' : 'ASC',
            };
          }
          return el;
        });
      } else {
        this.params.filters.push({
          field: this.options.sortBy[0].toString(),
          value: this.options.sortDesc[0] ? 'DESC' : 'ASC',
        });
      }
      this.getListData(this.params);
    }
  }

  @Watch('employee.group_id')
  changeGroup() {
    const group: any = this.listGroup.find(
      (el: any) => this.employee.group_id === el.id,
    );
    if (group) {
      if (group.schedule.schedules[0].flexible_break === true) {
        const shift: any = this.listGroup.map((el: any) => {
          delete el.base_salary;
          delete el.created_at;
          delete el.day_salary;
          delete el.updated_at;
          delete el.week_salary;
          return el;
        });
        this.employee.meta = {
          ...this.employee.meta,
          schedule_shift: shift,
        };
      }
      const data = {
        groupId: this.employee.group_id,
        departmentId: this.employee.department_id,
      };
      this.getGroupDetailFetch(data);
    }
  }

  @Watch('employee.area_id')
  changeArea() {
    if (this.employee.area_id) {
      this.getDetailArea(this.employee.area_id);
      this.getListPosition(this.employee.area_id);
    }
  }

  @Watch('employee.position_id')
  changePosition() {
    if (this.employee.position_id) {
      this.getPositionDetailFetch(this.employee.position_id);
    }
  }

  @Watch('dialogForm')
  showGroupList() {
    if (this.dialogForm) {
      this.groupDetail = {};
      this.getListGroup(this.employee.department_id);
      this.getGroupFromList(this.employee.group_id);
    }
  }

  @Watch('employee.meta.payslip.extra_full.indicator')
  changeExtraFull() {
    if (
      this.employee.meta.payslip.extra_full.indicator &&
      this.employee.meta.payslip.extra_full.nominal <= 0
    ) {
      this.employee.meta.payslip.extra_full.nominal = 6000;
    }
  }

  @Watch('employee.meta.payslip.extra_sunday.indicator')
  changeExtraSunday() {
    if (
      this.employee.meta.payslip.extra_sunday.indicator &&
      this.employee.meta.payslip.extra_sunday.indicator <= 0
    ) {
      this.employee.meta.payslip.extra_sunday.nominal = 2000;
    }
  }

  @Watch('employee.meta.payslip.value_day_7.indicator')
  changeSevenDay() {
    if (
      this.employee.meta.payslip.value_day_7.indicator &&
      this.employee.meta.payslip.value_day_7.indicator <= 0
    ) {
      this.employee.meta.payslip.value_day_7.nominal = 5000;
    }
  }

  beforeRouteLeave(to: any, from: any, next: any) {
    // console.info('InitQueryEmployee', InitQueryEmployee);
  }

  // METHODS
  checkFilter(data: any) {
    if (data.value) {
      this.filterCount += 1;
    } else {
      this.filterCount -= 1;
    }
  }

  showFilter() {
    this.filter = !this.filter;
  }

  getGroupFromList(groupId: any) {
    GroupStore.getOneGroupFromList(groupId);
  }

  getPositionDetailFetch(positionId: string) {
    PositionStore.getOnePositionFromList(positionId);
  }

  getDetailArea(areaId: string) {
    const departmentId = this.employee.department_id;
    AreaStore.getOneArea({ areaId, departmentId });
  }

  getListGroup(id: string | any) {
    GroupStore.getAllGroupEmployee(id);
  }

  getListArea(dataArea: any) {
    AreaStore.getAllArea(dataArea);
  }

  getListPosition(areaId: string) {
    PositionStore.getAllPosition(areaId);
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
    this.checkPermission();
    this.getListDepartment();
  }

  checkPermission() {
    if (
      this.userRole[0] === this.branchOfficeOne ||
      this.userRole[0] === this.generalOfficeOne
    ) {
      this.addPermission = true;
    } else {
      this.addPermission = true;
    }
  }

  getListDepartment() {
    AreaStore.setInitDataArea();
    PositionStore.setInitDataPosition();
    DepartmentStore.getAllDepartment({});
  }

  formatPrice(data: any) {
    return formatPrice(data);
  }

  getGroupDetailFetch(data: any) {
    GroupStore.getOneGroup(data);
  }

  getListData(params: any) {
    EmployeeStore.getAllEmployee(params);
  }

  goToDetail(id: string) {
    router.push({
      name: 'employee-detail',
      params: {
        employeeId: id,
      },
    });
  }

  importEmployee() {
    this.importData = !this.importData;
  }

  successImport() {
    this.importData = false;
    this.getListData(this.params);
  }

  async showForm(id: string | null = null) {
    this.$store.commit('SET_ACTIVE_GROUP', InitGroup);
    if (id) {
      await EmployeeStore.getOneEmployeeFromList(id);
      const data = {
        groupId: this.dataEmployee.group_id,
        departmentId: this.dataEmployee.department_id,
      };
      this.getGroupDetailFetch(data);
    } else {
      EmployeeStore.setInitDataEmployee();
    }
    this.employee = {
      ...this.dataEmployee,
    };
    this.dialogForm = true;
  }

  closeForm() {
    this.dialogForm = false;
    this.$v.$reset();
    this.getListData(this.params);
    this.checkPermission();
    this.getListDepartment();
    this.$store.commit('SET_ACTIVE_GROUP', InitGroup);
    // this.$store.commit('SET_LOADING_EMPLOYEE', false);
  }

  showConfirmDelete(id: string) {
    EmployeeStore.getOneEmployeeFromList(id);
    this.employee = {
      ...this.dataEmployee,
    };
    this.dialogDelete = true;
  }
  // Only disable active status, non delete
  deleteData() {
    if (this.employee.id) {
      // EmployeeStore.deleteEmployee(this.employee.id);
      this.employee.active = false;
      EmployeeStore.saveEmployee(this.employee);
      this.getListData(InitQueryEmployee);
    }
    this.dialogDelete = false;
  }

  async save() {
    if (
      this.employee.name === '' ||
      this.employee.address === '' ||
      this.employee.bpjs_id === '' ||
      this.employee.phone_no === '' ||
      this.employee.active_date === '' ||
      this.employee.date_of_birth === '' ||
      this.employee.department_id === null ||
      this.employee.area_id === null ||
      this.employee.position_id === null
    ) {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message:
          'Ada form yang belum anda isi, silahkan cek kembali inputan anda',
        color: 'warn',
      };
      openSnackbarNow(snackbar);
    } else {
      const insentifKhusus =
        this.employee.meta.payslip.insentif_khusus > 0
          ? this.employee.meta.payslip.insentif_khusus
          : 0;
      const additionBonus =
        this.employee.meta.payslip.tambahan > 0
          ? this.employee.meta.payslip.tambahan
          : 0;
      const bonus =
        this.employee.meta.payslip.bonus_lembur > 0
          ? this.employee.meta.payslip.bonus_lembur
          : 0;
      this.$v.$reset();
      const newEmployee: any = {
        ...this.employee,
        meta: {
          ...this.employee.meta,
          payslip: {
            ...this.employee.meta.payslip,
            insentif_khusus: insentifKhusus,
            tambahan: additionBonus,
            bonus_lembur: bonus,
          },
        },
        npwp_id: this.employee.npwp_id ? this.employee.npwp_id : '-', // fix bug #243
        date_of_birth:
          this.employee.place_of_birth + '/' + this.employee.date_of_birth,
      };
      delete newEmployee.place_of_birth;
      delete newEmployee.department;
      delete newEmployee.group;
      delete newEmployee.area;
      delete newEmployee.position;
      await EmployeeStore.saveEmployee(newEmployee);
      EmployeeStore.setInitDataEmployee();
      this.employee = {
        ...this.dataEmployee,
      };
      AreaStore.setInitDataArea();
      PositionStore.setInitDataPosition();
      this.getListData(this.params);
      // EmployeeStore.getAllEmployee(InitQueryEmployee);
      this.dialogForm = false;
    }
  }
}
