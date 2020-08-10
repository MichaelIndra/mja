import { formatDate, formatPricePayslip } from '@/common/utils/config';
import { AuthModule } from '@/store/modules/auth';
import { PayslipStore } from '@/store/modules/payslip';
import angkaTerbilang from '@develoka/angka-terbilang-js';
import moment from 'moment';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
@Component({
  name: 'OfficeMonthly',
})
export default class OfficeMonthly extends Vue {
  @Prop() readonly data: any;

  get listPayslip() {
    return PayslipStore.listPayslip;
  }

  get dateNow(): any {
    return new Date();
  }

  get userRole(): any {
    return AuthModule.roles;
  }

  get userFullName(): string {
    return AuthModule.name;
  }

  angkaTerbilang(data: any) {
    return angkaTerbilang(data);
  }

  convertPeriodDate(date: string) {
    return formatDate(date, 'long');
  }

  getMonthOnly(date: any) {
    return moment(date)
      .locale('id')
      .format('MMMM YYYY');
  }

  convertDate(date: string, type: string) {
    return formatDate(date, type);
  }

  formatPrice(value: number) {
    return formatPricePayslip(value);
  }

  formatDate(data: any, type: string): any {
    return formatDate(data, type);
  }
}
