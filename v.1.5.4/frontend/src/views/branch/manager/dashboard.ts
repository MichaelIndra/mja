import BaseDashboard from '@/components/dashboard/user/Dashboard.vue';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
  name: 'DashboardBranchManager',
  components: {
    BaseDashboard,
  },
})
export default class DashboardBranchManager extends Vue {}
