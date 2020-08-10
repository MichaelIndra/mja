import { AuthModule } from '@/store/modules/auth';
import { PayslipStore } from '@/store/modules/payslip';
import { SettingsStore } from '@/store/modules/settings';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
  name: 'ReportOvertimeDetail',
})
export default class ReportOvertimeDetail extends Vue {
  headers: any = [
    // {
    //   align: 'middle',
    //   sortable: false,
    //   text: 'NIK',
    //   value: 'nik',
    // },
    {
      align: 'middle',
      sortable: false,
      text: 'Name',
      value: 'name',
    },
    {
      align: 'middle',
      sortable: false,
      text: 'Departemen',
      value: 'department',
    },
    {
      align: 'middle',
      sortable: false,
      text: 'Area',
      value: 'area',
    },
    {
      align: 'middle',
      sortable: false,
      text: 'Posisi',
      value: 'position',
    },
    {
      align: 'middle',
      sortable: false,
      text: 'Nominal',
      value: 'pendapatan_gaji',
    },
  ];

  get userRole() {
    return AuthModule.roles[0];
  }

  get employeeOvertime() {
    if (this.userRole === 'owner') {
      return PayslipStore.employeeOvertime;
    } else {
      return PayslipStore.employeeOvertime.filter((el: any) => {
        return !el.from_owner;
      });
    }
  }

  get overtime() {
    return PayslipStore.overtime;
  }

  get loading() {
    return PayslipStore.isOvertimeLoading;
  }

  get params() {
    return SettingsStore.params;
  }

  mounted() {
    this.getDetail();
  }

  async getDetail() {
    const overtimeId: any = this.$route.params.overtimeId;
    await PayslipStore.findDataOvertimeRegular(overtimeId);
    if (this.employeeOvertime.length <= 0) {
      this.$router.push({
        name: 'report-payslip-overtime',
      });
    }
  }

  backToReport() {
    this.getListReport(this.params);
    this.$router.push({ name: 'report-payslip-overtime' });
  }

  getListReport(params: any) {
    PayslipStore.getReportOvertime(params);
  }
}
