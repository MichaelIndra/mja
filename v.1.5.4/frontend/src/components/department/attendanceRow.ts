import { convertDate } from '@/common/utils/config';
import Schedule from '@/components/department/Schedule.vue';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
@Component({
  name: 'AttendanceRow',
  components: { Schedule },
})
export default class AttendanceRow extends Vue {
  @Prop() readonly attendances: any;

  convertDate(data: any) {
    return convertDate(data);
  }
}
