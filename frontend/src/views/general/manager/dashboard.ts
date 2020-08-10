import BaseDashboard from '@/components/dashboard/user/Dashboard.vue';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ReportAttendance from '../../includes/report/ReportAttendance.vue';

@Component({
  name: 'DashboardGeneralManager',
  components: {
    BaseDashboard,
    ReportAttendance,
  },
})
export default class DashboardGeneralManager extends Vue {}
