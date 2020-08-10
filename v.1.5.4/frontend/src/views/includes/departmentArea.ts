import { InitArea } from '@/common/interfaces/area';
import { InitPosition } from '@/common/interfaces/position';
import { InitQuery, InitQueryArea } from '@/common/interfaces/query';
import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import { formatPrice, openSnackbarNow } from '@/common/utils/config';
import { AreaStore } from '@/store/modules/area';
import { PositionStore } from '@/store/modules/position';
import { SettingsStore } from '@/store/modules/settings';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';
import { Validations } from 'vuelidate-property-decorators';
import { required } from 'vuelidate/lib/validators';

@Component({
  mixins: [validationMixin],
  name: 'DepartmentArea',
})
export default class DepartmentArea extends Vue {
  // VALIDATION
  @Validations()
  validations = {
    area: {
      name: { required },
      bonus: { required },
    },
    position: {
      name: { required },
      bonus: { required },
    },
  };
  // DATA
  currency_config: any = {
    decimal: ',',
    thousands: '.',
    prefix: 'Rp',
    precision: 0,
    masked: false,
    allowBlank: false,
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
  };
  snackbar: ISnackbar = InitSnackbar;
  area: any = InitArea;
  position: any = InitPosition;
  baseArea: any = InitArea;
  basePosition: any = InitPosition;
  valid: boolean = true;
  dialogFormArea: boolean = false;
  dialogFormPosition: boolean = false;
  dialogDeleteArea: boolean = false;
  dialogDeletePosition: boolean = false;
  dialogDetailArea: boolean = false;
  tempArea: boolean = false;
  check: boolean = false;
  keyword: string = '';

  // METHODS
  mounted() {
    SettingsStore.setParamsGlobal(InitQuery);
    const department_id: any = this.$route.params.departmentId;
    this.getAreaByDepartement(department_id);
  }

  @Watch('keyword')
  checkInputKeyword() {
    if (this.keyword === '') {
      const department_id: any = this.$route.params.departmentId;
      this.getAreaByDepartement(department_id);
    }
  }

  searchKeyword() {
    if (this.keyword !== '') {
      let find = {};
      if (this.params.filters) {
        find = this.params.filters.find((el: any) => el.operator === 'cont');
        SettingsStore.changeParamsGlobal({
          keyword: true,
          field: 'cont',
          value: this.keyword,
        });
      } else {
        SettingsStore.pushParamsGlobal({
          field: 'name',
          operator: 'cont',
          value: this.keyword,
        });
      }
      const newParams: any = {
        department_id: this.$route.params.departmentId,
        params: this.params,
      };
      this.getAreaByDepartementFilter(newParams);
    } else {
      const department_id: any = this.$route.params.departmentId;
      this.getAreaByDepartement(department_id);
    }
  }

  getAreaByDepartementFilter(data: any) {
    AreaStore.getAllAreaFilter(data);
  }

  getAreaByDepartement(data: any) {
    AreaStore.getAllArea(data);
  }

  getPositionByArea() {
    const area_id: string = this.area.id;
    PositionStore.getAllPosition(area_id);
  }

  showForm(id: string | null = null, type: string) {
    if (type === 'area') {
      if (id) {
        AreaStore.getOneAreaFromList(id);
      } else {
        AreaStore.setInitDataArea();
      }
      this.area = {
        ...this.dataArea,
      };
      this.dialogFormArea = true;
    } else if (type === 'position') {
      if (id) {
        PositionStore.getOnePositionFromList(id);
      } else {
        PositionStore.setInitDataPosition();
      }
      this.position = {
        ...this.dataPosition,
      };
      this.dialogFormPosition = true;
    }
  }

  showConfirmDelete(id: string, type: string) {
    if (type === 'area') {
      AreaStore.getOneAreaFromList(id);
      this.area = {
        ...this.dataArea,
      };
      this.dialogDeleteArea = true;
    } else if (type === 'position') {
      PositionStore.getOnePositionFromList(id);
      this.position = {
        ...this.dataPosition,
      };
      this.dialogDeletePosition = true;
    }
  }

