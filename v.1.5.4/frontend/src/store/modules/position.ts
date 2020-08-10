import {
  createPosition,
  deletePosition,
  fetchOnePosition,
  fetchPositions,
  updatePosition,
} from '@/common/api/position';
import { InitPosition, IPosition } from '@/common/interfaces/position';
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
export interface IPositionState {
  isLoadingPosition: boolean;
  listPosition: any[];
  position?: IPosition;
  pagination: any;
  params: any;
}

@Module({ dynamic: true, store, name: 'PositionStore' })
class Position extends VuexModule implements IPositionState {
  isLoadingPosition = false;
  listPosition = [];
  listPositionFilter = [];
  position = {
    ...InitPosition,
  };
  pagination = {};
  params = {};

  @Action
  setInitDataPositionFilter() {
    this.SET_LIST_POSITION([]);
  }

  @Action
  async setInitDataPosition() {
    const res: any = {
      ...InitPosition,
    };
    this.SET_POSITION(res);
  }

  @Action
  async getAllPosition(areaId: string) {
    this.SET_LOADING_POSITION(true);
    const res: any = await fetchPositions(areaId);
    if (res.data || res) {
      this.SET_LIST_POSITION(res);
    }
  }

  @Action
  async getOnePosition(data: any) {
    const res: any = await fetchOnePosition(data);
    this.SET_POSITION(res);
  }

  @Action
  async getOnePositionFromList(id: string) {
    const res: any = this.listPosition.find((item: any) => item.id === id);
    if (res) {
      this.SET_POSITION(res);
    }
  }

  @Action
  async savePosition(data: IPosition) {
    let res: any;
    if (data.id) {
      res = await updatePosition(data.id, data, data.area_id);
    } else {
      res = await createPosition(data, data.area_id);
    }
  }

  @Action
  async createPosition(data: IPosition) {
    const res: any = await createPosition(data, '');
  }

  @Action
  async updatePosition(id: string, data: IPosition) {
    const res: any = await updatePosition(id, data, '');
    this.SET_POSITION(res);
  }

  @Action
  async deletePosition(data: any) {
    const res: any = await deletePosition(data.id, false, data.areaId);
  }

  @Mutation
  RESET_POSITION_FILTER() {
    this.listPositionFilter = [];
  }

  @Mutation
  private SET_POSITION(data: IPosition) {
    const createdAt: any = data.created_at;
    let newData: any;
    if (createdAt) {
      newData = {
        ...data,
        created_at: formatDate(createdAt, 'long'),
      };
    } else {
      newData = data;
    }
    this.position = newData;
    this.isLoadingPosition = false;
  }

  @Mutation
  private SET_LIST_POSITION(res: any) {
    const datas: any = [];
    const dataFilter: any = [];
    if (res && Array.isArray(res)) {
      res.forEach((item: any) => {
        const newData = {
          ...item,
          created_at: formatDate(item.created_at, 'long'),
          updated_at: formatDate(item.updated_at, 'long'),
        };
        datas.push(newData);
      });
    } else if (res && res.data && Array.isArray(res.data)) {
      res.data.forEach((item: any) => {
        const newData = {
          ...item,
          created_at: formatDate(item.created_at, 'long'),
          updated_at: formatDate(item.updated_at, 'long'),
        };
        datas.push(newData);
      });
      delete res.data;
      this.pagination = {
        ...res,
      };
    }
    this.listPosition = datas;
    // dataFilter = [{ id: '0', name: 'Tampilkan Semua' }].concat(datas);
    this.listPositionFilter = datas;
    this.isLoadingPosition = false;
  }

  @Mutation
  private SET_LOADING_POSITION(status: boolean) {
    this.isLoadingPosition = status;
  }

  @Mutation
  private SET_PARAMS(params: any) {
    this.params = {
      ...params,
    };
  }
}

export const PositionStore = getModule(Position);
