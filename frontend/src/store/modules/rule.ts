import {
  createRule,
  deleteRule,
  fetchOneRule,
  fetchRules,
  updateRule,
} from '@/common/api/rule';
import { InitRule, IRule } from '@/common/interfaces/rule';
import { formatDate } from '@/common/utils/config';
import store from '@/store';
import moment from 'moment';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

export interface IRuleState {
  isLoadingRule: boolean;
  listRule: any[];
  rule?: IRule;
  pagination: any;
  params: any;
}

@Module({ dynamic: true, store, name: 'RuleStore' })
class Rule extends VuexModule implements IRuleState {
  isLoadingRule = false;
  listRule = [];
  rule = {
    ...InitRule,
  };
  pagination = {};
  params = {};

  @Action
  async setInitDataRule() {
    this.SET_LOADING_RULE(true);
    const res: any = {
      ...InitRule,
    };
    this.SET_ROLE(res);
  }

  @Action
  async getAllRule(params: any) {
    this.SET_PARAMS(params);
    this.SET_LOADING_RULE(true);
    const res: any = await fetchRules(params);
    this.SET_LIST_ROLE(res);
  }

  @Action
  async getOneRule(id: string) {
    const res: any = await fetchOneRule(id);
    this.SET_ROLE(res);
  }

  @Action
  async getOneRuleFromList(id: string) {
    const res: any = this.listRule.find((item: any) => item.id === id);
    if (res) {
      this.SET_ROLE(res);
    }
  }

  @Action
  async saveRule(data: IRule) {
    this.SET_LOADING_RULE(true);
    let res: any;
    if (data.id) {
      res = await updateRule(data.id, data);
    } else {
      res = await createRule(data);
    }
    this.SET_ROLE(res);
    this.getAllRule(this.params);
  }

  @Action
  async createRule(data: IRule) {
    this.SET_LOADING_RULE(true);
    const res: any = await createRule(data);
    // this.SET_ROLE(res);
    this.getAllRule(this.params);
  }

  @Action
  async updateRule(id: string, data: IRule) {
    this.SET_LOADING_RULE(true);
    const res: any = await updateRule(id, data);
    this.SET_ROLE(res);
  }

  @Action
  async deleteRule(id: string) {
    this.SET_LOADING_RULE(true);
    const res: any = await deleteRule(id);
    this.getAllRule(this.params);
  }

  @Mutation
  private SET_ROLE(data: IRule) {
    this.rule = data;
    this.isLoadingRule = false;
  }

  @Mutation
  private SET_LIST_ROLE(res: any) {
    const datas: any = [];
    if (res && Array.isArray(res)) {
      res.forEach((item: any) => {
        const newData = {
          ...item,
          created_at: formatDate(item.created_at, 'medium'),
        };
        datas.push(newData);
      });
    } else if (res && res.data && Array.isArray(res.data)) {
      res.data.forEach((item: any) => {
        const newData = {
          ...item,
          created_at: formatDate(item.created_at, 'medium'),
        };
        datas.push(newData);
      });
      delete res.data;
      this.pagination = {
        ...res,
      };
    }
    this.listRule = datas;
    this.isLoadingRule = false;
  }

  @Mutation
  private SET_LOADING_RULE(status: boolean) {
    this.isLoadingRule = status;
  }

  @Mutation
  private SET_PARAMS(params: any) {
    this.params = {
      ...params,
    };
  }
}

export const RuleStore = getModule(Rule);
