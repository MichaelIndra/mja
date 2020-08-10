import { InitQuery, InitQueryPayslip } from '@/common/interfaces/query';
import {
  convertSecondToTimeRound,
  formatDate,
  formatPrice,
} from '@/common/utils/config';
import { calculateWorkingDays } from '@/common/utils/timeCalculation';
import { PayslipStore } from '@/store/modules/payslip';
import { SettingsStore } from '@/store/modules/settings';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import Filters from '../../../components/includes/Filter.vue';
import Pagination from '../../../components/includes/Pagination.vue';

@Component({
  name: 'ReportPayslipDeduction',
  components: {
    Pagination,
    Filters,
  },
})
export default class ReportPayslipDeduction extends Vue {
  headers: any[] = [
    {
      align: 'middle',
      sortable: false,
      text: 'NIK',
      value: 'employee_meta.nik',
    },
    {
      align: 'middle',
      sortable: false,
      text: 'Nama Karyawan',
      value: 'employee_meta.name',
    },
    {
      align: 'middle',
      sortable: false,
      text: 'Departemen',
      value: 'employee_meta.department.name',
    },
    {
      align: 'center',
      sortable: false,
      text: 'Periode Payslip',
      value: 'periode',
    },
    {
      align: 'center',
      sortable: false,
      text: 'Total Izin',
      value: 'total_leave',
    },
    {
      align: 'center',
      sortable: false,
      text: 'Total Potongan Izin',
      value: 'nominal_leave',
    },
    {
      align: 'center',
      sortable: false,
      text: 'Total Terlambat',
      value: 'total_late',
    },
    {
      align: 'center',
      sortable: false,
      text: 'Total Potongan Terlambat',
      value: 'nominal_late',
    },
    {
      align: 'center',
      sortable: false,
      text: 'Total Potongan',
      value: 'total',
    },
    { align: 'center', sortable: false, text: 'Pilihan', value: 'actions' },
  ];
  filterOption: any = {
    type: 'report_payslip_deductions',
    dataDateStart: 'start_at',
    dataDateEnd: 'end_at',
  };
  filter: boolean = true;
  filterCount: number = 0;
  options: any = {};

  get isLoading(): boolean {
    return PayslipStore.isLoading;
  }
  get params(): any {
    return SettingsStore.params;
  }
  get totalData(): number {
    return PayslipStore.totalData;
  }

