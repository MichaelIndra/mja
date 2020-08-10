import {
  backup,
  createBulkEmployee,
  createEmployee,
  deleteEmployee,
  fetchCurrentEmployeeBirthday,
  fetchEmployees,
  fetchOneEmployee,
  fetchTotalEmployee,
  getEmployeeDataForPayslip,
  updateEmployee,
} from '@/common/api/employee';
import { IDepartment } from '@/common/interfaces/department';
import { IEmployee, InitEmployee } from '@/common/interfaces/employee';
import {
  convertDuration,
  formatDate,
  splitDateOfBirth,
} from '@/common/utils/config';
import {
  calculateCutOver,
  calculateLateCheckIn,
  calculateLateCheckInAfterBreak,
  calculateLateCheckOut,
} from '@/common/utils/timeCalculation';
import store from '@/store';
import moment, { now } from 'moment';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

export interface IEmployeeState {
  isLoadingEmployee: boolean;
  listEmployee: any[];
  listBaseEmployee: any[];
  listEmployeeBirthday: any[];
  listEmployeeLongest: any[];
  employee?: IEmployee;
  employeeActive: any[];
  totalData: number;
}

@Module({ dynamic: true, store, name: 'EmployeeStore' })
class Employee extends VuexModule implements IEmployeeState {
  isLoadingEmployee = false;
  listEmployee = [];
  listBaseEmployee = [];
  listEmployeeBirthday = [];
  listCurrentEmployeeBirthday = [];
  listEmployeeLongest = [];
  employeeActive = [];
  employee: any = JSON.parse(JSON.stringify(InitEmployee));
  totalData = 0;
  totalEmployee = {};
  backupData = {};
  @Action
  async getEmployeeBirthday() {
    const params: any = {
      filters: [
        {
          field: 'name',
          value: 'ASC',
        },
      ],
    };
    const res: any = await fetchEmployees();
    this.SET_EMPLOYEE_ACTIVE(res);
    this.SET_EMPLOYEE_BIRTHDAY(res);
  }
  @Action
  async getTotalEmployee() {
    const res: any = await fetchTotalEmployee();
    this.SET_TOTAL_EMPLOYEE(res);
  }
  @Action
  async backup() {
    const res: any = await backup();
    this.SET_BACKUP_DATA(res);
  }

  @Action
  async getCurrentEmployeeBirthday() {
    const res: any = await fetchCurrentEmployeeBirthday();
    this.SET_CURRENT_EMPLOYEE_BIRTHDAY(res);
  }
  @Action
  async setEmployeeData(index: any) {
    let res: any = this.listEmployee[index];
    if (res.payslips && res.payslips.length > 0 && !res.temp_payslip_data) {
      res = {
        ...res,
        temp_payslip_data: res.payslips[0],
      };
    }
    this.SET_EMPLOYEE(res);
  }

  @Action choosePayslip(data: any) {
    this.SET_EMPLOYEE(data);
  }

  @Action
  setDepartment(department: IDepartment) {
    this.SET_EMPLOYEE_DEPARTMENT(department);
  }

  @Action
  async setRawEmployeeData(data: any) {
    this.SET_EMPLOYEE_PAYSLIP(data);
  }

  @Action
  async setInitDataEmployee() {
    const res = JSON.parse(JSON.stringify(InitEmployee));
    this.SET_EMPLOYEE(res);
  }

  @Action
  async getAllEmployeeWithoutParams(params: any) {
    const res: any = await fetchEmployees(params);
    this.SET_LIST_EMPLOYEE_WITH_NO_PARAMS(res);
  }

  @Action
  async getEmployeeDataForPayslip(query: any) {
    this.SET_LOADING_EMPLOYEE(true);
    const res: any = await getEmployeeDataForPayslip(query);
    this.SET_LOADING_EMPLOYEE(false);
    try {
      this.SET_LIST_EMPLOYEE(res);
    } catch (error) {
      console.error('error fetch', error);
    }
  }

  @Action
  async getAllEmployee(query: any) {
    await this.context.dispatch('setParamsGlobal', query);
    this.SET_LOADING_EMPLOYEE(true);
    const res: any = await fetchEmployees(query);
    this.SET_LOADING_EMPLOYEE(false);
    await this.context.dispatch('setPagination', res);
    try {
      this.SET_LIST_EMPLOYEE(res);
    } catch (error) {
      console.error('error fetch', error);
    }
  }

  @Action
  async getBaseEmployee(query: any) {
    try {
      this.SET_LOADING_EMPLOYEE(true);
      const res: any = await fetchEmployees(query);
      this.SET_LOADING_EMPLOYEE(false);
      this.SET_LIST_BASE_EMPLOYEE(res);
    } catch (err) {
      console.error(err);
    }
  }

