import {
  createBulkLeave,
  createLeave,
  deleteLeave,
  deleteManyLeave,
  fetchLeaves,
  fetchOneLeave,
  updateLeave,
} from '@/common/api/leave';
import { ILeave, InitLeave } from '@/common/interfaces/leave';
import { formatDate, openSnackbarNow } from '@/common/utils/config';
import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
export interface ILeaveState {
  isLoadingLeave: boolean;
  listLeave: any[];
  leave?: ILeave;
  pagination: any;
  params: any;
}

@Module({ dynamic: true, store, name: 'LeaveStore' })
class Leave extends VuexModule implements ILeaveState {
  isLoadingLeave = false;
  listLeave = [];
  leave = JSON.parse(JSON.stringify(InitLeave));
  pagination = {};
  params = {};
  totalData: number = 0;

  @Action
  async setInitDataLeave() {
    this.SET_LOADING_LEAVE(true);
    const res: any = {
      ...InitLeave,
    };
    this.SET_LEAVE(res);
  }

  @Action({ rawError: true })
  async getAllLeave(query: any) {
    await this.context.dispatch('setParamsGlobal', query);
    this.SET_LOADING_LEAVE(true);
    const res: any = await fetchLeaves(query);
    this.SET_LOADING_LEAVE(false);
    await this.context.dispatch('setPagination', res);
    this.SET_LIST_LEAVE(res);
  }

  @Action
  async getOneLeave(id: string) {
    const res: any = await fetchOneLeave(id);
    this.SET_LEAVE(res);
  }

  @Action
  async getOneLeaveFromList(id: string) {
    const res: any = this.listLeave.find((item: any) => item.id === id);
    if (res) {
      this.SET_LEAVE(res);
    }
  }

  @Action
  async saveLeave(data: ILeave) {
    this.SET_LOADING_LEAVE(true);
    const newData = {
      ...data,
    };
    let res: any;
    if (newData.id) {
      res = await updateLeave(newData.id, newData);
    } else {
      res = await createLeave(newData);
    }
    this.SET_LEAVE(res);
    this.getAllLeave(this.params);
  }

  @Action
  async saveBulkLeave(data: ILeave[]) {
    await createBulkLeave(data);
  }

  @Action
  async createLeave(data: ILeave) {
    this.SET_LOADING_LEAVE(true);
    const res: any = await createLeave(data);
    this.SET_LEAVE(res);
  }

  @Action
  async updateLeave(id: string, data: ILeave) {
    this.SET_LOADING_LEAVE(true);
    const res: any = await updateLeave(id, data);
    this.SET_LEAVE(res);
  }

  @Action
  async deleteLeave(id: string) {
    this.SET_LOADING_LEAVE(true);
    const res: any = await deleteLeave(id);
    this.getAllLeave(this.params);
  }

  @Action
  async deleteManyLeave(data: any) {
    try {
      const params = JSON.parse(JSON.stringify(data.query));
      this.SET_LOADING_LEAVE(true);
      const res: any = await deleteManyLeave(data);
      this.SET_LOADING_LEAVE(false);
      // this.getAllAttendance(params);
    } catch (err) {
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'error',
        message: 'Gagal menghapus',
      });
      this.SET_LOADING_LEAVE(false);
    }
  }

  @Mutation
  private SET_LEAVE(data: ILeave) {
    this.leave = data;
    this.isLoadingLeave = false;
  }

  @Mutation
  private SET_LIST_LEAVE(res: any) {
    const datas: any = [];
    if (res && Array.isArray(res)) {
      res.forEach((item: any) => {
        datas.push(item);
      });
    } else if (res && res.data && Array.isArray(res.data)) {
      this.totalData = res.total;
      res.data.forEach((item: any) => {
        datas.push(item);
      });
      delete res.data;
      this.pagination = {
        ...res,
      };
    }
    if (datas) {
      this.listLeave = datas.map((item: any) => {
        return {
          ...item,
          date_start: formatDate(item.date_start, 'short-dateTime'),
          date_end: formatDate(item.date_end, 'short-dateTime'),
          created_at: formatDate(item.created_at, 'short'),
          updated_at: formatDate(item.updated_at, 'short'),
        };
      });
    }
    this.isLoadingLeave = false;
  }

  @Mutation
  private SET_LOADING_LEAVE(status: boolean) {
    this.isLoadingLeave = status;
  }
}

export const LeaveStore = getModule(Leave);
