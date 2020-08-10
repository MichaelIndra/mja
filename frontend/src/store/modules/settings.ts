import { InitQuery } from '@/common/interfaces/query';
import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

export interface ISettingsState {
  drawer: boolean;
  mini: boolean;
  pagination: any;
  params: any;
}

@Module({ dynamic: true, store, name: 'SettingsStore' })
class Settings extends VuexModule implements ISettingsState {
  drawer = true;
  mini = false;
  snackbar: any = {
    ...InitSnackbar,
  };
  pagination = {};
  params = JSON.parse(JSON.stringify(InitQuery));

  @Action
  showSnackbar(snackbar: ISnackbar) {
    if (snackbar.color === 'warn') {
      snackbar = {
        ...snackbar,
        color: 'orange darken-1',
      };
    } else if (snackbar.color === 'error') {
      snackbar = {
        ...snackbar,
        color: 'red darken-1',
      };
    } else if (snackbar.color === 'info') {
      snackbar = {
        ...snackbar,
        color: 'blue darken-1',
      };
    } else if (snackbar.color === 'success') {
      snackbar = {
        ...snackbar,
        color: 'green darken-1',
      };
    }
    this.OPEN_SNACKBAR(snackbar);
  }

  @Action
  closeSnackbar() {
    this.CLOSE_SNACKBAR();
  }

  @Action
  changeDrawer(type: any) {
    this.CHANGE_DRAWER(type);
  }

  @Action
  setParamsGlobal(params: any) {
    this.SET_PARAMS_GLOBAL(params);
  }

  @Action
  pushParamsGlobal(filter: any) {
    this.PUSH_PARAMS_GLOBAL(filter);
  }

  @Action
  changeParamsGlobal(data: any) {
    this.CHANGE_PARAMS_GLOBAL(data);
  }

  @Action
  removeParamsField(field: string) {
    this.REMOVE_PARAMS_FIELD_GLOBAL(field);
  }

  @Action
  setPagination(params: any) {
    this.SET_PAGINATION_GLOBAL(params);
  }

  @Mutation
  CLOSE_SNACKBAR() {
    this.snackbar = {
      ...InitSnackbar,
    };
  }

  @Mutation
  OPEN_SNACKBAR(snackbar: ISnackbar) {
    this.snackbar = {
      ...this.snackbar,
      ...snackbar,
    };
  }

  @Mutation
  CHANGE_DRAWER(type: boolean) {
    if (type && !this.mini) {
      this.mini = true;
    } else if (this.mini) {
      this.mini = false;
      this.drawer = false;
    } else {
      this.drawer = true;
      this.mini = false;
    }
  }

  @Mutation
  SET_PARAMS_GLOBAL(params: any) {
    this.params = {
      ...params,
    };
  }

  @Mutation
  REMOVE_PARAMS_FIELD_GLOBAL(field: string) {
    this.params.filters = this.params.filters.filter((el: any) => {
      return el.field !== field;
    });
    // this.params.filters = this.params.filters.filter((el: any) => {
    //   const cacad = field.find((item: any) => item === el.field);
    //   if (el.field !== cacad) {
    //     return el;
    //   }
    // });
  }

  @Mutation
  PUSH_PARAMS_GLOBAL(filter: any) {
    if (this.params.filters) {
      this.params.filters = this.params.filters.concat([filter]);
    } else {
      this.params = {
        ...this.params,
        filters: [],
      };
      this.params.filters = this.params.filters.concat([filter]);
    }
  }

  @Mutation
  CHANGE_PARAMS_GLOBAL(data: any) {
    const arr: any = [];
    this.params.filters.forEach((el: any) => {
      if (data.keyword && el.operator) {
        if (el.operator === data.field) {
          el.value = data.value;
        }
      } else if (data.date) {
        if (el.operator === data.date) {
          el.value = data.value;
        }
      } else {
        if (el.field === data.field) {
          el.value = data.value;
        }
      }
      arr.push(el);
    });
    this.params.filters = arr;
  }

  @Mutation
  SET_PAGINATION_GLOBAL(params: any) {
    if (params.pageCount) {
      this.pagination = {
        length: params.pageCount,
        page: params.page,
        totalVisible: 10,
      };
    } else {
      this.pagination = {
        length: 1,
        page: 1,
        // page: params.page,
        totalVisible: 10,
      };
    }
  }
}

export const SettingsStore = getModule(Settings);