  @Action
  async getOneEmployee(data: any) {
    const res: any = await fetchOneEmployee(data.employeeId, data.params);
    if (res) {
      const newRes: any = {
        ...res,
        place_of_birth: splitDateOfBirth(res.date_of_birth)[0],
        date_of_birth: splitDateOfBirth(res.date_of_birth)[1],
      };
      this.SET_EMPLOYEE(newRes);
    }
  }

  @Action
  async getOneEmployeeFromList(id: string) {
    this.SET_LOADING_EMPLOYEE(true);
    const res: any = this.listEmployee.find((item: any) => item.id === id);
    if (res) {
      const split: any = splitDateOfBirth(res.date_of_birth)[1].split('-');
      const newDateOfBirth: string = `${split[2]}-${split[1]}-${split[0]}`;
      const newRes: any = {
        ...res,
        place_of_birth: splitDateOfBirth(res.date_of_birth)[0],
        date_of_birth: newDateOfBirth,
      };
      this.SET_LOADING_EMPLOYEE(false);
      this.SET_EMPLOYEE(newRes);
    }
  }

  @Action
  async saveEmployee(data: IEmployee) {
    this.SET_LOADING_EMPLOYEE(true);
    const newData = {
      ...data,
      date_entry: new Date(data.date_entry ? data.date_entry : '-'),
      active_date: new Date(data.active_date ? data.active_date : '-'),
    };
    let res: any;
    if (newData.id) {
      res = await updateEmployee(newData.id, newData);
    } else {
      res = await createEmployee(newData);
    }
    this.SET_LOADING_EMPLOYEE(false);
    this.SET_EMPLOYEE(res);
  }
  @Action
  async saveBulkEmployee(data: IEmployee[]) {
    this.SET_LOADING_EMPLOYEE(true);
    await createBulkEmployee(data);
    this.SET_LOADING_EMPLOYEE(false);
  }

  @Action
  async createEmployee(data: IEmployee) {
    const res: any = await createEmployee(data);
  }

  @Action
  async updateEmployee(id: string, data: IEmployee) {
    const res: any = await updateEmployee(id, data);
  }

  @Action
  async deleteEmployee(id: string) {
    this.SET_LOADING_EMPLOYEE(true);
    const res: any = await deleteEmployee(id);
    this.SET_LOADING_EMPLOYEE(false);
  }

  @Action
  async setEmployeePayslipForOwner(employee: any) {
    if (
      employee.payslips &&
      employee.payslips.length > 0 &&
      !employee.temp_payslip_data
    ) {
      employee = {
        ...employee,
        temp_payslip_data: employee.payslips[0],
      };
    }
    this.SET_EMPLOYEE(employee);
  }

  @Action
  assignEmployeeData(data: any) {
    const newData: any = {
      ...this.employee,
      meta: {
        ...this.employee.meta,
        payslip: data,
      },
    };
    this.ASSIGN_EMPLOYEE(newData);
  }

  @Mutation
  private SET_EMPLOYEE_DEPARTMENT(department: any) {
    this.employee = {
      ...this.employee,
      department,
    };
  }

  @Mutation
  private ASSIGN_EMPLOYEE(data: any) {
    this.employee = data;
  }

  @Mutation
  private SET_LIST_EMPLOYEE_WITH_NO_PARAMS(res: any) {
    const datas: any = [];
    if (res && Array.isArray(res)) {
      res.forEach((item: any) => {
        datas.push(item);
      });
    } else if (res && res.data && Array.isArray(res.data)) {
      res.data.forEach((item: any) => {
        datas.push(item);
      });
      delete res.data;
    }
    this.listEmployee = datas;
  }

