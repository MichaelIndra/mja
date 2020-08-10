import { formatDate, formatPrice } from '@/common/utils/config';
import { OutcomeStore } from '@/store/modules/outcome';
import { SettingsStore } from '@/store/modules/settings';
import moment from 'moment';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { InitQuery, InitQueryOutcome } from '../../../common/interfaces/query';
import Filters from '../../../components/includes/Filter.vue';
import Pagination from '../../../components/includes/Pagination.vue';

@Component({
  name: 'ReportOutcome',
  components: {
    Pagination,
    Filters,
  },
})
export default class ReportOutcome extends Vue {
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
      align: 'middle',
      sortable: false,
      text: 'Jumlah Karyawan Periode Ini',
      value: 'employee_count',
    },
    {
      align: 'center',
      sortable: false,
      text: 'Data Pengeluran',
      value: 'actions',
    },
  ];
  filterOption: any = {
    type: 'report_payslip_outcome',
    dataDateStart: 'start_at',
    dataDateEnd: 'end_at',
  };
  filter: boolean = true;
  filterCount: number = 0;
  options: any = {};
  dataFilter: any = {};

  get outcomes() {
    return OutcomeStore.outcomes;
  }

  get loading() {
    return OutcomeStore.isOutcomeLoading;
  }

  get params(): any {
    return SettingsStore.params;
  }

  get totalData(): number {
    return OutcomeStore.totalData;
  }

  get outcomePerDepartment() {
    return OutcomeStore.outcomePerDepartment;
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

  @Watch('options')
  getTableOptions() {
    if (this.outcomes.length > 0) {
      this.getListReport(this.params);
    }
  }

  mounted() {
    const startOfMonth = moment()
      .startOf('month')
      .format('YYYY-MM-DD 00:00:00');
    const endOfMonth = moment()
      .endOf('month')
      .format('YYYY-MM-DD 23:59:59');

    const baseQuery = {
      ...InitQuery,
      filters: [
        {
          field: 'start_at',
          value: 'ASC',
        },
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
          field: 'department',
          value: 'join',
        },
      ],
    };
    this.getListReport(baseQuery);
    const initQuery = {
      filters: [
        {
          field: 'start_at',
          value: 'ASC',
        },
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
      ],
    };
    this.getOutcomePerDepartment(initQuery);
  }

  getOutcomePerDepartment(query: any) {
    OutcomeStore.getOutcomePerDepartment(query);
  }

  getListData(params: any, data: any) {
    if (data === 'outcome') {
      this.getOutcomePerDepartment(params);
    } else {
      this.getOutcomePerDepartment(params);
      this.getListReport(params);
    }
  }

  showDetail(reportId: string) {
    this.$router.push({
      name: 'report-payslip-outcome-detail',
      params: { outcomeId: reportId },
    });
  }

  getListReport(params: any) {
    OutcomeStore.getDataOutcomes(params);
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

  formatPrice(data: string | number) {
    return formatPrice(data);
  }
}
