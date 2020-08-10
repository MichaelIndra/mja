import BaseDashboard from '@/components/dashboard/user/Dashboard.vue';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
  name: 'DashboardGeneralHRA',
  components: {
    BaseDashboard,
  },
})
export default class DashboardGeneralHRA extends Vue {}
