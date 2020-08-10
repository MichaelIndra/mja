import { InitQuery, InitQueryOvertime } from '@/common/interfaces/query';
import {
  convertSecondToTimeRound,
  formatDate,
  formatPrice,
  formatPricePayslip,
} from '@/common/utils/config';
import { calculateWorkingDays } from '@/common/utils/timeCalculation';
import { DepartmentStore } from '@/store/modules/department';
import { PayslipStore } from '@/store/modules/payslip';
import { SettingsStore } from '@/store/modules/settings';
import moment from 'moment';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import Filters from '../../../components/includes/Filter.vue';
import Pagination from '../../../components/includes/Pagination.vue';

@Component({
  name: 'ReportPayslipOvertime',
  components: {
    Pagination,
    Filters,
  },
})
export default class ReportPayslipOvertime extends Vue {
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
      text: 'Periode',
      value: 'periode',
    },
    {
      align: 'center',
      sortable: false,
      text: 'Upah',
      value: 'salary',
    },
    {
      align: 'center',
      sortable: false,
      text: 'Total Jam Lembur',
      value: 'overtime_duration',
    },
    {
      align: 'center',
      sortable: false,
      text: 'Biaya Lembur',
      value: 'overtime_value',
    },
    {
      align: 'center',
      sortable: false,
      text: 'Total Biaya',
      value: 'total',
    },
    { align: 'center', sortable: false, text: 'Pilihan', value: 'actions' },
  ];
  filterOption: any = {
    type: 'report_payslip_overtime',
    dataDateStart: 'start_at',
    dataDateEnd: 'end_at',
  };
  filter: boolean = true;
  filterCount: number = 0;
  options: any = {};
  overtimeReportList: any;
  dataFilter: any = {};

  get isLoading(): boolean {
    return PayslipStore.isLoading;
  }
  get totalData(): number {
    return PayslipStore.totalData;
  }
  get departmentList(): any {
    if (this.listOvertimeReport.length > 0) {
      return DepartmentStore.listDepartment.map((el: any) => {
        const findName = this.listOvertimeReport.find(
          (item: any) => item.department_id === el.id,
        );
        if (findName) {
          return {
            ...el,
            overtime_total: findName.overtime_total,
          };
        } else {
          return el;
        }
      });
    } else {
      return DepartmentStore.listDepartment;
    }
  }
  get listOvertimeReport(): any {
    return PayslipStore.listOvertimeReport;
  }
  get params(): any {
    return SettingsStore.params;
  }

  get listPayslipReportOvertime(): any {
    return PayslipStore.listPayslipReportOvertime.map((el: any) => {
      let find: any = {};
      const payslip_type: any = el.employee_meta.department.meta.payslip_type;
      const payslip_filter: any =
        el.employee_meta.department.meta.payslip_filter;
      let total = 0;
      let overtime_duration = 0;
      let overtime_value = 0;
      let salary = 0;

      // overtime report
      if (payslip_type === '1') {
        el.payslip_meta.employee_overtimes.forEach((data: any) => {
          let overtime = { result: 0, leftover: 0 };
          overtime = calculateWorkingDays(
            data.total_overtime + data.total_overtime_early,
            1800,
          );
          overtime_duration += overtime.result;
          if (overtime.leftover > 0 && overtime.leftover < 1800) {
            overtime_duration += 1800;
          } else if (overtime.leftover >= 1800) {
            overtime_duration += 3600;
          }
          overtime_value += data.overtime_cost;
          salary = data.salary;
          total = data.salary + overtime_value;
        });

        find = {
          ...el,
          overtime_duration: convertSecondToTimeRound(overtime_duration),
          overtime_value: formatPrice(overtime_value),
          salary: formatPrice(salary),
          total: formatPrice(total),
          periode: `${formatDate(el.start_at, 'medium')} - ${formatDate(
            el.end_at,
            'medium',
          )}`,
          created_at: formatDate(el.created_at, 'long'),
        };
      } else {
        return (find = {
          ...el,
        });
      }
      return find;
    });
  }

  @Watch('options')
  getTableOptions() {
    this.getListReport(this.params);
  }

  @Watch('params')
  changeFilter() {
    this.params.filters.forEach((el: any) => {
      if (el.field === 'end_at') {
        this.dataFilter = {
          ...this.dataFilter,
          end_at: formatDate(el.value.substring(0, 10), 'long'),
        };
      }
      if (el.field === 'start_at') {
        this.dataFilter = {
          ...this.dataFilter,
          start_at: formatDate(el.value.substring(0, 10), 'long'),
        };
      }
    });
  }

  mounted() {
    const initQuery = InitQueryOvertime;
    const find = initQuery.filters.find((el: any) => {
      return el.field === 'start_at' || el.field === 'end_at';
    });
    if (!find) {
      const startOfMonth = moment()
        .startOf('month')
        .locale('id')
        .format('YYYY-MM-DD');
      const endOfMonth = moment()
        .endOf('month')
        .locale('id')
        .format('YYYY-MM-DD');
      initQuery.filters.push(
        {
          field: 'start_at',
          operator: 'gte',
          value: startOfMonth + ' 00:00:00',
        },
        {
          field: 'end_at',
          operator: 'lte',
          value: endOfMonth + ' 23:59:59',
        },
      );
    }
    this.getListReport({ ...initQuery });
    DepartmentStore.getAllDepartment('');
  }

  formatPrice(value: number) {
    return formatPrice(value);
  }
  getOvertimeValue(departmentId: string) {
    return this.overtimeReportList.find(
      (el: any) => el.department_id === departmentId,
    ).overtime_total;
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
    PayslipStore.getPayslipReportOvertime(params);
  }
  getListData(params: any) {
    this.getListReport(params);
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
      params: { report_id: id, payslip_type, type: 'overtime' },
    });
  }
}
