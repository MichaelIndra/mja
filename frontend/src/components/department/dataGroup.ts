import { convertDate, formatPrice } from '@/common/utils/config';
import { AuthModule } from '@/store/modules/auth';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'DataGroup',
})
export default class DataGroup extends Vue {
  @Prop() readonly activeGroup: any;

  get userRole(): any {
    return AuthModule.roles;
  }

  // METHODS
  formatPrice(data: any) {
    return formatPrice(data);
  }

  convertDate(data: any) {
    return convertDate(data);
  }
}
