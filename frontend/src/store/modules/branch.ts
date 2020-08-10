import {
  createBranch,
  deleteBranch,
  fetchBranchs,
  fetchOneBranch,
  updateBranch,
} from '@/common/api/branch';
import { IBranch, InitBranch } from '@/common/interfaces/branch';
import { formatDate } from '@/common/utils/config';
import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

export interface IBranchState {
  isLoadingBranch: boolean;
  listBranch: any[];
  branch?: IBranch;
  pagination: any;
  params: any;
}

@Module({ dynamic: true, store, name: 'BranchStore' })
class Branch extends VuexModule implements IBranchState {
  isLoadingBranch = false;
  listBranch = [];
  branch = {
    ...InitBranch,
  };
  pagination = {};
  params = {};

  @Action
  async setInitDataBranch() {
    this.SET_LOADING_BRANCH(true);
    const res: any = {
      ...InitBranch,
    };
    this.SET_BRANCH(res);
  }

  @Action
  searchBranch(keyword: any) {
    const res: any = this.listBranch.filter((el: any) => {
      return el.name.toLowerCase().includes(keyword.toLowerCase());
    });
    if (res.data || res) {
      this.SET_LIST_BRANCH(res);
    }
  }

  @Action
  async getAllBranch(params: any) {
    this.SET_PARAMS(params);
    this.SET_LOADING_BRANCH(true);
    const res: any = await fetchBranchs(params);
    this.SET_LIST_BRANCH(res);
  }

  @Action
  async getOneBranch(id: string) {
    const res: any = await fetchOneBranch(id);
    this.SET_BRANCH(res);
  }

  @Action
  async getOneBranchFromList(id: string) {
    const res: any = this.listBranch.find((item: any) => item.id === id);
    if (res) {
      this.SET_BRANCH(res);
    }
  }

  @Action
  async saveBranch(data: IBranch) {
    this.SET_LOADING_BRANCH(true);
    let res: any;
    if (data.id) {
      res = await updateBranch(data.id, data);
    } else {
      res = await createBranch(data);
    }
    this.SET_BRANCH(res);
  }

  @Action
  async createBranch(data: IBranch) {
    this.SET_LOADING_BRANCH(true);
    const res: any = await createBranch(data);
    // this.SET_BRANCH(res);
    this.getAllBranch(this.params);
  }

  @Action
  async updateBranch(id: string, data: IBranch) {
    this.SET_LOADING_BRANCH(true);
    const res: any = await updateBranch(id, data);
    this.SET_BRANCH(res);
  }

  @Action
  async deleteBranch(id: string) {
    this.SET_LOADING_BRANCH(true);
    const res: any = await deleteBranch(id);
    this.getAllBranch(this.params);
  }

  @Mutation
  private SET_BRANCH(data: IBranch) {
    this.branch = data;
    this.isLoadingBranch = false;
  }

  @Mutation
  private SET_LIST_BRANCH(res: any) {
    const datas: any = [];
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
    this.listBranch = datas;
    this.isLoadingBranch = false;
  }

  @Mutation
  private SET_LOADING_BRANCH(status: boolean) {
    this.isLoadingBranch = status;
  }

  @Mutation
  private SET_PARAMS(params: any) {
    this.params = {
      ...params,
    };
  }
}

export const BranchStore = getModule(Branch);