  @Mutation
  private SET_EMPLOYEE_ACTIVE(data: any) {
    this.employeeActive = data.filter((el: any) => {
      if (el.active) {
        return el;
      }
    });
  }
  @Mutation
  private SET_CURRENT_EMPLOYEE_BIRTHDAY(data: any) {
    // tslint:disable-next-line: no-shadowed-variable
    const now = new Date().toISOString().substr(0, 10);
    this.listCurrentEmployeeBirthday = data.map((el: any) => {
      const birth = moment(el.date_of_birth.split('/')[1])
        .locale('id')
        .format(now.split('-')[0] + '-MM-DD');

      const differenceFromNow: any = moment(now)
        .locale('id')
        .diff(moment(birth), 'days');
      const isBirthday: boolean = moment(now).isSame(birth, 'day');

      return {
        employeeName: el.name,
        employeeNIK: el.nik,
        picture: el.picture,
        dateOfBirth: el.date_of_birth,
        differenceFromNow,
        isBirthday,
        birthday: formatDate(el.current_birth_day, 'long'),
      };
    });
  }
  @Mutation
  private SET_EMPLOYEE_BIRTHDAY(data: any) {
    const listBirthday: any = data.map((el: any) => {
      const dateBirth: any = splitDateOfBirth(el.date_of_birth)[1];
      const month: any =
        new Date(dateBirth).getMonth() + 1 < 10
          ? `0${new Date(dateBirth).getMonth() + 1}`
          : new Date(dateBirth).getMonth() + 1;
      const date: any = new Date(dateBirth).getDate();
      const dateNow: any = new Date();
      const yearNow: any =
        new Date(dateBirth).getMonth() >= new Date().getMonth()
          ? new Date().getFullYear()
          : new Date().getFullYear() + 1;
      // const diffDate: any = new  Date().getTime()
      const diffDate: any = moment(`${yearNow}-${month}-${date}`).diff(
        dateNow,
        'months',
        true,
      );

      return {
        ...el,
        date_birth: dateBirth,
        diff_date: diffDate,
        diff_timestamp:
          new Date(
            new Date(dateBirth).getMonth() >= new Date().getMonth()
              ? yearNow
              : yearNow + 1 + '-' + month + '-' + date,
          ).getTime() - new Date().getTime(),
      };
    });

    const listLongest: any = data.map((el: any) => {
      const date: any = new Date();
      const year: any = Math.floor(
        moment(date).diff(el.active_date, 'years', true),
      );
      return {
        ...el,
        active_date_since_value: year,
        active_date_since: year,
      };
    });

    listLongest.sort(
      (a: any, b: any) => b.active_date_since - a.active_date_since,
    );

    this.listEmployeeBirthday = listBirthday;
    this.listEmployeeLongest = listLongest;
  }

  @Mutation
  private SET_EMPLOYEE_PAYSLIP(data: any) {
    this.employee = {};
    this.employee = data;
  }

  @Mutation
  private SET_EMPLOYEE(data: any) {
    this.employee = {};
    const date_now: any = new Date();
    let year = 0;
    let month = 0;
    let day = 0;
    if (data.active_date) {
      year = Math.floor(moment(date_now).diff(data.active_date, 'years', true));
      month = Math.floor(
        moment(date_now).diff(data.active_date, 'months', true),
      );
      day = Math.floor(moment(date_now).diff(data.active_date, 'days', true));
    }
    this.employee = {
      ...data,
      // place_of_birth:
      //   data.date_of_birth !== ''
      //     ? splitDateOfBirth(data.date_of_birth)[0]
      //     : '',
      // date_of_birth:
      //   data.date_of_birth !== ''
      //     ? splitDateOfBirth(data.date_of_birth)[0] +
      //       '/' +
      //       formatDate(splitDateOfBirth(data.date_of_birth)[1], 'short-date')
      //     : '',
      active_date: data.active_date
        ? moment(data.active_date)
            .locale('id')
            .format('YYYY-MM-DD')
        : null,
      // date_of_birth: moment(data.date_of_birth)
      //   .locale('id')
      //   .format('YYYY-MM-DD'),
      active_date_since:
        data.active_date && day <= 365 && month < 1
          ? `${day} Hari`
          : month <= 12 && year < 1
          ? `${month} Bulan ${day} Hari`
          : year >= 1
          ? `${year} Tahun`
          : '-',
      created_at: formatDate(data.created_at ? data.created_at : '', 'long'),
      date_entry: formatDate(data.date_entry ? data.date_entry : '', 'input'),
    };
  }

