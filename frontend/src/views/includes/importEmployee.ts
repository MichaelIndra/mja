import { IEmployee } from '@/common/interfaces/employee';
import { InitQuery, IQuery } from '@/common/interfaces/query';
import { ExcelDateToJSDate, formatDate } from '@/common/utils/config';
import { ErrorStore } from '@/store/modules/catchError';
import { EmployeeStore } from '@/store/modules/employee';
import moment from 'moment';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import XLSX from 'xlsx';

@Component({
  name: 'ImportEmployee',
})
export default class ImportEmployee extends Vue {
  options: any = {};
  dialogInfo: boolean = false;
  failImport: boolean = false;
  postFile: any = {
    file: null,
    fileName: 'Import file .xls ',
    fileSize: 0,
    dataItems: [],
    dataImported: {},
    failDataItems: {},
  };
  headersImported: any[] = [
    { text: 'NIK', value: 'nik' },
    { text: 'Nama', value: 'name' },
    { text: 'Departemen', value: 'department' },
    { text: 'Golongan', value: 'group' },
    { text: 'Area', value: 'area' },
    { text: 'Posisi', value: 'skill' },
  ];
  emptyInputData: boolean = false;
  headersErrorList: any[] = [
    { text: 'NIK', value: 'nik' },
    { text: 'Nama', value: 'name' },
    { text: 'Tempat,Tanggal Lahir', value: 'date_of_birth' },
    { text: 'Alamat', value: 'address' },
    { text: 'Departemen', value: 'department' },
    { text: 'Golongan', value: 'group' },
    { text: 'Area', value: 'area' },
    { text: 'Posisi', value: 'skill' },
    { text: 'Tanggal Masuk', value: 'date_active' },
  ];
  employeeParams: IQuery = {
    ...InitQuery,
    filters: [
      {
        field: 'department',
        value: 'join',
      },
      {
        field: 'group',
        value: 'join',
      },
    ],
  };
  error: any = {
    status: false,
    message: '',
  };
  tempListError: any = [];
  headers: any = [
    { text: 'NIK', value: 'nik' },
    { text: 'Nama Karyawan', value: 'name' },
    { text: 'Departemen', value: 'department' },
    { text: 'Golongan', value: 'group' },
    { text: 'Area', value: 'area' },
    { text: 'Posisi', value: 'position' },
  ];
  errorListEmployee: any = [];

  // GETTERS
  get isLoading(): boolean {
    return EmployeeStore.isLoadingEmployee;
  }

  get listEmployee(): IEmployee[] {
    return EmployeeStore.listEmployee;
  }

  get employee(): any {
    return EmployeeStore.employee;
  }

  get listImportedEmployee(): IEmployee[] {
    return this.postFile.dataItems;
  }

  get listFailImportedEmployee(): IEmployee[] {
    return this.postFile.failDataItems;
  }

  get errorData(): any {
    return ErrorStore.errorData;
  }

  @Watch('errorData.message')
  checkErrorMessage() {
    this.tempListError = this.errorData.data.map((el: any) => {
      return {
        nik: el.nik,
        name: el.name,
        department: el.department,
        group: el.group,
        area: el.area,
        posisi: el.skill,
      };
    });
  }

  // MOUNTED
  mounted() {
    this.postFile.dataItems = [];
    this.clearError();
    this.getListEmployee(this.employeeParams);
  }

  clearError() {
    ErrorStore.clearErrorData();
  }

  getListEmployee(params: any) {
    EmployeeStore.getAllEmployee(params);
  }

