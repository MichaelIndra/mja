import { IGroup, InitGroup } from '@/common/interfaces/group';
import { IQuery } from '@/common/interfaces/query';
import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import {
  checkTimeFormat,
  convertDate,
  formatPrice,
  mergeTime,
  openSnackbarNow,
} from '@/common/utils/config';
import DataGroup from '@/components/department/DataGroup.vue';
import { AreaStore } from '@/store/modules/area';
import { GroupStore } from '@/store/modules/group';
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mask } from 'vue-the-mask';
// Main JS (in UMD format)
import VueTimepicker from 'vue2-timepicker';
import 'vue2-timepicker/dist/VueTimepicker.css';
import { validationMixin } from 'vuelidate';
import { Validations } from 'vuelidate-property-decorators';
import { required } from 'vuelidate/lib/validators';
import { IGroupState } from '../../store/modules/group';
@Component({
  mixins: [validationMixin],
  name: 'DepartmentGroup',
  components: {
    DataGroup,
    VueTimepicker,
  },
  directives: {
    mask,
  },
})
export default class DepartmentGroup extends Vue {
  @Prop() readonly departmentId: any;

  // VALIDATION
  @Validations()
  validations = {
    group: {
      name: { required },
      base_salary: { required },
      week_salary: { required },
      day_salary: { required },
      switchable: { required },
      schedule: {
        schedules: {
          $each: {
            value: { required },
            active: { required },
            start_one: { required },
            start_two: { required },
            end_one: { required },
            end_two: { required },
            duration_hours: { required },
            duration_minutes: { required: false },
            flexible_break: { required },
          },
        },
      },
      department_id: { required },
    },
  };
  // DATA
  mask: string = '##:##';
  maskHour: string = '##';

  sameAllSchedule: boolean = false;
  group: any = InitGroup;
  listFlexibleBreak: any = [
    { id: 0, value: false, name: 'Istirahat Sesuai Jadwal' },
    { id: 1, value: true, name: 'Istirahat Fleksibel' },
  ];
  snackbar: ISnackbar = InitSnackbar;
  currency_config: any = {
    decimal: ',',
    thousands: '.',
    prefix: 'Rp',
    precision: 0,
    masked: false,
    allowBlank: false,
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
  };
  valid: boolean = true;
  dialogForm: boolean = false;
  dialogUpdate: boolean = false;
  dialogDelete: boolean = false;
  params: IQuery = {};
  baseGroup: IGroup = {
    name: '',
    base_salary: '',
    week_salary: '',
    day_salary: '',
    schedule: {
      schedules: [],
    },
    department_id: '',

    created_at: null,
    updated_at: null,
  };
  scheduleType: number = 0;
  schedules: object[] = [
    {
      name: 'Jadwal Tetap',
      id: 0,
    },
    {
      name: 'Jadwal Shift',
      id: 1,
    },
  ];
  listHours: any[] = [
    {
      text: '0 Jam',
      value: 0,
    },
    {
      text: '1 Jam',
      value: 1,
    },
    {
      text: '2 Jam',
      value: 2,
    },
    {
      text: '3 Jam',
      value: 3,
    },
    {
      text: '4 Jam',
      value: 4,
    },
    {
      text: '5 Jam',
      value: 5,
    },
    {
      text: '6 Jam',
      value: 6,
    },
    {
      text: '7 Jam',
      value: 7,
    },
    {
      text: '8 Jam',
      value: 8,
    },
    {
      text: '9 Jam',
      value: 9,
    },
    {
      text: '10 Jam',
      value: 10,
    },
    {
      text: '11 Jam',
      value: 11,
    },
    {
      text: '12 Jam',
      value: 12,
    },
  ];
  listMinutes: any[] = [
    {
      text: '0 Menit',
      value: 0,
    },
    {
      text: '5 Menit',
      value: 5,
    },
    {
      text: '10 Menit',
      value: 10,
    },
    {
      text: '15 Menit',
      value: 15,
    },
    {
      text: '20 Menit',
      value: 20,
    },
    {
      text: '25 Menit',
      value: 25,
    },
    {
      text: '30 Menit',
      value: 30,
    },
    {
      text: '35 Menit',
      value: 35,
    },
    {
      text: '40 Menit',
      value: 40,
    },
    {
      text: '45 Menit',
      value: 45,
    },
    {
      text: '50 Menit',
      value: 50,
    },
    {
      text: '55 Menit',
      value: 55,
    },
  ];
  checkData: any = [];

