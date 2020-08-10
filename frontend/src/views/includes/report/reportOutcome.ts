import { formatDate, formatPrice } from '@/common/utils/config';
import { AuthModule } from '@/store/modules/auth';
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
    // {
    //   align: 'middle',
    //   sortable: false,
    //   text: 'Jumlah Karyawan Periode Ini',
    //   value: 'employee_count',
    // },
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

  get user() {
    return AuthModule.roles;
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
    if (this.outcomes.length > 0) {
      this.getListReport(this.params);
    }
  }

  mounted() {
    const startOfMonth = moment()
      .startOf('month')
      .subtract(7, 'days')
      .format('YYYY-MM-DD 00:00:00');
    const endOfMonth = moment()
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
            .startOf('month')
            .format('YYYY-MM-DD 00:00:00'),
        },
        {
          field: 'end',
          operator: 'lte',
          value: moment()
            .endOf('month')
            .format('YYYY-MM-DD 23:59:59'),
        },
      ],
    };
    this.getListReport(baseQuery);
  }

  getOutcomePerDepartment(query: any) {
    // OutcomeStore.getOutcomePerDepartment(query);
  }

  getListData(params: any, data: any) {
    if (data === 'outcome') {
      this.getOutcomePerDepartment(params);
    } else {
      this.getOutcomePerDepartment(params);

      // const startOfMonth = moment()
      //   .startOf('month')
      //   .subtract(0, 'month')
      //   .format('YYYY-MM-DD 00:00:00');
      // const endOfMonth = moment()
      //   .endOf('month')
      //   .subtract(0, 'month')
      //   .format('YYYY-MM-DD 23:59:59');

      // const rawStartAt = params.filters.find(
      //   (el: any) => el.field === 'start_at',
      // );
      // const rawEndAt = params.filters.find((el: any) => el.field === 'end_at');
      // const rawStartAt = params.filters.find(
      //   (el: any) => el.field === 'start_at',
      // );
      // const rawEndAt = params.filters.find((el: any) => el.field === 'end_at');

      // const startAt = moment()
      //   .startOf('month')
      //   .subtract(0, 'month')
      //   .subtract(7, 'days')
      //   .format('YYYY-MM-DD 00:00:00');
      // const endAt = moment()
      //   .endOf('month')
      //   .subtract(0, 'month')
      //   .add(7, 'days')
      //   .format('YYYY-MM-DD 23:59:59');

      // check if start_at is first day of this month and end_at is last day of this month
      // if (rawStartAt.value === startOfMonth) {
      //   startAt = moment(rawStartAt.value)
      //     .subtract(7, 'days')
      //     .format('YYYY-MM-DD 00:00:00');
      // }
      // if (rawEndAt.value === endOfMonth) {
      //   endAt = moment(rawEndAt.value)
      //     .add(7, 'days')
      //     .format('YYYY-MM-DD 00:00:00');
      // }

      // const filters = params.filters.map((el: any) => {
      //   if (el.field === 'start_at') {
      //     return {
      //       ...el,
      //       value: startAt,
      //     };
      //   } else if (el.field === 'end_at') {
      //     return {
      //       ...el,
      //       value: endAt,
      //     };
      //   } else if (el.field === 'start') {
      //     return {
      //       ...el,
      //       value: startOfMonth,
      //     };
      //   } else if (el.field === 'end') {
      //     return {
      //       ...el,
      //       value: endOfMonth,
      //     };
      //   }
      // });
      // const newParams = {
      //   ...params,
      //   filters,
      // };
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
    if (this.user[0] === 'owner') {
      const filters = params.filters.filter((el: any) => {
        return el.field !== 'start' && el.field !== 'end';
      });
      const find = filters.find((le: any) => {
        return le.value === 'join';
      });
      if (!find) {
        filters.push({
          field: 'department',
          value: 'join',
        });
      }
      const newParams = {
        ...params,
        filters,
      };
      OutcomeStore.getDataOutcomesOwner(newParams);
    } else {
      OutcomeStore.getDataOutcomes(params);
    }
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
