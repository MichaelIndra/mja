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
      text: 'Departemen',
      value: 'department.name',
    },
    {
      align: 'middle',
      sortable: false,
      text: 'Periode Mulai',
      value: 'start_at',
    },
    {
      align: 'middle',
      sortable: false,
      text: 'Periode Selesai',
      value: 'end_at',
    },
    {
      align: 'middle',
      sortable: false,
      text: 'Nominal Per Periode',
      value: 'nominal_per_period',
    },
    {
      align: 'center',
      sortable: false,
      text: 'Data Pengeluaran',
      value: 'actions',
    },
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

  get loading(): boolean {
    return PayslipStore.isLoading;
  }

  get totalData(): number {
    return PayslipStore.totalData;
  }

  get overtimePerDepartment() {
    return PayslipStore.overtimePerDepartment;
  }

  get params(): any {
    return SettingsStore.params;
  }

  get overtimes(): any {
    return PayslipStore.overtimes;
  }

  @Watch('params')
  changeFilter() {
    const startOfMonth = moment()
      .startOf('month')
      .subtract(7, 'days')
      .format('YYYY-MM-DD');
    const endOfMonth = moment()
      .endOf('month')
      .add(7, 'days')
      .format('YYYY-MM-DD');

    const rawStartAt = this.params.filters.find(
      (el: any) => el.field === 'start_at',
    );
    const rawEndAt = this.params.filters.find(
      (el: any) => el.field === 'end_at',
    );

    let startAt = moment(rawStartAt.value).format('YYYY-MM-DD 00:00:00');
    let endAt = moment(rawEndAt.value).format('YYYY-MM-DD 23:59:59');

    // check if start_at is first day of this month and end_at is last day of this month
    if (moment(rawStartAt.value).format('YYYY-MM-DD') === startOfMonth) {
      startAt = moment(rawStartAt.value)
        .add(7, 'days')
        .format('YYYY-MM-DD 00:00:00');
    }
    if (moment(rawEndAt.value).format('YYYY-MM-DD') === endOfMonth) {
      endAt = moment(rawEndAt.value)
        .subtract(7, 'days')
        .format('YYYY-MM-DD 00:00:00');
    }

    this.params.filters.forEach((el: any) => {
      if (el.field === 'end_at') {
        this.dataFilter = {
          ...this.dataFilter,
          end_at: formatDate(endAt.substring(0, 10), 'long'),
        };
      }
      if (el.field === 'start_at') {
        this.dataFilter = {
          ...this.dataFilter,
          start_at: formatDate(startAt.substring(0, 10), 'long'),
        };
      }
    });
  }

  @Watch('options')
  getTableOptions() {
    if (this.overtimes.length > 0) {
      this.getListReport(this.params);
    }
  }

  mounted() {
    const startOfMonth = moment()
      // .subtract(1, 'month')
      .startOf('month')
      .subtract(7, 'days')
      .format('YYYY-MM-DD 00:00:00');
    const endOfMonth = moment()
      // .subtract(1, 'month')
      .endOf('month')
      .add(7, 'days')
      .format('YYYY-MM-DD 23:59:59');
    // init for first day and last day of this month
    const baseQuery = {
      // ...InitQuery,
      filters: [
        {
          field: 'start_at',
          operator: 'gte',
          value: startOfMonth,
        },
        {
          field: 'end_at',
          operator: 'lte',
          value: endOfMonth,
        },
        {
          field: 'start',
          operator: 'gte',
          value: moment()
            // .subtract(1, 'month')
            .startOf('month')
            .format('YYYY-MM-DD 00:00:00'),
        },
        {
          field: 'end',
          operator: 'lte',
          value: moment()
            // .subtract(1, 'month')
            .endOf('month')
            .format('YYYY-MM-DD 23:59:59'),
        },
      ],
    };
    this.getListReport(baseQuery);
  }

  formatPrice(value: number) {
    return formatPrice(value);
  }

  getListReport(params: any) {
    PayslipStore.getReportOvertime(params);
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

  showDetail(reportId: string) {
    this.$router.push({
      name: 'report-payslip-overtime-detail',
      params: { overtimeId: reportId },
    });
  }
}
