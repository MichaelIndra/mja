import { switchGroup } from '@/common/api/employee';
import { fetchLogs } from '@/common/api/log';
import { openSnackbarNow } from '@/common/utils/config';
import moment from 'moment';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';

@Component({
  name: 'SwitchGroup',
})
export default class SwitchGroup extends Vue {
  isLoading: boolean = false;
  dialogDetailLog: boolean = false;
  dialogConfirmSwitch: boolean = false;
  latestLog: any = {};
  headers: any[] = [
    {
      align: 'left',
      sortable: false,
      text: 'Nama Karyawan',
      value: 'name',
    },
    {
      align: 'left',
      sortable: false,
      text: 'Departemen',
      value: 'switch_to_group.department.name',
    },
    {
      align: 'left',
      sortable: false,
      text: 'Perubahan',
      value: 'group_name',
    },
  ];

  mounted() {
    this.getLog();
  }

  async getLog() {
    try {
      const params = {
        filters: [
          {
            field: 'entity',
            operator: 'eq',
            value: 'employees'
          },
          {
            field: 'action',
            operator: 'eq',
            value: 'SWITCH_GROUP'
          },
        ],
        page: 1,
        per_page: 1,
        sort: 'created_at,DESC'
      };
      const res: any = await fetchLogs(params);
      if (res.data.length > 0) {
        this.latestLog = {
          ...res.data[0],
          created_at_text: moment(res.data[0].created_at).locale('id').format('DD MMMM YYYY HH:mm'),
        };
      } else {
        this.latestLog = {};
      }
    } catch (err) {
      console.info(err);
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'error',
        message: 'Terjadi kesalahan',
      });
      this.isLoading = false;
    }
  }

  async switchGroup() {
    try {
      this.isLoading = true;
      await switchGroup();
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'success',
        message: 'Pergantian golongan otomatis berhasil',
      });
      this.getLog();
      this.isLoading = false;
      this.dialogConfirmSwitch = false;
    } catch (err) {
      console.info(err);
      openSnackbarNow({
        value: true,
        timeout: 6000,
        color: 'error',
        message: 'Terjadi kesalahan',
      });
      this.isLoading = false;
      this.dialogConfirmSwitch = false;
    }
  }

  isDisabled() {
    const diffDay = moment(this.latestLog.created_at).diff(moment.now(), 'days');
    // return this.isLoading || diffDay === 0;
    return this.isLoading;
  }

  showDateInText(date: any) {
    return moment(date).locale('id').fromNow();
  }
}
