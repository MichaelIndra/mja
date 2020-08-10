import { IDepartment } from '@/common/interfaces/department';
import { DepartmentStore } from '@/store/modules/department';
import { EmployeeStore } from '@/store/modules/employee';
import { UserModule } from '@/store/modules/user';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
  name: 'DashboardHumanResource',
})
export default class DashboardHumanResource extends Vue {
  // GETTERS
  get listDepartment(): IDepartment[] {
    return DepartmentStore.listDepartment;
  }

  get listEmployee(): IDepartment[] {
    return EmployeeStore.listEmployee;
  }

  get listUser(): IDepartment[] {
    return UserModule.listUser;
  }

  // METHODS
  mounted() {
    this.getListDepartment();
    this.getListEmployee();
  }

  getListDepartment() {
    DepartmentStore.getAllDepartment({});
  }

  getListEmployee() {
    EmployeeStore.getAllEmployee({});
  }
}
