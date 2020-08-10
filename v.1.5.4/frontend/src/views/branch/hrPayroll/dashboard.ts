import BaseDashboard from '@/components/dashboard/user/Dashboard.vue';
import { EmployeeStore } from '@/store/modules/employee';
import { PayslipStore } from '@/store/modules/payslip';
import moment from 'moment';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
  name: 'DashboardBranchHRP',
  components: {
    BaseDashboard,
  },
})
export default class DashboardBranchHRP extends Vue {}
