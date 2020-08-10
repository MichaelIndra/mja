import { AuthModule } from '@/store/modules/auth';
import { OutcomeStore } from '@/store/modules/outcome';
import { SettingsStore } from '@/store/modules/settings';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
  name: 'ReportOutcomeDetail',
})
export default class ReportOutcomeDetail extends Vue {
  headers: any = [
    {
      align: 'middle',
      sortable: false,
      text: 'NIK',
      value: 'nik',
    },
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
      text: 'Golongan',
      value: 'group',
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
  headersOwner: any = [
    {
      align: 'middle',
      sortable: false,
      text: 'NIK',
      value: 'nik',
    },
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
      text: 'Golongan',
      value: 'group',
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
    {
      align: 'middle',
      sortable: false,
      text: 'Jenis Pengeluaran',
      value: 'dari_owner',
    },
  ];

  get userRole() {
    return AuthModule.roles[0];
  }

  get employeeOutcome() {
    if (this.userRole === 'owner') {
      return OutcomeStore.employeeOutcome;
    } else {
      return OutcomeStore.employeeOutcome.filter((el: any) => {
        return !el.from_owner;
      });
    }
  }

  get outcome() {
    return OutcomeStore.outcome;
  }

  get loading() {
    return OutcomeStore.isOutcomeLoading;
  }

  get params() {
    return SettingsStore.params;
  }

  mounted() {
    this.getDetail();
  }

  async getDetail() {
    const outcomeId: any = this.$route.params.outcomeId;
    if (this.userRole === 'owner') {
      OutcomeStore.findDataOutcome(outcomeId);
    } else {
      await OutcomeStore.findDataOutcomeRegular(outcomeId);
      if (this.employeeOutcome.length <= 0) {
        this.$router.push({
          name: 'report-payslip-outcome',
        });
      }
    }
  }

  backToReport() {
    this.getListReport(this.params);
    this.$router.push({ name: 'report-payslip-outcome' });
  }

  getListReport(params: any) {
    OutcomeStore.getDataOutcomes(params);
  }
}
