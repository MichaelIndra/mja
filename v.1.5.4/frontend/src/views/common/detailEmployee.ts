import { InitGroup } from '@/common/interfaces/group';
import { IQuery } from '@/common/interfaces/query';
import { convertDate, formatDate, formatPrice } from '@/common/utils/config';
import { AuthModule } from '@/store/modules/auth';
import { EmployeeStore } from '@/store/modules/employee';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { IGroup } from '../../common/interfaces/group';
import dataGroup from '../../components/department/DataGroup.vue';

@Component({
  name: 'DetailEmployee',
  components: {
    dataGroup,
  },
})
export default class DetailEmployee extends Vue {
  // DATA
  params: IQuery = {
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
  activeGroup: IGroup = InitGroup;

  // METHODS
  mounted() {
    this.getEmployeeDetail();
  }

  formatDate(date: any, type: string) {
    return formatDate(date, type);
  }

  formatPrice(price: any) {
    return formatPrice(price);
  }

  async getEmployeeDetail() {
    const data: any = {
      employeeId: this.$route.params.employeeId,
      params: this.params,
    };
    await EmployeeStore.getOneEmployee(data);
    this.activeGroup = this.employee.group;
  }

  convertDate(data: any) {
    return convertDate(data);
  }

  // GETTERS
  get employee(): any {
    return EmployeeStore.employee;
  }

  get userRole(): any {
    return AuthModule.roles;
  }
}