  get listPayslipReportLeaveAndLate(): any {
    return PayslipStore.listPayslipReportLeave.map((el: any) => {
      let find: any = {};
      const payslip_type: any = el.employee_meta.department.meta.payslip_type;
      const payslip_filter: any =
        el.employee_meta.department.meta.payslip_filter;
      // calculateWorkingDays
      let total_late = 0;
      let nominal_late = 0;

      let total_leave = 0;
      let nominal_leave = 0;
      let total = 0;

      // late report
      if (
        el.payslip_meta.employee_deductions &&
        el.payslip_meta.employee_deductions.length > 0
      ) {
        el.payslip_meta.employee_deductions.forEach((data: any) => {
          let late_deduction = { result: 0, leftover: 0 };
          let leave_deduction = { result: 0, leftover: 0 };
          let late_duration = 0;
          let leave_duration = 0;

          if (data.type === 'late') {
            // late
            late_deduction = calculateWorkingDays(data.total_late, 1800);
            late_duration = late_deduction.result;
            if (payslip_type === '2' && payslip_filter === 2) {
              // potongan terlambat toko bulanan
              if (
                late_deduction.leftover > 0 &&
                late_deduction.leftover < 1800
              ) {
                late_duration += late_deduction.leftover;
              }
            } else if (payslip_type === '1' && payslip_filter === 1) {
              // potongan terlambat produksi
              if (
                late_deduction.leftover > 0 &&
                late_deduction.leftover < 1800
              ) {
                late_duration += 1800;
              } else if (late_deduction.leftover >= 1800) {
                late_duration += 3600;
              }
            } else if (payslip_type === '2' && payslip_filter === 1) {
              // potongan terlambat mingguan
              if (
                late_deduction.leftover > 0 &&
                late_deduction.leftover < 1800
              ) {
                late_duration += late_deduction.leftover;
              } else if (late_deduction.leftover >= 1800) {
                late_duration += 3600;
              }
            }
          }

          if (data.type === 'leave') {
            // leave
            leave_deduction = calculateWorkingDays(data.total_leave, 1800);
            leave_duration = leave_deduction.result;
            if (
              leave_deduction.leftover > 0 &&
              leave_deduction.leftover < 1800
            ) {
              leave_duration += 1800;
            } else if (leave_deduction.leftover >= 1800) {
              leave_duration += 3600;
            }
          }

          if (data.type === 'both') {
            total_late += late_duration;
            nominal_late += data.cost;
            total_leave += leave_duration;
            nominal_leave += data.cost;
          } else if (data.type === 'late') {
            total_late += late_duration;
            nominal_late += data.cost;
          } else if (data.type === 'leave') {
            total_leave += leave_duration;
            nominal_leave += data.cost;
          }
          total += data.cost;
        });
      }
      if (payslip_type === '1' || payslip_type === '2') {
        find = {
          ...el,
          total_late: convertSecondToTimeRound(total_late),
          nominal_late: formatPrice(nominal_late),
          total_leave: convertSecondToTimeRound(total_leave),
          nominal_leave: formatPrice(nominal_leave),
          total: formatPrice(total),
          periode: `${formatDate(el.start_at, 'medium')} - ${formatDate(
            el.end_at,
            'medium',
          )}`,
          created_at: formatDate(el.created_at, 'long'),
        };
      } else if (payslip_type === '3') {
        find = {
          ...el,
          total_late:
            el.payslip_meta.attendance_calculation.durasi_terlambat + ' menit',
          nominal_late: formatPrice(
            el.payslip_meta.deductions.potongan_terlambat,
          ),
          total_leave:
            el.payslip_meta.deductions.jumlah_potongan_hari +
            ' hari ' +
            el.payslip_meta.deductions.jumlah_potongan_izin +
            ' jam',
          nominal_leave: formatPrice(
            el.payslip_meta.deductions.potongan_hari_kerja,
          ),
          total: formatPrice(
            el.payslip_meta.deductions.potongan_terlambat +
              el.payslip_meta.deductions.potongan_hari_kerja,
          ),
          periode: `${formatDate(el.start_at, 'medium')} - ${formatDate(
            el.end_at,
            'medium',
          )}`,
          created_at: formatDate(el.created_at, 'long'),
        };
      } else {
        return el;
      }
      return find;
    });
  }

  @Watch('options')
  getTableOptions() {
    this.getListReport(this.params);
  }

  mounted() {
    this.getListReport(InitQueryPayslip);
  }

  getListData(params: any) {
    this.getListReport(params);
  }

  getDeductionDuration(totalLateDuration: number) {
    if (totalLateDuration > 0) {
      let hour = 0;
      let lateDuration = totalLateDuration;
      while (lateDuration >= 60) {
        hour++;
        lateDuration -= 60;
      }
      return '' + hour + ' Jam ' + lateDuration + ' menit';
    } else {
      return '';
    }
  }

  getListReport(params: any) {
    PayslipStore.getPayslipReport(params);
  }

  showFilter() {
    this.filter = !this.filter;
  }

  checkFilter(data: any) {
    if (data.value) {
      this.filterCount += 1;
    } else {
      this.filterCount -= 1;
    }
  }

  showDetail(id: string, payslip_type: any) {
    this.$router.push({
      name: 'detail-report-payslip',
      params: { report_id: id, payslip_type, type: 'deduction' },
    });
  }
}
