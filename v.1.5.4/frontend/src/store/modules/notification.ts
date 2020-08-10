import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

export interface INotifData {
  status: number | string | null;
  message: string;
  data: object[];
}

export const InitNotifData: INotifData = {
  status: null,
  message: '',
  data: [],
};

export interface INotifState {
  notifFetch: boolean;
  notifForm: boolean;
  notifData: INotifData;
}

@Module({ dynamic: true, store, name: 'NotifStore' })
class Notif extends VuexModule implements INotifState {
  notifFetch = false;
  notifForm = false;
  notifData = {
    ...InitNotifData,
  };

  @Action
  setNotifFetch(type: boolean) {
    this.SET_NOTIF_FETCH(type);
  }

  @Action
  setNotifForm(type: boolean) {
    this.SET_NOTIF_FORM(type);
  }

  @Action
  setNotifData(data: INotifData) {
    this.SET_NOTIF_DATA(data);
  }

  @Mutation
  private SET_NOTIF_FETCH(type: boolean) {
    this.notifFetch = type;
  }

  @Mutation
  private SET_NOTIF_FORM(type: boolean) {
    this.notifForm = type;
  }

  @Mutation
  private SET_NOTIF_DATA(data: INotifData) {
    this.notifData = data;
  }
}

export const NotifStore = getModule(Notif);