  @Mutation
  private SET_LIST_EMPLOYEE(res: any) {
    this.listEmployee = [];
    const datas: any = [];
    let newData: any = [];
    if (res && Array.isArray(res)) {
      res.forEach((item: any) => {
        datas.push(item);
      });
    } else if (res && res.data && Array.isArray(res.data)) {
      this.totalData = res.total;
      res.data.forEach((item: any) => {
        datas.push(item);
      });
      delete res.data;
    } else {
      res.forEach((item: any) => {
        datas.push(item);
      });
    }
    if (datas) {
      newData = datas.map((item: any) => {
        if (item.attendances) {
          const schedule: any = item.group.schedule.schedules;
          item.attendances = item.attendances.map((data: any) => {
            const date_entry = new Date(data.time_check_in).getDay();
            const currentSchedule = schedule.find((el: any) => {
              return el.value === date_entry;
            });
            const lateDurationCheckIn = calculateLateCheckIn(
              data.time_check_in,
              currentSchedule.start_one,
            );
            const convertBreakEnd = calculateLateCheckInAfterBreak(
              data.time_check_in_for_break,
              currentSchedule.end_two,
            );
            const breakLateDuration =
              convertBreakEnd > 0 ? convertDuration(convertBreakEnd) : `-`;
            const overtimeDuration = calculateLateCheckOut(
              data.time_check_out,
              currentSchedule.start_two,
            );
            const cutOverDuration = calculateCutOver(
              data.time_check_out,
              currentSchedule.start_two,
            );
            const find = schedule.find((el: any) => {
              return el.value === date_entry;
            });
            if (date_entry || date_entry === 0) {
              return {
                ...data,
                scheduleToday: find ? find : {},
                date: data.time_check_in,
                date_entry: data.date_entry,
                time_check_in: data.time_check_in,
                check_in: data.time_check_in,
                time_check_out_for_break: data.time_check_out_for_break,
                time_check_in_for_break: data.time_check_in_for_break,
                time_check_out: data.time_check_out,
                late: lateDurationCheckIn,
                breakLate: breakLateDuration,
                cutOver: cutOverDuration,
                overtime: overtimeDuration,
                created_at: formatDate(data.created_at, 'long'),
                updated_at: formatDate(data.updated_at, 'long'),
              };
            } else {
              return {
                ...data,
              };
            }
          });
        }
        const date_now: any = new Date();
        const year: any = Math.floor(
          moment(date_now).diff(item.active_date, 'years', true),
        );
        const month: any = Math.floor(
          moment(date_now).diff(item.active_date, 'months', true),
        );
        const day: any = Math.floor(
          moment(date_now).diff(item.active_date, 'days', true),
        );
        return {
          ...item,
          meta: {
            ...item.meta,
            payslip: {
              ...item.meta.payslip,
              value_holiday:
                item.meta.payslip.value_holiday > 0
                  ? item.meta.payslip.value_holiday
                  : 0,
              value_food_deduction:
                item.meta.payslip.value_food_deduction > 0
                  ? item.meta.payslip.value_food_deduction
                  : 0,
              value_bon_deduction:
                item.meta.payslip.value_bon_deduction > 0
                  ? item.meta.payslip.value_bon_deduction
                  : 0,
              value_extra_work:
                item.meta.payslip.value_extra_work > 0
                  ? item.meta.payslip.value_extra_work
                  : 0,
              value_driver_extra:
                item.meta.payslip.value_driver_extra > 0
                  ? item.meta.payslip.value_driver_extra
                  : 0,
              // additional value #246
              extra_full: {
                nominal: item.meta.payslip.extra_full
                  ? item.meta.payslip.extra_full.nominal || 0
                  : 0,
                indicator: item.meta.payslip.extra_full
                  ? item.meta.payslip.extra_full.indicator || false
                  : false,
              },
              value_day_7: {
                nominal: item.meta.payslip.value_day_7
                  ? item.meta.payslip.value_day_7.nominal || 0
                  : 0,
                indicator: item.meta.payslip.value_day_7
                  ? item.meta.payslip.value_day_7.indicator || false
                  : false,
              },
              extra_sunday: {
                nominal: item.meta.payslip.extra_sunday
                  ? item.meta.payslip.extra_sunday.nominal || 0
                  : 0,
                indicator: item.meta.payslip.extra_sunday
                  ? item.meta.payslip.extra_sunday.indicator || false
                  : false,
              },
              owner_special_insentif:
                item.meta.payslip.owner_special_insentif > 0
                  ? item.meta.payslip.owner_special_insentif
                  : 0,
              owner_additional:
                item.meta.payslip.owner_additional > 0
                  ? item.meta.payslip.owner_additional
                  : 0,
              owner_overtime:
                item.meta.payslip.owner_overtime > 0
                  ? item.meta.payslip.owner_overtime
                  : 0,
            },
          },
          date_of_birth:
            splitDateOfBirth(item.date_of_birth)[0] +
            '/' +
            formatDate(splitDateOfBirth(item.date_of_birth)[1], 'short-date'),
          active_date_since:
            day <= 365 && month < 1
              ? `${day} Hari`
              : month <= 12 && year < 1
              ? `${month} Bulan`
              : year >= 1
              ? `${year} Tahun`
              : '-',
          status_active: item.active ? 'Aktif' : 'Tidak Aktif',
        };
      });
      this.listEmployee = newData;
    }
  }
  @Mutation
  private SET_LIST_BASE_EMPLOYEE(res: any) {
    this.listBaseEmployee = res;
  }
  @Mutation
  private SET_LOADING_EMPLOYEE(status: boolean) {
    this.isLoadingEmployee = status;
  }
  @Mutation
  private SET_TOTAL_EMPLOYEE(res: any) {
    if (res.length > 0) {
      this.totalEmployee = res[0];
    } else {
      this.totalEmployee = res;
    }
  }
  @Mutation
  private SET_BACKUP_DATA(res: any) {
    this.backupData = res;
  }
}

export const EmployeeStore = getModule(Employee);
