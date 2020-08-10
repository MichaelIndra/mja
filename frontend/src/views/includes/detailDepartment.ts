import { IDepartment } from '@/common/interfaces/department';
import { InitQuery, IQuery } from '@/common/interfaces/query';
import { formatDate } from '@/common/utils/config';
import { DepartmentStore } from '@/store/modules/department';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import departmentArea from './DepartmentArea.vue';
import departmentGroup from './DepartmentGroup.vue';

@Component({
  name: 'DetailDepartment',
  components: {
    departmentGroup,
    departmentArea,
  },
})
export default class DetailDepartment extends Vue {
  // DATA
  params: IQuery = {
    filters: [
      {
        field: 'branch',
        value: 'join',
      },
    ],
  };

  // METHODS
  mounted() {
    this.getDepartement();
  }

  formatDate(date: any, type: string) {
    return formatDate(date, type);
  }

  getDepartement() {
    const departmentId: any = this.$route.params.departmentId;
    const params: any = this.params;
    DepartmentStore.getOneDepartment({ departmentId, params });
  }

  // GETTERS
  get department(): IDepartment {
    return DepartmentStore.department;
  }
}