  // METHODS
  // @Watch('sameAllSchedule')
  // changeSameAllSchedule() {
  // }

  @Watch('scheduleType')
  changeScheduleType() {
    if (this.scheduleType === 0) {
      this.group.schedule.schedules = this.group.schedule.schedules.map(
        (el: any) => {
          delete el.duration;
          delete el.duration_hours;
          delete el.duration_minutes;
          return {
            ...el,
            flexible_break: false,
          };
        },
      );
    } else if (this.scheduleType === 1) {
      this.group.schedule.schedules = this.group.schedule.schedules.map(
        (el: any) => {
          let duration_hours = 0;
          let duration_minutes = 0;
          if (el.duration) {
            duration_hours = Math.floor(Number(el.duration));
            duration_minutes =
              (Number(el.duration) - Number(duration_hours)) * 60;
          }
          return {
            ...el,
            duration_hours,
            duration_minutes,
            flexible_break: true,
          };
        },
      );
    }
  }

  setTimeSchedule(index: number) {
    this.group.schedule.schedules = this.group.schedule.schedules.map(
      (el: any) => {
        const limitHour: any = [];
        const limitMin: any = [];
        const startHour: any = el.start_one.split(':')[0];
        const startMinutes: any = el.start_one.split(':')[1];
        if (
          Number(index) === el.value &&
          el.start_one_hour &&
          el.start_one_hour.length === 0
        ) {
          limitHour.push(Number(startHour));
          limitHour.push(23);
          el.start_one_hour.push(limitHour);
        }
        if (
          Number(index) === el.value &&
          el.start_one_min.length === 0 &&
          startMinutes !== 'mm' &&
          typeof startMinutes !== undefined
        ) {
          limitMin.push(Number(startMinutes) + 1);
          limitMin.push(59);
          el.start_one_min.push(limitMin);
        }
        const duration = el.duration_hours + el.duration_minutes / 60;
        return {
          ...el,
          duration,
        };
      },
    );
  }

  setTimeBreak(index: number) {
    this.group.schedule.schedules = this.group.schedule.schedules.map(
      (el: any) => {
        const limitHour: any = [];
        const limitMin: any = [];
        const endHour: any = el.end_one.split(':')[0];
        const endMinutes: any = el.end_one.split(':')[1];
        if (Number(index) === el.value && el.end_one_hour.length === 0) {
          limitHour.push(Number(endHour));
          limitHour.push(23);
          el.end_one_hour.push(limitHour);
        }
        if (
          Number(index) === el.value &&
          el.end_one_min.length === 0 &&
          endMinutes !== 'mm' &&
          typeof endMinutes !== undefined
        ) {
          limitMin.push(Number(endMinutes) + 1);
          limitMin.push(59);
          el.end_one_min.push(limitMin);
        }
        const duration = el.duration_hours + el.duration_minutes / 60;
        return {
          ...el,
          duration,
        };
      },
    );
  }

  @Watch('checkData')
  changeCheckData() {
    if (this.checkData.length > 0) {
      this.group.schedule.schedules = this.group.schedule.schedules.map(
        (el: any) => {
          const find: any = this.checkData.find((item: any) => {
            return el.value === item.index;
          });
          if (find) {
            return {
              ...el,
              error: find.error,
            };
          } else {
            return el;
          }
        },
      );
    }
  }

  mounted() {
    this.getGroupDepartement();
  }

  formatPrice(data: any) {
    return formatPrice(data);
  }

  convertDate(data: any) {
    return convertDate(data);
  }

  closeForm() {
    this.$v.$reset();
    GroupStore.setInitDataGroup();
    this.group = {
      ...this.dataGroup,
    };
    this.$store.commit('SET_LOADING_GROUP', false);
    this.dialogForm = false;
    this.dialogUpdate = false;
  }

  getGroupDepartement() {
    const departmentId = this.$route.params.departmentId;
    // const params = {
    //   ...this.params,
    //   filters: [
    //     {
    //       field: 'name',
    //       value: 'ASC',
    //     },
    //   ],
    // };
    // this.$store.commit('SET_PARAMS', params);
    GroupStore.getAllGroup(departmentId);
  }

