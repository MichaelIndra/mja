import { fetchLogs } from '@/common/api/log';
import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { InitQueryLog } from '../../common/interfaces/query';

export interface ILog {
  listLog: any;
}

@Module({ dynamic: true, store, name: 'LogStore' })
class Log extends VuexModule implements ILog {
  listLog = [];

  @Action
  async getListLog(params: any) {
    const res: any = await fetchLogs(params);
    this.SET_LIST_LOG(res);
  }

  @Mutation
  SET_LIST_LOG(res: any) {
    let datas: any = [];
    if (res && Array.isArray(res)) {
      datas = res;
    } else if (res && res.data && Array.isArray(res.data)) {
      datas = res.data;
    }
    this.listLog = datas;
  }
}

export const LogStore = getModule(Log);
