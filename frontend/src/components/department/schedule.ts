import { convertDate } from '@/common/utils/config';
import moment from 'moment';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'Schedule',
})
export default class Schedule extends Vue {
  @Prop() readonly schedule: any;
  getTime(breakDuration:number) {
    return moment('2020-01-01 00:00:00').seconds(breakDuration*3600).format('HH:mm');
  }
  convertDate(data: any) {
    return convertDate(data);
  }
}