  async deleteDataArea() {
    if (this.area.id) {
      const id: string = this.area.id;
      const departmentId: string = this.$route.params.departmentId;
      await AreaStore.deleteArea({ id, departmentId });
      this.getAreaByDepartement(departmentId);
    }
    this.dialogDeleteArea = false;
  }

  async deleteDataPosition() {
    if (this.position.id) {
      const id: string = this.position.id;
      const areaId: string = this.area.id;
      await PositionStore.deletePosition({ id, areaId });
      this.getPositionByArea();
    }
    this.dialogDeletePosition = false;
  }

  formatPrice(value: any) {
    return formatPrice(value);
  }

  closeForm(type: string) {
    this.$v.$reset();
    AreaStore.setInitDataArea();
    this.area = {
      ...this.dataArea,
    };
    this.position = {
      ...this.dataPosition,
    };
    this.$store.commit('SET_LOADING_DEPARTMENT', false);
    if (type === 'dialogDetailArea') {
      this.dialogDetailArea = false;
    } else if (type === 'dialogFormArea') {
      this.dialogFormArea = false;
    } else if (type === 'dialogFormPosition') {
      this.dialogFormPosition = false;
    } else if (type === 'dialogDeleteArea') {
      this.dialogDeleteArea = false;
    } else if (type === 'dialogDeletePosition') {
      this.dialogDeletePosition = false;
    } else {
      this.dialogFormArea = false;
      this.dialogFormPosition = false;
      this.dialogDeleteArea = false;
      this.dialogDeletePosition = false;
      this.dialogDetailArea = false;
    }
  }

  async showDetailPosition(id: string) {
    if (id) {
      await AreaStore.getOneAreaFromList(id);
      this.area = {
        ...this.dataArea,
      };
      await PositionStore.getAllPosition(this.area.id);
    } else {
      AreaStore.setInitDataArea();
    }
    this.dialogDetailArea = true;
  }

  async saveArea() {
    if (this.area.bonus === '' || this.area.name === '') {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message:
          'Ada form yang belum anda isi, silahkan cek kembali inputan anda',
        color: 'warn',
      };
      openSnackbarNow(snackbar);
      this.area = {
        ...this.area,
        errors: {
          bonus: this.area.bonus === '' ? true : false,
          name: this.area.name === '' ? true : false,
        },
      };
    } else {
      this.$v.$reset();
      const newGroup = {
        ...this.area,
        department_id: this.$route.params.departmentId,
      };
      await AreaStore.saveArea(newGroup);
      this.area = {
        ...this.dataArea,
      };
      this.dialogFormArea = false;
      const department_id: any = this.$route.params.departmentId;
      this.getAreaByDepartement(department_id);
      AreaStore.setInitDataArea();
    }
  }

  async savePosition() {
    if (this.position.bonus === '' || this.position.name === '') {
      const snackbar = {
        ...this.snackbar,
        value: true,
        message:
          'Ada form yang belum anda isi, silahkan cek kembali inputan anda',
        color: 'warn',
      };
      openSnackbarNow(snackbar);
      this.position = {
        ...this.position,
        errors: {
          bonus: this.position.bonus === '' ? true : false,
          name: this.position.name === '' ? true : false,
        },
      };
    } else {
      const newPosition = {
        ...this.position,
        area_id: this.area.id,
      };
      await PositionStore.savePosition(newPosition);
      PositionStore.setInitDataPosition();
      this.$v.$reset();
      this.position = {
        ...this.basePosition,
      };
      this.dialogFormPosition = false;
      this.getPositionByArea();
    }
  }

  // GETTERS
  get params(): any {
    return SettingsStore.params;
  }

  get listArea() {
    return AreaStore.listArea;
  }

  get dataArea() {
    const result = {
      ...AreaStore.area,
      errors: {
        name: false,
        bonus: false,
      },
    };
    return result;
  }

  get listPosition() {
    return PositionStore.listPosition;
  }

  get dataPosition() {
    const result = {
      ...PositionStore.position,
      errors: {
        name: false,
        bonus: false,
      },
    };
    return result;
  }
}
