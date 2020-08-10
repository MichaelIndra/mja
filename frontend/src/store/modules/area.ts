import {
  createArea,
  deleteArea,
  fetchAreas,
  fetchAreasFilter,
  fetchOneArea,
  updateArea,
} from '@/common/api/area';
import { IArea, InitArea } from '@/common/interfaces/area';
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
export interface IAreaState {
  isLoadingArea: boolean;
  listArea: any[];
  area?: IArea;
  pagination: any;
  params: any;
}

@Module({ dynamic: true, store, name: 'AreaStore' })
class Area extends VuexModule implements IAreaState {
  isLoadingArea = false;
  listArea = [];
  listAreaFilter = [];
  area = {
    ...InitArea,
  };
  pagination = {};
  params = {};

  @Action
  setInitDataAreaFilter() {
    this.SET_LIST_AREA([]);
  }

  @Action
  async setInitDataArea() {
    const res: any = {
      ...InitArea,
    };
    this.SET_AREA(res);
  }

  @Action
  searchArea(keyword: any) {
    const res: any = this.listArea.filter((el: any) => {
      return el.name.includes(keyword);
    });
    if (res.data || res) {
      this.SET_LIST_AREA(res);
    }
  }

  @Action
  async getAllAreaFilter(payload: any) {
    this.SET_LOADING_AREA(true);
    delete payload.params.page;
    delete payload.params.per_page;
    const res: any = await fetchAreasFilter(payload);
    this.SET_LOADING_AREA(false);
    this.SET_LIST_AREA(res);
  }

  @Action
  async getAllArea(department_id: any) {
    this.SET_LOADING_AREA(true);
    const res: any = await fetchAreas(department_id);
    this.SET_LOADING_AREA(false);
    await this.context.dispatch('setPagination', res);
    this.SET_LIST_AREA(res);
  }

  @Action
  async getOneArea(data: any) {
    const res: any = await fetchOneArea(data, {});
    this.SET_AREA(res);
  }

  @Action
  async getOneAreaFromList(id: string) {
    const res: any = this.listArea.find((item: any) => item.id === id);
    if (res) {
      this.SET_AREA(res);
    }
  }

  @Action
  async saveArea(data: IArea) {
    let res: any;
    if (data.id) {
      res = await updateArea(data.id, data, data.department_id);
    } else {
      res = await createArea(data, data.department_id);
    }
  }

  @Action
  async createArea(data: IArea) {
    const res: any = await createArea(data, '');
  }

  @Action
  async updateArea(id: string, data: IArea) {
    const res: any = await updateArea(id, data, '');
    this.SET_AREA(res);
  }

  @Action
  async deleteArea(data: any) {
    const res: any = await deleteArea(data.id, false, data.departmentId);
  }

  @Mutation
  RESET_AREA_FILTER() {
    this.listAreaFilter = [];
  }

  @Mutation
  private SET_AREA(data: IArea) {
    const createdAt = data.created_at;
    let newData: IArea;
    if (createdAt) {
      newData = {
        ...data,
      };
    } else {
      newData = data;
    }
    this.area = newData;
    this.isLoadingArea = false;
  }

  @Mutation
  private SET_LIST_AREA(res: any) {
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
    this.listArea = datas;
    // dataFilter = [{ id: '0', name: 'Tampilkan Semua' }].concat(datas);
    this.listAreaFilter = datas;
    this.isLoadingArea = false;
  }

  @Mutation
  private SET_LOADING_AREA(status: boolean) {
    this.isLoadingArea = status;
  }

  @Mutation
  private SET_PARAMS_AREA(params: any) {
    this.params = {
      ...params,
    };
  }
}

export const AreaStore = getModule(Area);
