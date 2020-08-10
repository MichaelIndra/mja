import { IArea } from '@/common/interfaces/area';
import { IDepartment } from '@/common/interfaces/department';
import { IGroup } from '@/common/interfaces/group';
import { IPosition } from '@/common/interfaces/position';
import {
  InitQueryAttendance,
  InitQueryEmployee,
  InitQueryLeave,
  InitQueryOvertime,
  InitQueryPayslip,
} from '@/common/interfaces/query';
import { formatDate } from '@/common/utils/config';
import { AreaStore } from '@/store/modules/area';
import { DepartmentStore } from '@/store/modules/department';
import { GroupStore } from '@/store/modules/group';
import { PositionStore } from '@/store/modules/position';
import { SettingsStore } from '@/store/modules/settings';
import moment from 'moment';
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { InitQueryOutcome } from '../../common/interfaces/query';

@Component({
  name: 'Filters',
})
export default class Filters extends Vue {
  // PROPS
  @Prop() readonly options: any;

  // DATA
  date1: boolean = false;
  date2: boolean = false;
  dateStart: string = '';
  dateEnd: string = '';
  dateNow: string = new Date().toISOString().substring(0, 10);
  keyword: string = '';
  checkFilter: any = {
    department: false,
    group: false,
    area: false,
    position: false,
    keyword: false,
    dateStart: false,
    dateEnd: false,
  };
  departmentId: string = '';
  groupId: string = '';
  areaId: string = '';
  positionId: string = '';
  filterDepartment: string = '';
  filterGroup: string = '';
  filterArea: string = '';
  filterPosition: string = '';
  filterKeyword: string = '';
  filterStatus: string = '';
  filterActive: any = {};
  statusEmployee: string = '';
  statusEmployees: any = ['KHUSUS', 'REGULER'];
  activeEmployee: boolean = true;
  activeEmployees: any = [
    { name: 'Karyawan Aktif', value: true },
    { name: 'Karyawan Tidak Aktif', value: false },
  ];
  warn: any = {
    keyword: false,
  };

  get params(): any {
    return SettingsStore.params;
  }

  get listDepartmentFilter(): IDepartment[] {
    return DepartmentStore.listDepartmentFilter;
  }

  get listGroupFilter(): IGroup[] {
    return GroupStore.listGroupFilter;
  }

  get listAreaFilter(): IArea[] {
    return AreaStore.listAreaFilter;
  }

  get listPositionFilter(): IPosition[] {
    return PositionStore.listPositionFilter;
  }

  // WATCH
  @Watch('checkFilter.keyword')
  changeCheckFilterKeyword() {
    if (this.checkFilter.keyword) {
      this.$emit('checkFilter', { keyword: 'keyword', value: true });
    } else {
      this.$emit('checkFilter', { keyword: 'keyword', value: false });
    }
  }

  @Watch('checkFilter.department')
  changeCheckFilterDepartment() {
    if (this.checkFilter.department) {
      this.$emit('checkFilter', { keyword: 'department', value: true });
    } else {
      this.$emit('checkFilter', { keyword: 'department', value: false });
    }
  }

  @Watch('checkFilter.group')
  changeCheckFilterGroup() {
    if (this.checkFilter.group) {
      this.$emit('checkFilter', { keyword: 'group', value: true });
    } else {
      this.$emit('checkFilter', { keyword: 'group', value: false });
    }
  }

  @Watch('checkFilter.area')
  changeCheckFilterArea() {
    if (this.checkFilter.area) {
      this.$emit('checkFilter', { keyword: 'area', value: true });
    } else {
      this.$emit('checkFilter', { keyword: 'area', value: false });
    }
  }

  @Watch('checkFilter.position')
  changeCheckFilterPosition() {
    if (this.checkFilter.position) {
      this.$emit('checkFilter', { keyword: 'position', value: true });
    } else {
      this.$emit('checkFilter', { keyword: 'position', value: false });
    }
  }

