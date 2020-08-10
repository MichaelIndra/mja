import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import BaseDashboard from '../../components/dashboard/user/Dashboard.vue';

@Component({
  name: 'DashboardAdmin',
  components: {
    BaseDashboard,
  },
})
export default class DashboardAdmin extends Vue {}
