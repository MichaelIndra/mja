import {
  createDepartment,
  deleteDepartment,
  fetchDepartments,
  fetchOneDepartment,
  updateDepartment,
} from '@/common/api/department';
import { IDepartment, InitDepartment } from '@/common/interfaces/department';
import { formatDate, setError } from '@/common/utils/config';
import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  MutationAction,
  VuexModule,
} from 'vuex-module-decorators';
export interface IDepartmentState {
  isLoadingDepartment: boolean;
  listDepartment: any[];
  department?: IDepartment;
  pagination: any;
  params: any;
}

@Module({ dynamic: true, store, name: 'DepartmentStore' })
class Department extends VuexModule implements IDepartmentState {
  isLoadingDepartment = false;
  listDepartment = [];
  listDepartmentFilter = [];
  department = {
    ...InitDepartment,
  };
  pagination = {};
  params = {};

  @Action
  async setInitDataDepartment() {
    const res: any = {
      ...InitDepartment,
    };
    this.SET_DEPARTMENT(res);
  }

  @Action
  async getAllDepartment(params: any) {
    this.SET_LOADING_DEPARTMENT(true);
    this.SET_PARAMS_DEPARTMENT(params);
    const res: any = await fetchDepartments(params);
    if (res.data || res) {
      this.SET_LOADING_DEPARTMENT(false);
      this.SET_LIST_DEPARTMENT(res);
    }
  }

  @Action
  async getOneDepartment(data: any) {
    const res: any = await fetchOneDepartment(data);
    this.SET_DEPARTMENT(res);
  }

  @Action
  async getOneDepartmentFromList(id: string) {
    const res: any = this.listDepartment.find((item: any) => item.id === id);
    if (res) {
      this.SET_DEPARTMENT(res);
    }
  }

  @Action
  async saveDepartment(data: IDepartment) {
    let res: any;
    if (data.id) {
      const newData = {
        id: data.id,
        name: data.name,
        branch_id: data.branch_id,
        meta: data.meta,
      };
      res = await updateDepartment(newData.id, newData);
    } else {
      res = await createDepartment(data);
    }
    if (res.data || res) {
      this.SET_DEPARTMENT(res);
    }
  }

  @Action
  async createDepartment(data: IDepartment) {
    const res: any = await createDepartment(data);
    // this.getAllDepartment(this.params);
  }

  @Action
  async updateDepartment(id: string, data: IDepartment) {
    const res: any = await updateDepartment(id, data);
    this.SET_DEPARTMENT(res);
  }

  @Action
  async deleteDepartment(id: string) {
    const res: any = await deleteDepartment(id);
    this.getAllDepartment(this.params);
  }

  @Mutation
  private SET_DEPARTMENT(data: IDepartment) {
    const createdAt = data.created_at;
    let newData: any;
    if (createdAt) {
      newData = {
        ...data,
        created_at: formatDate(createdAt, 'long'),
      };
    } else {
      newData = data;
    }
    this.department = newData;
    this.isLoadingDepartment = false;
  }

  @Mutation
  private SET_LIST_DEPARTMENT(res: any) {
    const datas: any = [];
    let dataFilter: any = [];
    if (res && Array.isArray(res)) {
      res.forEach((item: any) => {
        const newData = {
          ...item,
          created_at: formatDate(item.created_at, 'long'),
        };
        datas.push(newData);
      });
    } else if (res && res.data && Array.isArray(res.data)) {
      res.data.forEach((item: any) => {
        const newData = {
          ...item,
          created_at: formatDate(item.created_at, 'long'),
        };
        datas.push(newData);
      });
      delete res.data;
      this.pagination = {
        ...res,
      };
    }
    this.listDepartment = datas;
    dataFilter = [{ id: '0', name: 'Tampilkan Semua' }].concat(datas);
    this.listDepartmentFilter = dataFilter;
    this.isLoadingDepartment = false;
  }

  @Mutation
  private SET_LOADING_DEPARTMENT(status: boolean) {
    this.isLoadingDepartment = status;
  }

  @Mutation
  private SET_PARAMS_DEPARTMENT(params: any) {
    this.params = {
      ...params,
    };
  }
}

export const DepartmentStore = getModule(Department);