  @Watch('departmentId')
  searchDepartment() {
    if (this.departmentId === '0') {
      this.setEmitData(false);
      this.checkFilter.department = false;
      this.groupId = '0';
      this.areaId = '0';
      this.positionId = '0';
      this.dateStart = '';
      this.dateEnd = '';
      this.keyword = '';
    } else {
      this.setQueryDepartment(this.departmentId);
      this.checkFilter.department = true;
    }
  }

  @Watch('groupId')
  searchGroup() {
    if (this.groupId === '0') {
      this.checkFilter.group = false;
    } else {
      this.setQueryGroup(this.groupId);
      this.checkFilter.group = true;
    }
  }

  @Watch('areaId')
  searchArea() {
    if (this.areaId === '0') {
      this.checkFilter.area = false;
    } else {
      this.setQueryArea(this.areaId);
      this.checkFilter.area = true;
    }
  }

  @Watch('positionId')
  searchPosition() {
    if (this.positionId === '0') {
      this.checkFilter.position = false;
    } else {
      this.setQueryPosition(this.positionId);
      this.checkFilter.position = true;
    }
  }

  // @Watch('keyword')
  // resetKeyword() {
  //   if (this.keyword === '') {
  //     this.setEmitData(false);
  //     this.getListDepartment();
  //   }
  // }

  @Watch('dateStart')
  searchDateStart() {
    if (this.dateStart === '') {
      this.setEmitData(false);
      this.checkFilter.dateStart = false;
    } else {
      this.setQueryDateStart(this.dateStart);
      this.checkFilter.dateStart = true;
    }
  }

  @Watch('dateEnd')
  searchDateEnd() {
    if (this.dateEnd === '') {
      this.setEmitData(false);
      this.checkFilter.dateEnd = false;
    } else {
      this.setQueryDateEnd(this.dateEnd);
      this.checkFilter.dateEnd = true;
    }
  }

  @Watch('statusEmployee')
  watchStatusEmployee() {
    if (this.statusEmployee === '') {
      this.setEmitData(false);
    } else {
      this.setQueryStatusEmployee(this.statusEmployee);
    }
  }

  @Watch('activeEmployee')
  watchActiveEmployee() {
    // if (!this.activeEmployee) {
    //   this.setEmitData(false);
    // } else {
    // }
    this.setQueryActiveEmployee(this.activeEmployee);
  }

  // METHODS
  mounted() {
    this.setInitFieldFilter();
    this.setEmitData(false);
    this.getListDepartment();
  }

  setInitFieldFilter() {
    switch (this.options.type) {
      case 'attendance':
        this.filterDepartment = 'employee.department_id';
        this.filterGroup = 'employee.group_id';
        this.filterArea = 'employee.area_id';
        this.filterPosition = 'employee.position_id';
        this.filterKeyword = 'employee.name';
        break;

      case 'leave':
        this.filterDepartment = 'employee.department_id';
        this.filterGroup = 'employee.group_id';
        this.filterArea = 'employee.area_id';
        this.filterPosition = 'employee.position_id';
        this.filterKeyword = 'employee.name';
        break;

      case 'report_payslip':
        this.filterDepartment = 'employee.department_id';
        this.filterGroup = 'employee.group_id';
        this.filterArea = 'employee.area_id';
        this.filterPosition = 'employee.position_id';
        this.filterKeyword = 'employee.name';
        this.filterStatus = 'employee.status';
        break;

      case 'report_payslip_outcome':
        // this.filterDepartment = 'employee.department_id';
        // this.filterGroup = 'employee.group_id';
        // this.filterArea = 'employee.area_id';
        // this.filterPosition = 'employee.position_id';
        // this.filterKeyword = 'employee.name';
        // this.filterStatus = 'employee.status';
        break;

      default:
        this.filterDepartment = 'department_id';
        this.filterGroup = 'group_id';
        this.filterArea = 'area_id';
        this.filterPosition = 'position_id';
        this.filterKeyword = 'name';
        this.filterStatus = 'status';
        this.filterActive = 'active';
        break;
    }
  }

