import { formatPrice } from '@/common/utils/config';
import { PayslipStore } from '@/store/modules/payslip';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';

@Component({
  name: 'DetailReportPayslip',
})
export default class DetailReportPayslip extends Vue {
  headerOvertime: any = [
    { sortable: false, text: 'Tanggal', value: 'time_check_in' },
    { sortable: false, text: 'Gaji', value: 'salary' },
    { sortable: false, text: 'Durasi Lembur', value: 'duration' },
    { sortable: false, text: 'Biaya Lembur', value: 'overtime_cost' },
    { sortable: false, text: 'Total Biaya', value: 'total_salary' },
  ];
  headerDeduction: any = [
    { sortable: false, text: 'Tanggal', value: 'time_check_in' },
    { sortable: false, text: 'Durasi Izin', value: 'total_leave' },
    {
      sortable: false,
      text: 'Potongan Izin',
      value: 'nominal_leave',
    },
    {
      sortable: false,
      text: 'Durasi Terlambat',
      value: 'total_late',
    },
    {
      sortable: false,
      text: 'Potongan Terlambat',
      value: 'nominal_late',
    },
    {
      sortable: false,
      text: 'Total Potongan',
      value: 'total',
    },
  ];
  type: string = '';

  get loadingPayslip() {
    return PayslipStore.loadingPayslip;
  }

  get payslip() {
    return PayslipStore.payslip;
  }

  get detailPayslip() {
    return PayslipStore.detailPayslip;
  }

  get detailPayslipReport() {
    return PayslipStore.detailPayslipReport;
  }

  get totalNominal() {
    return formatPrice(PayslipStore.totalNominal);
  }

  mounted() {
    this.getPayslip();
  }

  formatPrice(data: any) {
    return formatPrice(data);
  }

  async getPayslip() {
    const id: string = this.$route.params.report_id;
    this.type = this.$route.params.type;

    await PayslipStore.setDetailType(this.type);
    await PayslipStore.getOnePayslip(id);
  }
}