  changeSelectedGroup(groupId: string) {
    const departmentId: any = this.$route.params.departmentId;
    AreaStore.getAllArea(departmentId);
    GroupStore.changeGroup(groupId);
    GroupStore.getOneGroupFromList(groupId);
  }

  showForm(groupId: string | null = null) {
    if (groupId) {
      GroupStore.getOneGroupFromList(groupId);
      this.group = {
        ...this.dataGroup,
      };
      this.group.schedule.schedules = this.group.schedule.schedules.map(
        (el: any) => {
          let duration_hours = 0;
          let duration_minutes = 0;
          if (el.duration) {
            duration_hours = Math.floor(Number(el.duration));
            duration_minutes =
              (Number(el.duration) - Number(duration_hours)) * 60;
          }
          return {
            ...el,
            duration_hours,
            duration_minutes,
          };
        },
      );
    } else {
      GroupStore.setInitDataGroup();
      this.group = {
        ...this.dataGroup,
      };
    }
    this.dialogForm = true;
  }

  async save() {
    if (this.group.base_salary === '' || this.group.name === '') {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message:
          'Ada form yang belum anda isi, silahkan cek kembali inputan anda',
        color: 'warn',
      };
      openSnackbarNow(snackbar);
    } else {
      const data = this.group.schedule.schedules;
      for (const item in data) {
        if (data.hasOwnProperty(item)) {
          if (data[item].flexible_break) {
            if (
              isNaN(checkTimeFormat(data[item].start_one)) ||
              isNaN(checkTimeFormat(data[item].start_two)) ||
              data[item].start_one === '' ||
              data[item].start_two === ''
            ) {
              this.checkData.push({
                index: data[item].value,
                error: true,
              });
            }
          } else {
            if (
              // isNaN(checkTimeFormat(data[item].start_one)) ||
              // isNaN(checkTimeFormat(data[item].start_two)) ||
              // isNaN(checkTimeFormat(data[item].end_one)) ||
              // isNaN(checkTimeFormat(data[item].end_two)) ||
              data[item].start_one === '' ||
              data[item].start_two === '' ||
              data[item].end_one === '' ||
              data[item].end_two === ''
            ) {
              this.group.schedule.schedules[item] = {
                ...data[item],
                error: true,
              };
              this.checkData.push({
                index: data[item].value,
                error: true,
              });
            }
          }
        }
      }
      if (this.checkData.length > 0) {
        const snackbar = {
          ...this.snackbar,
          value: true,
          message:
            'Ada form yang belum anda isi, silahkan cek kembali inputan anda',
          color: 'warn',
        };
        openSnackbarNow(snackbar);
      } else {
        const departmentId: string = this.$route.params.departmentId;
        this.group.schedule.schedules = await this.group.schedule.schedules.map(
          (el: any) => {
            if (el.flexible_break) {
              el.duration =
                Number(el.duration_hours) + Number(el.duration_minutes) / 60;
              return {
                ...el,
                start: mergeTime(el.start_one, el.start_two),
                end: null,
              };
            } else {
              return {
                ...el,
                start: mergeTime(el.start_one, el.start_two),
                end: mergeTime(el.end_one, el.end_two),
              };
            }
          },
        );
        const group = {
          ...this.group,
          schedule: {
            ...this.group.schedule,
          },
          day_salary: '0',
          week_salary: '0',
          department_id: departmentId,
        };
        this.$v.$reset();
        this.dialogForm = false;
        await GroupStore.saveGroup(group);
        this.getGroupDepartement();
      }
    }
  }

  showConfirmDelete(id: string) {
    GroupStore.getOneGroupFromList(id);
    this.group = {
      ...this.dataGroup,
    };
    this.dialogDelete = true;
  }

  deleteData() {
    if (this.activeGroup.id) {
      GroupStore.deleteGroup(this.activeGroup);
    }
    this.$store.commit('SET_GROUP', this.baseGroup);
    this.dialogDelete = false;
  }

  // GETTERS
  get selectedGroup(): string {
    return GroupStore.selectedGroup;
  }

  get listGroup(): IGroupState[] {
    return GroupStore.listGroup;
  }

  get dataGroup() {
    return GroupStore.group;
  }

  get activeGroup() {
    return GroupStore.activeGroup;
  }
}
