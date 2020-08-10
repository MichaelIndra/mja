import { createAccountRole, updateAccountRole } from '@/common/api/accountRole';
import {
  createUser,
  deleteUser,
  fetchOneUser,
  fetchUser,
  updateUser,
} from '@/common/api/user';
import { formatDate } from '@/common/utils/config';
import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { InitUser, IUser } from '../../common/interfaces/user';
export interface IUserState {
  isLoadingUser: boolean;
  listUser: any[];
  user?: IUser;
  pagination: any;
  params: any;
}

@Module({ dynamic: true, store, name: 'UserStore' })
class User extends VuexModule implements IUserState {
  isLoadingUser = false;
  listUser = [];
  user = {
    ...InitUser,
  };
  pagination = {};
  params = {};
  fullName = '';

  @Action
  async setInitDataUser() {
    this.SET_LOADING_USER(true);
    const res: any = {
      ...InitUser,
    };
    this.SET_USER(res);
  }

  @Action
  async getAllUser(params: any) {
    this.SET_PARAMS(params);
    this.SET_LOADING_USER(true);
    const res: any = await fetchUser(params);
    this.SET_LIST_USER(res);
  }

  @Action
  async getOneUser(id: string) {
    const res: any = await fetchOneUser(id);
    this.SET_USER(res);
  }

  @Action
  async getOneUserFromList(id: string) {
    const res: any = this.listUser.find((item: any) => item.id === id);
    if (res) {
      this.SET_USER(res);
    }
  }

  @Action
  async saveUser(data: any) {
    this.SET_LOADING_USER(true);
    let res: any;
    if (data.id) {
      res = await updateUser(data.id, data);
      this.setInitDataUser();
    } else {
      res = await createUser(data);
    }
    this.SET_USER(res);
    this.getAllUser(this.params);
  }

  @Action
  async createUser(data: IUser) {
    this.SET_LOADING_USER(true);
    const res: any = await createUser(data);
    // this.SET_USER(res);
    this.getAllUser(this.params);
  }

  @Action
  async updateUser(id: string, data: IUser) {
    this.SET_LOADING_USER(true);
    const res: any = await updateUser(id, data);
    this.SET_USER(res);
  }

  @Action
  async deleteUser(id: string) {
    this.SET_LOADING_USER(true);
    const res: any = await deleteUser(id);
    this.getAllUser(this.params);
  }

  @Action setUserFullName(full_name: string) {
    this.SET_FULL_NAME(full_name);
  }

  @Mutation
  private SET_FULL_NAME(name: string) {
    this.fullName = name;
  }

  @Mutation
  private SET_USER(data: IUser) {
    this.user = data;
    this.isLoadingUser = false;
  }

  @Mutation
  private SET_LIST_USER(res: any) {
    const datas: any = [];
    if (res && Array.isArray(res)) {
      res.forEach((item: any) => {
        const last: any =
          item.last_name === null || item.last_name === ''
            ? ''
            : item.last_name;
        const newData = {
          ...item,
          full_name: item.first_name + ' ' + last,
          created_at: formatDate(item.created_at, 'medium'),
          // roles:
          //   item.account_roles &&
          //   Array.isArray(item.account_roles) &&
          //   item.account_roles.length > 0
          //     ? item.account_roles[0].role.name
          //     : [],
        };
        datas.push(newData);
      });
    } else if (res && res.data && Array.isArray(res.data)) {
      res.data.forEach((item: any) => {
        const newData = {
          ...item,
          full_name:
            item.first_name + ' ' + item.last_name !== null ||
            item.last_name !== '' ||
            item.last_name
              ? item.last_name
              : '',
          created_at: formatDate(item.created_at, 'medium'),
          // roles:
          //   item.account_roles &&
          //   Array.isArray(item.account_roles) &&
          //   item.account_roles.length > 0
          //     ? item.account_roles[0].role.name
          //     : [],
        };
        datas.push(newData);
      });
      delete res.data;
      this.pagination = {
        ...res,
      };
    }
    this.listUser = datas;
    this.isLoadingUser = false;
  }

  @Mutation
  private SET_LOADING_USER(status: boolean) {
    this.isLoadingUser = status;
  }

  @Mutation
  private SET_PARAMS(params: any) {
    this.params = {
      ...params,
    };
  }
}

export const UserModule = getModule(User);
