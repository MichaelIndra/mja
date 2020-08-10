import { InitQuery, IQuery } from '@/common/interfaces/query';
import { IRule } from '@/common/interfaces/rule';
import { RuleStore } from '@/store/modules/rule';
import { __assign } from 'tslib';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';

@Component({
  name: 'Rule',
})
export default class Rule extends Vue {
  calcButtonNumber: string = 'elevation-0 blue font-weight-bold lighten-5';
  calcButtonOperation: string = 'elevation-0 blue lighten-2 font-weight-bold';
  valid: boolean = true;
  dialogForm: boolean = false;
  dialogDelete: boolean = false;
  options: any = {};
  params: IQuery = {
    ...InitQuery,
  };
  headers: any[] = [
    {
      text: 'Nama Rule',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Tipe',
      align: 'left',
      sortable: false,
      value: 'type',
    },
    {
      text: 'Deskripsi',
      align: 'left',
      sortable: false,
      value: 'description',
    },
    {
      text: 'Konten',
      align: 'left',
      sortable: false,
      value: 'value',
    },
    { text: 'Aksi', value: 'actions', sortable: false },
  ];
  listVariable: any = [
    {
      name: 'Gaji Bulanan',
      value: 'BASE_SALARY_PER_MONTH',
    },
    {
      name: 'Gaji Minggu',
      value: 'BASE_SALARY_PER_WEEK',
    },
    {
      name: 'Jam Kerja',
      value: 'HOURS_IN_WORKDAY',
    },
    {
      name: 'Jam Kerja di Hari Libur',
      value: 'HOURS_IN_OFFDAY',
    },
    {
      name: 'Lama Terlambat',
      value: 'ATTENDANCE_LATE_IN_HOURS',
    },
    {
      name: 'Jam Lembur Pertama',
      value: 'ATTENDANCE_FIRST_OVERTIME_HOUR',
    },
    {
      name: 'Jam Lembur Setelahnya',
      value: 'ATTENDANCE_MORE_OVERTIME_HOUR',
    },
    {
      name: 'Total Jam Lembur ',
      value: 'ATTENDANCE_OVERTIME_HOUR',
    },
  ];
  logList: any = '';
  current: any = '';
  answer: any = '';
  operatorClicked: boolean = true;

  // GETTERS
  get pagination(): any {
    return RuleStore.pagination;
  }

  get isLoading(): boolean {
    return RuleStore.isLoadingRule;
  }

  get rule(): IRule {
    return RuleStore.rule;
  }

  get listRule(): IRule[] {
    return RuleStore.listRule;
  }

  // WATCH
  @Watch('options')
  listenOptionsChanges() {
    this.getListRule();
  }

  // METHODS
  mounted() {
    window.addEventListener('keyup', (ev: any) => {
      this.listenKeyupKeyboard(ev); // declared in your component methods
    });
    this.getListRule();
  }

  listenKeyupKeyboard(event: any) {
    if (event.keyCode === 49) {
      this.append('1');
    } else if (event.keyCode === 50) {
      this.append('2');
    } else if (event.keyCode === 51) {
      this.append('3');
    } else if (event.keyCode === 52) {
      this.append('4');
    } else if (event.keyCode === 53) {
      this.append('5');
    } else if (event.keyCode === 54) {
      this.append('6');
    } else if (event.keyCode === 55) {
      this.append('7');
    } else if (!event.shiftKey && event.keyCode === 56) {
      this.append('8');
    } else if (!event.shiftKey && event.keyCode === 57) {
      this.append('9');
    } else if (!event.shiftKey && event.keyCode === 48) {
      this.append('0');
    } else if (event.keyCode === 8) {
      this.correction();
    } else if (event.keyCode === 46) {
      this.clear();
    } else if (event.shiftKey && event.keyCode === 57) {
      this.grouping('(');
    } else if (event.shiftKey && event.keyCode === 48) {
      this.grouping(')');
    } else if (event.keyCode === 173) {
      this.minus();
    } else if (event.shiftKey && event.keyCode === 61) {
      this.plus();
    } else if (event.shiftKey && event.keyCode === 56) {
      this.times();
    } else if (event.shiftKey && event.keyCode === 191) {
      this.divide();
    }
  }

  append(number: string) {
    if (this.operatorClicked) {
      this.current = '';
      this.operatorClicked = false;
    }
    this.current = `${this.current}${number}`;
  }

  appendVariable(variable: any) {
    if (this.operatorClicked) {
      this.current = '';
      this.operatorClicked = false;
    }
    this.current = `${this.current} ${variable}`;
  }

  addtoLog(operator: any) {
    if (this.operatorClicked === false) {
      this.logList += `${this.current} ${operator} `;
      this.current = '';
      this.operatorClicked = true;
    }
  }
  clear() {
    this.current = '';
    this.answer = '';
    this.logList = '';
    this.operatorClicked = false;
  }

  dot() {
    if (this.current.indexOf('.') === -1) {
      this.append('.');
    }
  }

  divide() {
    this.addtoLog('/');
  }

  correction() {
    const data: any = (this.logList + this.current).split(' ');
    const lastData: any = data[data.length - 1];
    const find: any = this.listVariable.find(
      (el: any) => el.value === lastData,
    );
    if (find) {
      data.pop();
      this.current = '';
      this.logList = data.join(' ');
    } else {
      if (this.current !== '') {
        this.current = this.current.slice(0, -1);
      } else {
        this.logList = this.logList.slice(0, -1);
      }
    }
  }

  grouping(variable: any) {
    if (this.operatorClicked) {
      this.current = '';
      this.operatorClicked = false;
    }
    this.current = `${this.current} ${variable}`;
    // this.addtoLog(type);
  }

  times() {
    this.addtoLog('*');
  }

  minus() {
    this.addtoLog('-');
  }

  plus() {
    this.addtoLog('+');
  }

  closeForm() {
    this.$v.$reset();
    RuleStore.setInitDataRule();
    this.$store.commit('SET_LOADING_RULE', false);
    this.dialogForm = false;
  }

  getListRule() {
    RuleStore.getAllRule({});
  }

  cancelAction() {
    this.$store.commit('SET_LOADING_RULE', false);
    this.dialogForm = false;
  }

  showForm(id: string | null = null) {
    if (id) {
      RuleStore.getOneRuleFromList(id);
    } else {
      RuleStore.setInitDataRule();
    }
    this.dialogForm = true;
  }

  showConfirmDelete(id: string) {
    RuleStore.getOneRuleFromList(id);
    this.dialogDelete = true;
  }

  deleteData() {
    if (this.rule.id) {
      RuleStore.deleteRule(this.rule.id);
    }
    this.dialogDelete = false;
  }

  async save() {
    const newData: any = {
      name: this.rule.name,
      type: this.rule.type,
      description: this.rule.description,
      value: this.logList + this.current,
    };
    await RuleStore.saveRule(newData);
    RuleStore.setInitDataRule();
    this.clear();
    this.dialogForm = false;
  }
}