  setEmitData(params: boolean) {
    this.warn.keyword = false;
    switch (this.options.type) {
      case 'employee':
        if (params) {
          this.$emit('getListData', this.params);
        } else {
          this.$emit('getListData', InitQueryEmployee);
        }
        break;
      case 'attendance':
        if (params) {
          this.$emit('getListData', this.params);
        } else {
          this.$emit('getListData', InitQueryAttendance);
        }
        break;
      case 'leave':
        if (params) {
          this.$emit('getListData', this.params);
        } else {
          this.$emit('getListData', InitQueryLeave);
        }
        break;
      case 'report_payslip':
        if (params) {
          this.$emit('getListData', this.params);
        } else {
          this.$emit('getListData', InitQueryOvertime);
        }
        break;
      case 'report_payslip_outcome':
        if (params) {
          console.info('true report_payslip_outcome', this.params);
          this.$emit('getListData', this.params);
        } else {
          const startOfMonth = moment()
            .startOf('month')
            .format('YYYY-MM-DD hh:mm:ss');
          const endOfMonth = moment()
            .endOf('month')
            .format('YYYY-MM-DD hh:mm:ss');
          const initQuery = {
            page: 1,
            per_page: 10,
            filters: [
              {
                field: 'start_at',
                value: 'ASC',
              },
              {
                field: 'department',
                value: 'join',
              },
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
            ],
          };
          this.$emit('getListData', initQuery, 'outcome');
        }
        break;
    }
  }

  removeParams(field: string) {
    SettingsStore.removeParamsField(field);
  }

  getGroupFromList(groupId: any) {
    GroupStore.getOneGroupFromList(groupId);
  }

  getListPosition(areaId: string) {
    PositionStore.getAllPosition(areaId);
  }

  getListDepartment() {
    AreaStore.setInitDataArea();
    PositionStore.setInitDataPosition();
    DepartmentStore.getAllDepartment({});
  }

  getListGroup(id: string | any) {
    GroupStore.getAllGroupEmployee(id);
  }

  getListArea(dataArea: any) {
    AreaStore.getAllArea(dataArea);
  }

  searchKeyword() {
    if (this.keyword !== '') {
      const find = this.params.filters.find(
        (el: any) => el.operator === 'cont',
      );
      if (!find) {
        SettingsStore.pushParamsGlobal({
          field: this.filterKeyword,
          operator: 'cont',
          value: this.keyword,
        });
      } else {
        SettingsStore.changeParamsGlobal({
          keyword: true,
          field: 'cont',
          value: this.keyword,
        });
      }
      this.setEmitData(true);
      this.checkFilter.keyword = true;
    } else {
      this.warn.keyword = true;
      // this.$emit('getListData', InitQueryEmployee);
      // this.checkFilter.keyword = false;
      // this.getListDepartment();
    }
  }

  setQueryStatusEmployee(status: any) {
    this.getGroupFromList(status);
    const find = this.params.filters.find((el: any) => {
      return el.field === this.filterStatus;
    });
    if (!find) {
      SettingsStore.pushParamsGlobal({
        field: this.filterStatus,
        operator: 'eq',
        value: status,
      });
    } else {
      SettingsStore.changeParamsGlobal({
        field: this.filterStatus,
        value: status,
      });
    }
    this.setEmitData(true);
  }

  setQueryActiveEmployee(active: boolean) {
    // this.getGroupFromList(active);
    const find = this.params.filters.find((el: any) => {
      return el.field === this.filterActive;
    });
    if (!find) {
      SettingsStore.pushParamsGlobal({
        field: this.filterActive,
        operator: 'eq',
        value: this.activeEmployee,
      });
    } else {
      SettingsStore.changeParamsGlobal({
        field: this.filterActive,
        value: this.activeEmployee,
      });
    }
    this.setEmitData(true);
  }