  importSheets(event: any) {
    this.postFile.dataItems = [];
    this.errorListEmployee = [];
    let file;
    const files = event;
    if (!files || files.length === 0) {
      return;
    }
    file = files[0];
    let file_type = files[0].name.split('.');
    file_type = file_type[1];
    if (file_type === '.csv') {
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt: any) => {
      // pre-process data
      let binary = '';
      let bytes: any = '';
      if (evt.target != null) {
        if (evt.target.result) {
          bytes = new Uint8Array(evt.target.result);
        } else {
          return;
        }
      }
      const length = bytes.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      /* read workbook */
      const wb = XLSX.read(binary, { type: 'binary' });

      /* grab first sheet */
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];

      const JSON = XLSX.utils.sheet_to_json(ws);
      this.postFile.dataImported = JSON;
      this.postFile.dataItems = JSON.map((el: any, index: number) => {
        if (el.Nama === undefined) {
          this.errorListEmployee.push({
            type: 'name',
            message: 'Data nama tidak lengkap pada baris ke ' + (index + 2),
          });
        } else if (el.NIK === undefined) {
          this.errorListEmployee.push({
            type: 'nik',
            message: 'Data NIK tidak lengkap pada baris ke ' + (index + 2),
          });
        } else if (el['Tempat Lahir'] === undefined) {
          this.errorListEmployee.push({
            type: 'birth_place',
            message:
              'Data tempat lahir tidak lengkap pada baris ke ' + (index + 2),
          });
        } else if (
          el['Tanggal Lahir'] === undefined ||
          moment(
            formatDate(ExcelDateToJSDate(el['Tanggal Lahir']), 'input'),
            'M/D/YYYY',
            true,
          ).isValid()
        ) {
          this.errorListEmployee.push({
            type: 'date_birth',
            message:
              'Data tanggal lahir tidak lengkap pada baris ke ' + (index + 2),
          });
        } else if (el.Alamat === undefined) {
          this.errorListEmployee.push({
            type: 'address',
            message: 'Data alamat tidak lengkap pada baris ke ' + (index + 2),
          });
        } else if (el.Departemen === undefined) {
          this.errorListEmployee.push({
            type: 'department',
            message:
              'Data departemen tidak lengkap pada baris ke ' + (index + 2),
          });
        } else if (el.Golongan === undefined) {
          this.errorListEmployee.push({
            type: 'group',
            message: 'Data golongan tidak lengkap pada baris ke ' + (index + 2),
          });
        } else if (el.Area === undefined) {
          this.errorListEmployee.push({
            type: 'area',
            message: 'Data area tidak lengkap pada baris ke ' + (index + 2),
          });
        } else if (el.Posisi === undefined) {
          this.errorListEmployee.push({
            type: 'skill',
            message: 'Data skill tidak lengkap pada baris ke ' + (index + 2),
          });
        } else if (
          el['Tanggal Masuk'] === undefined ||
          moment(
            formatDate(ExcelDateToJSDate(el['Tanggal Masuk']), 'input'),
            'M/D/YYYY',
            true,
          ).isValid()
        ) {
          this.errorListEmployee.push({
            type: 'date_enter',
            message:
              'Data tanggal masuk tidak lengkap pada baris ke ' + (index + 2),
          });
        }
        const currentNik = el.NIK;
        const tglLahir = el['Tanggal Lahir'];
        const tglMulai = el['Tanggal Masuk'];
        return {
          nik: currentNik ? currentNik.toString().trim() : '',
          name: el.Nama ? el.Nama.toString().trim() : '',
          date_of_birth:
            el['Tempat Lahir'] || tglLahir
              ? (el['Tempat Lahir']
                  ? el['Tempat Lahir'].toString().trim()
                  : '') +
                '/' +
                (tglLahir
                  ? formatDate(ExcelDateToJSDate(tglLahir), 'input')
                  : '')
              : '',
          address: el.Alamat ? el.Alamat : '',
          phone_no: el['Nomor Telp'] ? el['Nomor Telp'].toString().trim() : '',
          department: el.Departemen ? el.Departemen.toString().trim() : '',
          group: el.Golongan ? el.Golongan.toString().trim() : '',
          area: el.Area ? el.Area.toString().trim() : '',
          skill: el.Posisi ? el.Posisi.toString().trim() : '',
          active: true,
          date_active: tglMulai
            ? formatDate(ExcelDateToJSDate(tglMulai), 'complete')
            : '',
          active_date: tglMulai
            ? new Date(ExcelDateToJSDate(tglMulai)).toISOString()
            : '',
          picture: '',
          bpjs_id: el['Nomor BPJS'] ? el['Nomor BPJS'] : '',
          npwp_id: el['Nomor NPWP'] ? el['Nomor NPWP'] : '',
        };
      });
    };
    reader.onerror = (evt) => {
      console.error(evt);
    };
    reader.readAsArrayBuffer(file);
  }

  cancelUpload() {
    this.$emit('cancelUpload');
  }

  async save() {
    if (this.postFile.dataItems.length === 0) {
      this.dialogInfo = true;
    } else {
      const bulkEmployee: any = [];
      this.postFile.dataItems.forEach((employee: any, index: number) => {
        const newEmployee: IEmployee = {
          ...employee,
          status: 'REGULER',
          meta: {
            rawData: this.postFile.dataImported[index],
            payslip: {
              value_holiday: 0,
              value_food_deduction: 0,
              value_bon_deduction: 0,
              value_extra_work: 0,
              value_driver_extra: 0,
              // additional value #246
              insentif: 0,
              extra_full: {
                nominal: 0,
                indicator: false,
              },
              value_day_7: {
                nominal: 0,
                indicator: false,
              },
              extra_sunday: {
                nominal: 0,
                indicator: false,
              },
              owner_special_insentif: 0,
              owner_additional: 0,
              owner_overtime: 0,
              astek_deduction: 0,
              spsi_deduction: 0,
            },
          },
        };
        bulkEmployee.push(newEmployee);
      });
      await EmployeeStore.saveBulkEmployee(bulkEmployee);
      this.$emit('successUpload');
    }
  }
}
