import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

export interface IErrorData {
  status: number | string | null;
  message: string;
  data: object[];
}

export const InitErrorData: IErrorData = {
  status: null,
  message: '',
  data: [],
};

export interface IErrorState {
  errorFetch: boolean;
  errorForm: boolean;
  errorData: IErrorData;
}

@Module({ dynamic: true, store, name: 'ErrorStore' })
class Errors extends VuexModule implements IErrorState {
  errorFetch = false;
  errorForm = false;
  errorData = {
    ...InitErrorData,
  };

  @Action
  setErrorFetch(type: boolean) {
    this.SET_ERROR_FETCH(type);
  }

  @Action
  setErrorForm(type: boolean) {
    this.SET_ERROR_FORM(type);
  }

  @Action
  setErrorData(data: IErrorData) {
    this.SET_ERROR_DATA(data);
  }

  @Action
  clearErrorData() {
    this.CLEAR_ERROR_DATA();
  }

  @Mutation
  private SET_ERROR_FETCH(type: boolean) {
    this.errorFetch = type;
  }

  @Mutation
  private CLEAR_ERROR_DATA() {
    this.errorFetch = false;
    this.errorData = {
      ...InitErrorData,
    };
  }

  @Mutation
  private SET_ERROR_FORM(type: boolean) {
    this.errorForm = type;
  }

  @Mutation
  private SET_ERROR_DATA(data: IErrorData) {
    this.errorData = data;
  }
}

export const ErrorStore = getModule(Errors);