  setQueryPosition(positionId: string) {
    this.getGroupFromList(positionId);
    const find = this.params.filters.find((el: any) => {
      return el.field === this.filterPosition;
    });
    if (!find) {
      SettingsStore.pushParamsGlobal({
        field: this.filterPosition,
        operator: 'eq',
        value: positionId,
      });
    } else {
      SettingsStore.changeParamsGlobal({
        field: this.filterPosition,
        value: positionId,
      });
    }
    this.setEmitData(true);
  }

  setQueryArea(areaId: string) {
    this.getGroupFromList(areaId);
    const find = this.params.filters.find((el: any) => {
      return el.field === this.filterArea;
    });
    if (!find) {
      SettingsStore.pushParamsGlobal({
        field: this.filterArea,
        operator: 'eq',
        value: areaId,
      });
    } else {
      SettingsStore.changeParamsGlobal({
        field: this.filterArea,
        value: areaId,
      });
    }
    this.getListPosition(areaId);
    this.setEmitData(true);
  }

  setQueryGroup(groupId: string) {
    this.getGroupFromList(groupId);
    const find = this.params.filters.find((el: any) => {
      return el.field === this.filterGroup;
    });
    if (!find) {
      SettingsStore.pushParamsGlobal({
        field: this.filterGroup,
        operator: 'eq',
        value: groupId,
      });
    } else {
      SettingsStore.changeParamsGlobal({
        field: this.filterGroup,
        value: groupId,
      });
    }
    this.setEmitData(true);
  }

  async setQueryDepartment(departmentId: string) {
    const find = this.params.filters.find(
      (el: any) => el.field === this.filterDepartment,
    );
    if (!find) {
      SettingsStore.pushParamsGlobal({
        field: this.filterDepartment,
        operator: 'eq',
        value: departmentId,
      });
    } else {
      SettingsStore.changeParamsGlobal({
        field: this.filterDepartment,
        value: departmentId,
      });
    }
    await this.setEmitData(true);
    this.getListGroup(this.departmentId);
    this.getListArea(this.departmentId);
  }

  setQueryDateStart(dateStart: string) {
    const find = this.params.filters.find((el: any) => {
      return el.operator === 'gte';
    });
    if (!find) {
      SettingsStore.pushParamsGlobal({
        field: this.options.dataDateStart,
        operator: 'gte',
        value: formatDate(dateStart, 'dateTime'),
      });
    } else {
      SettingsStore.changeParamsGlobal({
        field: this.options.dataDateStart,
        date: 'gte',
        value: formatDate(dateStart, 'dateTime'),
      });
    }
    this.setEmitData(true);
  }

  setQueryDateEnd(dateEnd: string) {
    // const newDate = new Date(new Date(dateEnd).getTime() + 86400000);
    const newDate = moment(dateEnd)
      .locale('id')
      .format('YYYY-MM-DD 23:59:59');
    const find = this.params.filters.find((el: any) => {
      return el.operator === 'lte';
    });
    if (!find) {
      SettingsStore.pushParamsGlobal({
        field: this.options.dataDateEnd,
        operator: 'lte',
        value: newDate,
      });
    } else {
      SettingsStore.changeParamsGlobal({
        field: this.options.dataDateEnd,
        date: 'lte',
        value: newDate,
      });
    }
    this.setEmitData(true);
  }

  clearFilter() {
    if (this.options.type === 'attendance') {
      this.keyword = '';
      this.dateStart = '';
      this.dateEnd = '';
      this.removeParams('employee.group_id');
      this.removeParams('employee.area_id');
      this.removeParams('employee.position_id');
      this.removeParams('employee.name');
    } else if (this.options.type === 'employee') {
      this.removeParams('group_id');
      this.removeParams('area_id');
      this.removeParams('position_id');
      this.removeParams('name');
      this.removeParams('status');
    }
    this.statusEmployee = '';
    // this.keyword = '';
    this.departmentId = '0';
    this.setEmitData(false);
  }
}
