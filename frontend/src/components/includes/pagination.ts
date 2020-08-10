import { SettingsStore } from '@/store/modules/settings';
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'Pagination',
})
export default class Pagination extends Vue {
  @Prop() readonly loading?: any;

  get params(): any {
    return SettingsStore.params;
  }

  get pagination(): any {
    return SettingsStore.pagination;
  }

  @Watch('pagination.page')
  showPagination() {
    const currentPage = {
      ...this.params,
      per_page: this.pagination.totalVisible,
      page: this.pagination.page,
    };
    this.$emit('getListData', currentPage);
  }
}
