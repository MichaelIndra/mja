import Vue from 'vue';
import Vuex from 'vuex';
import { IAreaState } from './modules/area';
import { IAuthState } from './modules/auth';
import { IBranchState } from './modules/branch';
import { IErrorState } from './modules/catchError';
import { IDepartmentState } from './modules/department';
import { IEmployeeState } from './modules/employee';
import { IGroupState } from './modules/group';
import { ILoanState } from './modules/loan';
import { INotifState } from './modules/notification';
import { IOutcomeState } from './modules/outcome';
import { IPayslipState } from './modules/payslip';
import { IPositionState } from './modules/position';
import { IReportState } from './modules/report';
import { IRoleState } from './modules/role';
import { ISettingsState } from './modules/settings';
import { IUserState } from './modules/user';

Vue.use(Vuex);

export interface IRootState {
  auth: IAuthState;
  user: IUserState;
  employee: IEmployeeState;
  department: IDepartmentState;
  group: IGroupState;
  role: IRoleState;
  settings: ISettingsState;
  errors: IErrorState;
  notif: INotifState;
  area: IAreaState;
  position: IPositionState;
  branch: IBranchState;
  payslip: IPayslipState;
  report: IReportState;
  loan: ILoanState;
  outcome: IOutcomeState;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({});
