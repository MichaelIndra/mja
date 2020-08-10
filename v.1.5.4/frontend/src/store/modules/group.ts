import {
  createGroup,
  deleteGroup,
  fetchGroups,
  fetchOneGroup,
  updateGroup,
} from '@/common/api/group';
import { IGroup, InitGroup } from '@/common/interfaces/group';
import { splitTimeEnd, splitTimeStart } from '@/common/utils/config';
import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

export interface IGroupState {
  isLoadingGroup: boolean;
  listGroup: any[];
  group?: IGroup;
  selectedGroup: string;
  pagination: any;
  params: any;
}

@Module({ dynamic: true, store, name: 'GroupStore' })
class Group extends VuexModule implements IGroupState {
  isLoadingGroup = false;
  listGroup = [];
  listGroupFilter = [];
  group = {
    ...InitGroup,
  };
  activeGroup = {
    ...InitGroup,
  };
  selectedGroup = '';
  pagination = {};
  params = {};

  @Action
  setInitDataGroupFilter() {
    this.SET_LIST_GROUP([]);
  }

  @Action
  async setInitDataGroup() {
    this.SET_LOADING_GROUP(true);
    const res: any = {
      ...InitGroup,
    };
    this.SET_GROUP(res);
  }

  @Action({ rawError: true })
  async getAllGroup(departmentId: string) {
    // this.SET_PARAMS(departmentId);
    this.SET_LOADING_GROUP(true);
    const res: any = await fetchGroups(departmentId, this.params);
    if (res.length > 0) {
      this.SET_LIST_GROUP(res);
      this.SET_GROUP(res[0]);
      this.SET_ACTIVE_GROUP(res[0]);
      this.SET_SELECTED_GROUP(res[0].id);
    } else {
      this.SET_LIST_GROUP([]);
    }
  }

  @Action({ rawError: true })
  async getAllGroupEmployee(departmentId: string) {
    this.SET_LOADING_GROUP(true);
    const res: any = await fetchGroups(departmentId);
    this.SET_LOADING_GROUP(false);
    if (res.length > 0) {
      this.SET_LIST_GROUP(res);
    } else {
      this.SET_LIST_GROUP([]);
    }
  }

  @Action
  async getOneGroup(data: any) {
    const res: any = await fetchOneGroup(data.departmentId, data.groupId);
    this.SET_ACTIVE_GROUP(res);
  }

  @Action
  async getOneGroupFromList(id: string) {
    const res: any = this.listGroup.find((item: any) => item.id === id);
    if (res) {
      this.SET_GROUP(res);
      this.SET_ACTIVE_GROUP(res);
    }
  }

  @Action
  async saveGroup(data: IGroup) {
    let res: any;
    if (data.id) {
      res = await updateGroup(data.id, data);
    } else {
      res = await createGroup(data, data.department_id);
    }
    this.SET_GROUP(res);
  }

  @Action
  async createGroup(data: IGroup, departmentId: string) {
    this.SET_LOADING_GROUP(true);
    data.schedule.schedules = data.schedule.schedules.map((el: any) => {
      delete el.start_one;
      delete el.start_two;
      delete el.end_one;
      delete el.end_two;
      return el;
    });
    const res: any = await createGroup(data, departmentId);
    this.SET_GROUP(res);
  }

  @Action
  async updateGroup(id: string, data: IGroup) {
    this.SET_LOADING_GROUP(true);
    data.schedule.schedules = data.schedule.schedules.map((el: any) => {
      delete el.start_one;
      delete el.start_two;
      delete el.end_one;
      delete el.end_two;
      delete el.modul_start;
      delete el.modul_end;
      return el;
    });
    const res: any = await updateGroup(id, data);
    this.SET_GROUP(res);
  }

  @Action
  async deleteGroup(data: IGroup) {
    this.SET_LOADING_GROUP(true);
    const res: any = await deleteGroup(data);
    this.getAllGroup(data.department_id);
  }

  @Action
  changeGroup(id: string) {
    this.SET_SELECTED_GROUP(id);
  }

  @Mutation
  RESET_GROUP_FILTER() {
    this.listGroupFilter = [];
  }

  @Mutation
  private SET_SELECTED_GROUP(id: string) {
    if (id) {
      this.selectedGroup = id;
    } else {
      this.selectedGroup = '';
    }
  }

  @Mutation
  private SET_GROUP(data: IGroup) {
    this.group = data;
    this.isLoadingGroup = false;
  }

  @Mutation
  private SET_ACTIVE_GROUP(data: IGroup) {
    this.activeGroup = data;
    this.isLoadingGroup = false;
  }

  @Mutation
  private SET_LIST_GROUP(res: any) {
    const datas: any = [];
    const dataFilter: any = [];
    if (res && Array.isArray(res)) {
      res.forEach((item: any) => {
        // let newTimeStart: string = '';
        // let newTimeEnd: string = '';
        // let newRestStart: string = '';
        // let newRestEnd: string = '';
        // item.schedule.schedules = item.schedule.schedules.map((el: any) => {
        //   newTimeStart = splitTimeStart(el.start);
        //   newTimeEnd = splitTimeEnd(el.start);
        //   newRestStart = splitTimeStart(el.end);
        //   newRestEnd = splitTimeEnd(el.end);
        //   return (el = {
        //     ...el,
        //     start_one: newTimeStart,
        //     start_two: newTimeEnd,
        //     end_one: newRestStart,
        //     end_two: newRestEnd,
        //   });
        // });
        datas.push(item);
      });
    } else if (res && res.data && Array.isArray(res.data)) {
      res.data.forEach((item: any) => {
        // let newTimeStart: string = '';
        // let newTimeEnd: string = '';
        // let newRestStart: string = '';
        // let newRestEnd: string = '';
        // item.schedule.schedules = item.schedule.schedules.map((el: any) => {
        //   newTimeStart = splitTimeStart(el.start);
        //   newTimeEnd = splitTimeEnd(el.start);
        //   newRestStart = splitTimeStart(el.end);
        //   newRestEnd = splitTimeEnd(el.end);
        //   return (el = {
        //     ...el,
        //     start_one: newTimeStart,
        //     start_two: newTimeEnd,
        //     end_one: newRestStart,
        //     end_two: newRestEnd,
        //   });
        // });
        datas.push(item);
      });
      delete res.data;
      this.pagination = {
        ...res,
      };
    }
    this.listGroup = datas;
    // dataFilter = [{ id: '0', name: 'Tampilkan Semua' }].concat(datas);
    this.listGroupFilter = datas;
    this.isLoadingGroup = false;
  }

  @Mutation
  private SET_LOADING_GROUP(status: boolean) {
    this.isLoadingGroup = status;
  }

  @Mutation
  private SET_PARAMS(params: any) {
    this.params = {
      ...params,
    };
  }
}

export const GroupStore = getModule(Group);
