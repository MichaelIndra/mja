import { getToken } from '@/common/utils/cookies';
import Vue from 'vue';
import Router from 'vue-router';
import {
  isAdmin,
  isBranchHRA,
  isBranchHRP,
  isBranchManager,
  isGeneralHRA,
  isGeneralHRP,
  isGeneralManager,
  isOwner,
} from './common/utils/config';
import { decodeToken } from './common/utils/jwt';
import {
  admin,
  branchManager,
  branchOfficeOne,
  branchOfficeTwo,
  generalManager,
  generalOfficeOne,
  generalOfficeTwo,
  owner,
} from './common/utils/role';
import Branch from './views/admin/Branch.vue';
import Dashboard from './views/admin/Dashboard.vue';
import Log from './views/admin/Log.vue';
import Role from './views/admin/Role.vue';
import User from './views/admin/User.vue';
import ForgotPassword from './views/auth/ForgotPassword.vue';
import Login from './views/auth/Login.vue';
import DashboardBranchHRA from './views/branch/hrAttendance/Dashboard.vue';
import DashboardBranchHRP from './views/branch/hrPayroll/Dashboard.vue';
import DashboardBranchManager from './views/branch/manager/Dashboard.vue';
import Account from './views/common/Account.vue';
import Attendance from './views/common/Attendance.vue';
import EmployeeDetail from './views/common/DetailEmployee.vue';
import Employee from './views/common/Employee.vue';
import Leave from './views/common/Leave.vue';
import DashboardGeneralHRA from './views/general/hrAttendance/Dashboard.vue';
import DashboardGeneralHRP from './views/general/hrPayroll/Dashboard.vue';
import DashboardGeneralManager from './views/general/manager/Dashboard.vue';
import ChoosePayslip from './views/includes/ChoosePayslip.vue';
import Department from './views/includes/Department.vue';
import DetailDepartment from './views/includes/DetailDepartment.vue';
import LoanManagement from './views/includes/loan/LoanManagement.vue';
import NotFound from './views/includes/NotFound.vue';
import PayslipOffice from './views/includes/payslip/PayslipOffice.vue';
import PayslipProduksi from './views/includes/payslip/PayslipProduksi.vue';
import PayslipToko from './views/includes/payslip/PayslipToko.vue';
import PrintPayslip from './views/includes/payslip/PrintPayslip.vue';
import ReportOutcomeDetail from './views/includes/report/DetailReportOutcome.vue';
import ReportOvertimeDetail from './views/includes/report/DetailReportOvertime.vue';
import DetailReportPayslip from './views/includes/report/DetailReportPayslip.vue';
import ReportOutcome from './views/includes/report/ReportOutcome.vue';
import ReportPayslipDeduction from './views/includes/report/ReportPayslipDeduction.vue';
// import ReportAttendance from './views/includes/report/ReportAttendance.vue';
import ReportPayslipOvertime from './views/includes/report/ReportPayslipOvertime.vue';
import Rule from './views/includes/Rule.vue';
import DashboardOwner from './views/owner/Dashboard.vue';

Vue.use(Router);

class RouteMeta {
  title: string;
  requiredAuth?: boolean;
  roles?: any[];
  sidebar?: boolean;

  constructor({
    title,
    requiredAuth,
    roles,
    sidebar,
  }: {
    title: string;
    requiredAuth?: boolean;
    roles?: any[];
    sidebar?: boolean;
  }) {
    this.title = title;
    this.requiredAuth = requiredAuth;
    this.roles = roles;
    this.sidebar = sidebar;
  }
}

