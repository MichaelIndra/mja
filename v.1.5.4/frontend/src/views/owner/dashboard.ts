import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import BaseDashboard from '../../components/dashboard/user/Dashboard.vue';

@Component({
  name: 'DashboardOwner',
  components: {
    BaseDashboard,
  },
})
export default class DashboardOwner extends Vue {}
