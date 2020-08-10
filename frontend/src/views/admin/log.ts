import { formatDate, formatPrice, fullName } from '@/common/utils/config';
import { EmployeeStore } from '@/store/modules/employee';
import { LogStore } from '@/store/modules/log';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
  name: 'Log',
})
export default class Log extends Vue {
  headers: any[] = [
    {
      text: 'Nama user',
      value: 'full_name',
      width: 150,
    },
    { text: 'Tanggal aksi', value: 'created_at', width: 180 },
    { text: 'Jenis aksi', value: 'action' },
    { text: 'Data yang diubah', value: 'entity_name' },
    { text: 'Detail perubahan', value: 'entity_detail' },
    { text: 'Detail Log', value: 'actions' },
  ];
  detailLog: any = {};
  dialog: boolean = false;
  current_data: any = [];
  previous_data: any = [];

  get listLog(): any {
    const listLog: any = LogStore.listLog.map((el: any) => {
      el = {
        ...el,
        full_name: fullName(el.account.first_name, el.account.last_name),
        created_at: formatDate(el.created_at, 'dateTime'),
        entity_name: this.convertEntityName(el.entity),
        entity_detail: this.convertEntityListChange(el.listChange),
        entity_raw: this.rawConvertEntityListChange(el.listChange),
      };
      return el;
    });
    return listLog;
  }

  mounted() {
    this.getListLogs({
      page: 1,
      per_page: 10,
      filters: [
        {
          field: 'created_at',
          value: 'DESC',
        },
        {
          field: 'account',
          value: 'join',
        },
      ],
    });
  }

  closeForm() {
    this.current_data = [];
    this.previous_data = [];
    this.detailLog = {};
    this.dialog = false;
  }

  convertLogEmployee(data: any) {
    if (data.position) {
      const position: any = {
        name: data.name,
        position: data.position.name,
      };
      return {
        ...position,
      };
    }
    if (data.department) {
      const department: any = {
        name: data.name,
        department: data.department.name,
      };
      return {
        ...department,
      };
    }
    if (data.area) {
      const area: any = {
        name: data.name,
        area: data.area.name,
      };
      return {
        ...area,
      };
    }
    if (data.group) {
      const group: any = {
        name: data.name,
        group: data.group.name,
      };
      return {
        ...group,
      };
    }
  }

  separateData(
    currentData: any,
    previousData: any,
    type: string,
    convertPrice: boolean,
  ) {
    const current: any = {
      [type]: currentData,
    };
    const previous: any = {
      [type]: previousData,
    };
    for (const key of Object.keys(current)) {
      this.current_data.push([
        this.convertKey(key),
        convertPrice ? formatPrice(current[key]) : current[key],
      ]);
    }
    for (const key of Object.keys(previous)) {
      this.previous_data.push([
        this.convertKey(key),
        convertPrice ? formatPrice(previous[key]) : previous[key],
      ]);
    }
  }

  convertDataChange(data: any) {
    data.entity_raw.forEach((el: any) => {
      if (el === 'department_id') {
        this.separateData(
          data.meta.current_data.department.name,
          data.meta.previous_data.department.name,
          'department',
          false,
        );
      } else if (el === 'group_id') {
        this.separateData(
          data.meta.current_data.group.name,
          data.meta.previous_data.group.name,
          'group',
          false,
        );
      } else if (el === 'area_id') {
        this.separateData(
          data.meta.current_data.area.name,
          data.meta.previous_data.area.name,
          'area',
          false,
        );
      } else if (el === 'position_id') {
        this.separateData(
          data.meta.current_data.position.name,
          data.meta.previous_data.position.name,
          'position',
          false,
        );
      } else if (el === 'insentif') {
        this.separateData(
          data.meta.current_data.meta.payslip.insentif,
          data.meta.previous_data.meta.payslip.insentif,
          'insentif',
          true,
        );
      } else if (el === 'spsi_deduction') {
        this.separateData(
          data.meta.current_data.meta.payslip.spsi_deduction,
          data.meta.previous_data.meta.payslip.spsi_deduction,
          'spsi_deduction',
          true,
        );
      } else if (el === 'astek_deduction') {
        this.separateData(
          data.meta.current_data.meta.payslip.astek_deduction,
          data.meta.current_data.meta.payslip.astek_deduction,
          'spsi_deduction',
          true,
        );
      } else if (el === 'base_salary') {
        this.separateData(
          Number(data.meta.current_data.base_salary),
          Number(data.meta.current_data.base_salary),
          'base_salary',
          true,
        );
      } else if (el === 'active_date') {
        this.separateData(
          formatDate(data.meta.current_data.active_date, 'long'),
          formatDate(data.meta.previous_data.active_date, 'long'),
          'active_date',
          false,
        );
      } else if (el === 'approved') {
        this.separateData(
          data.meta.current_data.meta.approved === 'approved'
            ? 'Disetujui'
            : 'Ditolak',
          'Belum disetujui',
          'approved',
          false,
        );
      } else if (el === 'totalWork') {
        this.separateData(
          Number(data.meta.current_data.meta.totalWork) / 3600 + ' jam',
          '--',
          'total_work',
          false,
        );
      } else if (el === 'totalBreak') {
        this.separateData(
          Number(data.meta.current_data.meta.totalBreak) / 3600 + ' jam',
          '--',
          'total_break',
          false,
        );
      } else if (el === 'totalLeave') {
        this.separateData(
          Number(data.meta.current_data.meta.totalLeave) / 3600 + ' jam',
          '--',
          'total_leave',
          false,
        );
      } else if (el === 'totalOvertime') {
        this.separateData(
          Number(data.meta.current_data.meta.totalOvertime) / 3600 + ' jam',
          '--',
          'total_overtime',
          false,
        );
      }
    });
    return { current: this.current_data, previous: this.previous_data };
  }

