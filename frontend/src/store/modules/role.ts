import {
  createRole,
  deleteRole,
  fetchOneRole,
  fetchRoles,
  updateRole,
} from '@/common/api/role';
import { InitRole, IRole } from '@/common/interfaces/role';
import { formatDate } from '@/common/utils/config';
import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

export interface IRoleState {
  isLoadingRole: boolean;
  listRole: any[];
  role?: IRole;
  pagination: any;
  params: any;
}

@Module({ dynamic: true, store, name: 'RoleStore' })
class Role extends VuexModule implements IRoleState {
  isLoadingRole = false;
  listRole = [];
  role = {
    ...InitRole,
  };
  pagination = {};
  params = {};

  @Action
  async setInitDataRole() {
    this.SET_LOADING_ROLE(true);
    const res: any = {
      ...InitRole,
    };
    this.SET_ROLE(res);
  }

  @Action
  async getAllRole(params: any) {
    this.SET_PARAMS(params);
    this.SET_LOADING_ROLE(true);
    const res: any = await fetchRoles(params);
    this.SET_LIST_ROLE(res);
  }

  @Action
  async getOneRole(id: string) {
    const res: any = await fetchOneRole(id);
    this.SET_ROLE(res);
  }

  @Action
  async getOneRoleFromList(id: string) {
    const res: any = this.listRole.find((item: any) => item.id === id);
    if (res) {
      this.SET_ROLE(res);
    }
  }

  @Action
  async saveRole(data: IRole) {
    this.SET_LOADING_ROLE(true);
    let res: any;
    if (data.id) {
      res = await updateRole(data.id, data);
    } else {
      res = await createRole(data);
    }
    this.SET_ROLE(res);
    this.getAllRole(this.params);
  }

  @Action
  async createRole(data: IRole) {
    this.SET_LOADING_ROLE(true);
    const res: any = await createRole(data);
    // this.SET_ROLE(res);
    this.getAllRole(this.params);
  }

  @Action
  async updateRole(id: string, data: IRole) {
    this.SET_LOADING_ROLE(true);
    const res: any = await updateRole(id, data);
    this.SET_ROLE(res);
  }

  @Action
  async deleteRole(id: string) {
    this.SET_LOADING_ROLE(true);
    const res: any = await deleteRole(id);
    this.getAllRole(this.params);
  }

  @Mutation
  private SET_ROLE(data: IRole) {
    this.role = data;
    this.isLoadingRole = false;
  }

  @Mutation
  private SET_LIST_ROLE(res: any) {
    const datas: any = [];
    if (res && Array.isArray(res)) {
      res.forEach((item: any) => {
        const newData = {
          ...item,
          created_at: formatDate(item.created_at, 'medium'),
        };
        datas.push(newData);
      });
    } else if (res && res.data && Array.isArray(res.data)) {
      res.data.forEach((item: any) => {
        const newData = {
          ...item,
          created_at: formatDate(item.created_at, 'medium'),
        };
        datas.push(newData);
      });
      delete res.data;
      this.pagination = {
        ...res,
      };
    }
    this.listRole = datas;
    this.isLoadingRole = false;
  }

  @Mutation
  private SET_LOADING_ROLE(status: boolean) {
    this.isLoadingRole = status;
  }

  @Mutation
  private SET_PARAMS(params: any) {
    this.params = {
      ...params,
    };
  }
}

export const RoleStore = getModule(Role);