export const routes: any[] = [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'dashboard' },
    meta: {
      requiresAuth: true,
      roles: [
        admin,
        owner,
        branchManager,
        branchOfficeOne,
        branchOfficeTwo,
        generalManager,
        generalOfficeOne,
        generalOfficeTwo,
      ],
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: new RouteMeta({
      title: 'dashboard',
      requiredAuth: true,
    }),
  },
  {
    path: '/account-configuration',
    name: 'account-configuration',
    component: Account,
    meta: new RouteMeta({
      title: 'account',
      requiredAuth: true,
    }),
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: new RouteMeta({ title: 'Login' }),
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: new RouteMeta({ title: 'ForgotPassword', requiredAuth: false }),
  },
  /*
   *
   * ROUTE FOR MULTIPLE ROLE
   *
   */
  {
    path: '/not-found',
    name: 'not-found',
    component: NotFound,
    meta: new RouteMeta({
      title: 'NotFoundPage',
      // requiredAuth: true,
      // roles: [
      //   admin,
      //   owner,
      //   branchManager,
      //   branchOfficeOne,
      //   branchOfficeTwo,
      //   generalManager,
      //   generalOfficeOne,
      //   generalOfficeTwo,
      // ],
    }),
  },
  {
    path: '/department',
    name: 'department',
    component: Department,
    meta: new RouteMeta({
      title: 'Department Management',
      sidebar: true,
      requiredAuth: true,
      roles: [
        admin,
        owner,
        branchManager,
        branchOfficeOne,
        branchOfficeTwo,
        generalManager,
        generalOfficeOne,
        generalOfficeTwo,
      ],
    }),
  },
  {
    path: '/log',
    name: 'log',
    component: Log,
    meta: new RouteMeta({
      title: 'Log Management',
      sidebar: true,
      requiredAuth: true,
      roles: [admin, owner],
    }),
  },
  {
    path: '/department/:departmentId/group',
    name: 'group-department',
    component: DetailDepartment,
    meta: new RouteMeta({
      title: 'Group Department Management',
      requiredAuth: true,
      roles: [
        admin,
        owner,
        branchManager,
        branchOfficeOne,
        branchOfficeTwo,
        generalManager,
        generalOfficeOne,
        generalOfficeTwo,
      ],
    }),
  },
  {
    path: '/employee',
    name: 'employee',
    component: Employee,
    meta: new RouteMeta({
      title: 'Employee',
      requiredAuth: true,
      roles: [
        owner,
        branchManager,
        branchOfficeOne,
        branchOfficeTwo,
        generalManager,
        generalOfficeOne,
        generalOfficeTwo,
      ],
    }),
  },
  {
    path: '/employee/:employeeId/detail',
    name: 'employee-detail',
    component: EmployeeDetail,
    meta: new RouteMeta({
      title: 'EmployeeDetail',
      requiredAuth: true,
      roles: [
        owner,
        branchManager,
        branchOfficeOne,
        branchOfficeTwo,
        generalManager,
        generalOfficeOne,
        generalOfficeTwo,
      ],
    }),
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: Attendance,
    meta: new RouteMeta({
      title: 'Attendance',
      requiredAuth: true,
      roles: [
        owner,
        branchOfficeOne,
        branchOfficeTwo,
        generalOfficeOne,
        generalOfficeTwo,
      ],
    }),
  },
  {
    path: '/leave',
    name: 'leave',
    component: Leave,
    meta: new RouteMeta({
      title: 'Leave',
      requiredAuth: true,
      roles: [
        owner,
        branchOfficeOne,
        branchOfficeTwo,
        generalOfficeOne,
        generalOfficeTwo,
      ],
    }),
  },
  {
    path: '/report-attendance',
    name: 'report-attendance',
    component: Attendance,
    meta: new RouteMeta({
      title: 'Attendance',
      requiredAuth: true,
      roles: [owner, generalManager, branchManager],
    }),
  },
  /* {
    path: '/report-attendance-summary',
    name: 'report-attendance-summary',
    component: ReportAttendance,
    meta: new RouteMeta({
      title: 'ReportAttendance',
      requiredAuth: true,
      roles: [generalManager, branchManager],
    }),
  }, */

  {
    path: '/report-leave',
    name: 'report-leave',
    component: Leave,
    meta: new RouteMeta({
      title: 'Leave',
      requiredAuth: true,
      roles: [owner, generalManager, branchManager],
    }),
  },
  {
    path: '/choose-report-payslip-employee',
    name: 'choose-report-payslip',
    component: ChoosePayslip,
    meta: new RouteMeta({
      title: 'Choose Payslip',
      requiredAuth: true,
      roles: [
        owner,
        generalManager,
        branchManager,
        branchOfficeOne,
        generalOfficeOne,
      ],
    }),
  },
  {
    path: '/report-payslip-deduction',
    name: 'report-payslip-deduction',
    component: ReportPayslipDeduction,
    meta: new RouteMeta({
      title: 'Report Payslip',
      requiredAuth: true,
      roles: [
        admin,
        owner,
        generalManager,
        branchManager,
        branchOfficeOne,
        generalOfficeOne,
      ],
    }),
  },
  {
    path: '/report-payslip-overtime',
    name: 'report-payslip-overtime',
    component: ReportPayslipOvertime,
    meta: new RouteMeta({
      title: 'Report Payslip Overtime',
      requiredAuth: true,
      roles: [
        admin,
        owner,
        generalManager,
        branchManager,
        branchOfficeOne,
        generalOfficeOne,
      ],
    }),
  },
  {
    path: '/report-payslip-outcome',
    name: 'report-payslip-outcome',
    component: ReportOutcome,
    meta: new RouteMeta({
      title: 'Report Payslip Outcome',
      requiredAuth: true,
      roles: [
        admin,
        owner,
        generalManager,
        branchManager,
        branchOfficeOne,
        generalOfficeOne,
      ],
    }),
  },
  {
    path: '/report-payslip-outcome/:outcomeId',
    name: 'report-payslip-outcome-detail',
    component: ReportOutcomeDetail,
    meta: new RouteMeta({
      title: 'Report Payslip Outcome Detail',
      requiredAuth: true,
      roles: [
        // admin,
        owner,
        generalManager,
        branchManager,
        branchOfficeOne,
        generalOfficeOne,
      ],
    }),
  },
  {
    path: '/report-payslip-overtime/:overtimeId',
    name: 'report-payslip-overtime-detail',
    component: ReportOvertimeDetail,
    meta: new RouteMeta({
      title: 'Report Payslip overtime Detail',
      requiredAuth: true,
      roles: [
        // admin,
        admin,
        owner,
        generalManager,
        branchManager,
        branchOfficeOne,
        generalOfficeOne,
      ],
    }),
  },
  {
    path: '/loan-management',
    name: 'loan-management',
    component: LoanManagement,
    meta: new RouteMeta({
      title: 'Loan Management',
      requiredAuth: true,
      roles: [
        // admin,
        owner,
        generalManager,
        branchManager,
        branchOfficeOne,
        generalOfficeOne,
      ],
    }),
  },
  {
    path: '/detail-report-payslip/:report_id/:payslip_type/:type',
    name: 'detail-report-payslip',
    component: DetailReportPayslip,
    meta: new RouteMeta({
      title: 'Report Payslip',
      requiredAuth: true,
      roles: [
        admin,
        owner,
        generalManager,
        branchManager,
        branchOfficeOne,
        generalOfficeOne,
      ],
    }),
  },
  // retro
  {
    path:
      '/print-payslip/:departmentId/:dateStart/:dateEnd/:payslipType/:payslipFilter',
    name: 'print-payslip',
    component: PrintPayslip,
    meta: new RouteMeta({
      title: 'PrintPayslip',
      requiredAuth: true,
      roles: [
        owner,
        generalManager,
        branchManager,
        branchOfficeOne,
        generalOfficeOne,
      ],
    }),
  },
  {
    path:
      '/report-payslip-produksi/:departmentId/:dateStart/:dateEnd/:payslipType/:payslipFilter/:totalDayWorks/:totalDays/:totalHolidays/:dataHolidays',
    name: 'report-payslip-produksi',
    component: PayslipProduksi,
    meta: new RouteMeta({
      title: 'PayslipProduksi',
      requiredAuth: true,
      roles: [
        owner,
        generalManager,
        branchManager,
        branchOfficeOne,
        generalOfficeOne,
      ],
    }),
  },
  {
    path:
      '/report-payslip-toko/:departmentId/:dateStart/:dateEnd/:payslipType/:payslipFilter/:totalDayWorks/:totalDays/:totalHolidays/:dataHolidays',
    name: 'report-payslip-toko',
    component: PayslipToko,
    meta: new RouteMeta({
      title: 'PayslipToko',
      requiredAuth: true,
      roles: [
        owner,
        generalManager,
        branchManager,
        branchOfficeOne,
        generalOfficeOne,
      ],
    }),
  },
  {
    path:
      '/report-payslip-kantor/:departmentId/:dateStart/:dateEnd/:payslipType/:payslipFilter/:totalDayWorks/:totalDays/:totalHolidays/:dataHolidays',
    name: 'report-payslip-kantor',
    component: PayslipOffice,
    meta: new RouteMeta({
      title: 'PayslipOffice',
      requiredAuth: true,
      roles: [
        owner,
        generalManager,
        branchManager,
        branchOfficeOne,
        generalOfficeOne,
      ],
    }),
  },
  {
    path: '/rule-payslip',
    name: 'rule',
    component: Rule,
    meta: new RouteMeta({
      title: 'Rule',
      requiredAuth: true,
      roles: [owner, admin, generalOfficeOne, branchOfficeOne],
    }),
  },
  /*
   * ROUTE GENERAL
   * this route include:
   * - general owner
   * - general manager
   * - general human resource attendance
   * - general human resource payroll
   */
  {
    path: '/owner',
    name: 'owner',
    component: DashboardOwner,
    meta: new RouteMeta({
      title: 'DashboardOwner',
      requiredAuth: true,
      roles: [owner],
    }),
  },
  {
    path: '/general',
    name: 'general',
    component: DashboardGeneralManager,
    meta: new RouteMeta({
      title: 'DashboardGeneralManager',
      requiredAuth: true,
      roles: [generalManager],
    }),
  },
  {
    path: '/general-hr-attendance',
    name: 'general-hr-attendance',
    component: DashboardGeneralHRA,
    meta: new RouteMeta({
      title: 'DashboardGeneralHRA',
      requiredAuth: true,
      roles: [generalOfficeTwo],
    }),
  },
  {
    path: '/general-hr-payroll',
    name: 'general-hr-payroll',
    component: DashboardGeneralHRP,
    meta: new RouteMeta({
      title: 'DashboardGeneralHRP',
      requiredAuth: true,
      roles: [generalOfficeOne],
    }),
  },
  /*
   * ROUTE BRANCH
   * this route include:
   * - branch manager
   * - branch human resource attendance
   * - branch human resource payroll
   */
  {
    path: '/branch',
    name: 'branch',
    component: DashboardBranchManager,
    meta: new RouteMeta({
      title: 'DashboardBranchManager',
      requiredAuth: true,
      roles: [branchManager],
    }),
  },
  {
    path: '/branch-hr-attendance',
    name: 'branch-hr-attendance',
    component: DashboardBranchHRA,
    meta: new RouteMeta({
      title: 'DashboardBranchHRA',
      requiredAuth: true,
      roles: [branchOfficeTwo],
    }),
  },
  {
    path: '/branch-hr-payroll',
    name: 'branch-hr-payroll',
    component: DashboardBranchHRP,
    meta: new RouteMeta({
      title: 'DashboardBranchHRP',
      requiredAuth: true,
      roles: [branchOfficeOne],
    }),
  },
  /*
   * ROUTE ADMIN
   *
   * all route about user management, branch management
   */
  {
    path: '/admin',
    name: 'admin',
    component: Dashboard,
    meta: new RouteMeta({
      title: 'Dashboard',
      requiredAuth: true,
      roles: [admin],
    }),
  },
  {
    path: '/user-management',
    name: 'user-management',
    component: User,
    meta: new RouteMeta({
      title: 'User Management',
      sidebar: true,
      requiredAuth: true,
      roles: [admin],
    }),
  },
  {
    path: '/branch-management',
    name: 'branch-management',
    component: Branch,
    meta: new RouteMeta({
      title: 'Branch Management',
      sidebar: true,
      requiredAuth: true,
      roles: [admin],
    }),
  },
  {
    path: '/role-management',
    name: 'role-management',
    component: Role,
    meta: new RouteMeta({
      title: 'Role Management',
      sidebar: true,
      requiredAuth: true,
      roles: [admin],
    }),
  },
];
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// This callback runs before every route change, including on initial load
router.beforeEach((to, from, next) => {
  const routeMeta = to.meta as RouteMeta;
  if (routeMeta.requiredAuth) {
    const authUser: any = getToken();
    const userData = decodeToken(authUser);
    if (authUser) {
      let isHasPermission = false;

      if (routeMeta.roles) {
        routeMeta.roles.forEach((role: any) => {
          const find = (userData as any).roles.find(
            (item: any) => item === role,
          );
          if (find) {
            isHasPermission = true;
          }
        });
        if (isHasPermission) {
          next();
        } else {
          if (isAdmin()) {
            next({ name: 'admin' });
          } else if (isGeneralManager()) {
            next({ name: 'general' });
          } else if (isGeneralHRA()) {
            next({ name: 'general-hr-attendance' });
          } else if (isGeneralHRP()) {
            next({ name: 'general-hr-payroll' });
          } else if (isBranchManager()) {
            next({ name: 'branch' });
          } else if (isBranchHRA()) {
            next({ name: 'branch-hr-attendance' });
          } else if (isBranchHRP()) {
            next({ name: 'branch-hr-payroll' });
          } else if (isOwner()) {
            next({ name: 'owner' });
          }
        }
      } else {
        next();
      }
    } else {
      next({ name: 'login' });
    }
  }
  next();
});

export default router;