  async showData(id: string) {
    const find: any = await this.listLog.find((el: any) => {
      return el.id === id;
    });

    const converted: any = this.convertDataChange(find);

    this.detailLog = {
      name: fullName(find.account.first_name, find.account.last_name),
      entity: this.convertEntityName(find.entity),
      action_date: formatDate(find.created_at, 'dateTime'),
      previous: converted.previous,
      current: converted.current,
    };
    this.dialog = true;
  }
  async backup() {
    await EmployeeStore.backup();
    this.forceFileDownload(EmployeeStore.backupData);
  }
  forceFileDownload(response: any) {
    const url = window.URL.createObjectURL(new Blob([response.dump.schema + response.dump.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MJA_DB_BACKUP_'+new Date().getTime()+'.sql');
    document.body.appendChild(link);
    link.click();
  }
  convertEntityListChange(array: any) {
    const data: any = array.map((el: any) => {
      const splits: any = el.split('.');
      if (splits.length > 1) {
        el = this.convertFieldName(splits[splits.length - 1]);
      } else {
        el = this.convertFieldName(el);
      }
      return el;
    });
    if (data.length > 0) {
      return data
        .toString()
        .split(',')
        .join(', ');
    } else {
      return data.toString();
    }
  }

  checkCase(text: string) {
    const split: any = text.split('_');
    if (split.length > 0) {
      return text;
    } else {
      return this.convertSnakeCase(text);
    }
  }

  convertSnakeCase(text: any) {
    return text
      .replace(/\.?([A-Z]+)/g, (x: any, y: any) => {
        return '_' + y.toLowerCase();
      })
      .replace(/^_/, '');
  }

  rawConvertEntityListChange(array: any) {
    const data: any = array.map((el: any) => {
      const splits: any = el.split('.');
      if (splits.length > 1) {
        el = this.checkCase(splits[splits.length - 1]);
      } else {
        el = el;
      }
      return el;
    });
    return data;
  }

  convertFieldName(name: string) {
    if (name === 'department_id') {
      return 'Departemen';
    } else if (name === 'group_id') {
      return 'Golongan';
    } else if (name === 'area_id') {
      return 'Area';
    } else if (name === 'position_id') {
      return 'Posisi';
    } else if (name === 'insentif') {
      return 'Insentif';
    } else if (name === 'spsi_deduction') {
      return 'Potongan SPSI';
    } else if (name === 'astek_deduction') {
      return 'Potongan ASTEK';
    } else if (name === 'base_salary') {
      return 'Gaji UMR';
    } else if (name === 'active_date') {
      return 'Tanggal Mulai Kerja';
    } else if (name === 'approved') {
      return 'Status Approve';
    } else if (name === 'total_work' || name === 'totalWork') {
      return 'Total Jam Kerja';
    } else if (name === 'total_break' || name === 'totalBreak') {
      return 'Total Jam Istirahat';
    } else if (name === 'total_leave' || name === 'totalLeave') {
      return 'Total Jam Izin';
    } else if (name === 'total_overtime' || name === 'totalOvertime') {
      return 'Total Jam Lembur';
    } else if (name === 'total_late' || name === 'totalLate') {
      return 'Total Terlambat';
    } else if (name === 'fixed_schedule' || name === 'fixedSchedule') {
      return 'Data jadwal';
    } else if (name === 'is_switch_schedule' || name === 'isSwitchSchedule') {
      return 'Perubahan Jadwal';
    } else {
      return name;
    }
  }

  convertEntityName(name: string) {
    if (name === 'employees') {
      return 'Karyawan';
    } else if (name === 'groups') {
      return 'Golongan';
    } else if (name === 'attendances') {
      return 'Data Kehadiran';
    } else {
      return name;
    }
  }

  getListLogs(params: any) {
    LogStore.getListLog(params);
  }

  convertKey(key: string) {
    const keyName: string = key
      .split('_')
      .join(' ')
      .toUpperCase();
    if (keyName === 'NAME') {
      return 'NAMA';
    } else if (keyName === 'ACTIVE') {
      return 'STATUS KARYAWAN';
    } else if (keyName === 'ADDRESS') {
      return 'ALAMAT';
    } else if (keyName === 'PHONE NO') {
      return 'NOMOR TELEPON';
    } else if (keyName === 'ACTIVE DATE') {
      return 'TANGGAL AKTIF';
    } else if (keyName === 'DATE OF BIRTH') {
      return 'TANGGAL LAHIR';
    } else if (keyName === 'POSITION') {
      return 'POSISI';
    } else if (keyName === 'DEPARTMENT') {
      return 'DEPARTEMEN';
    } else if (keyName === 'GROUP') {
      return 'GOLONGAN';
    } else if (keyName === 'BASE SALARY') {
      return 'GAJI UMR';
    } else if (keyName === 'ACTIVE DATE') {
      return 'TANGGAL MULAI KERJA';
    } else {
      return keyName;
    }
  }
}
