import { IEmployee } from '@/common/interfaces/employee';
import { IQuery } from '@/common/interfaces/query';
import { InitSnackbar } from '@/common/interfaces/snackbar';
import { detectEntries } from '@/common/utils/attendanceDetection';
import {
  calculateDateTime,
  formatDate,
  openSnackbarNow,
} from '@/common/utils/config';
import {
  calculateFixedTotalBreakWork,
  calculateFlexibleTotalBreakAndWork,
  convertDate,
  convertTime,
} from '@/common/utils/timeCalculation';
import { AttendanceStore } from '@/store/modules/attendance';
import { ErrorStore } from '@/store/modules/catchError';
import { EmployeeStore } from '@/store/modules/employee';
import { GroupStore } from '@/store/modules/group';
import { LeaveStore } from '@/store/modules/leave';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import XLSX from 'xlsx';

@Component({
  name: 'ImportAttendance',
})
export default class ImportAttendance extends Vue {
  errorListImport: any = [];
  emptyInputData: boolean = false;
  options: any = {};
  dialogInfo: boolean = false;
  snackbar: any = {};
  loading: boolean = false;
  postFile: any = {
    file: null,
    fileName: 'Import file .xls ',
    fileSize: 0,
    dataItems: [],
    dataImported: {},
    filteredAttendance: [],
    attendanceData: [],
    nik: [],
    absentsData: [],
  };
  headersImported: any[] = [
    { text: 'Nama', value: 'employeeName' },
    { text: 'Tanggal', value: 'date' },
    { text: 'Scan Masuk', value: 'timeCheckIn' },
    { text: 'Scan Mulai Istirahat', value: 'breakStart' },
    { text: 'Scan Selesai Isirahat', value: 'breakEnd' },
    { text: 'Scan Pulang', value: 'timeCheckOut' },
  ];
  employeeParams: IQuery = {
    filters: [
      {
        field: 'nik',
        operator: 'in',
        value: this.postFile.nik,
      },{
        field: 'active',
        operator: 'eq',
        value: 1,
      },
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

  // GETTERS
  get isLoading(): boolean {
    return AttendanceStore.isLoadingAttendance;
  }

  get errorData(): any {
    return ErrorStore.errorData;
  }

  get listBaseEmployee(): IEmployee[] {
    return EmployeeStore.listBaseEmployee;
  }

  get attendance(): any {
    return AttendanceStore.attendance;
  }
  get group(): any {
    return GroupStore.activeGroup;
  }

  get listImportedAttendance(): any {
    return this.postFile.filteredAttendance;
  }
  clearError() {
    ErrorStore.clearErrorData();
  }

  // MOUNTED
  mounted() {
    this.clearError();
    // this.getListEmployee(this.employeeParams);
  }

  async getListBaseEmployee(params: any) {
    await EmployeeStore.getBaseEmployee(params);
  }
  // validate import attendance fixed schedule
  async importAttendanceFixed(JSON: any) {
    // combine duplicate row into 1 row
    this.postFile.dataItems = await JSON.filter(
      (el: any) => el.NIK && el.NIK !== '' && el.Tanggal && el.Tanggal !== '',
    );
    this.postFile.dataItems = await this.postFile.dataItems.map(
      (el: any, idx: number) => {
        if (el.NIK === undefined || el.NIK === '') {
          this.errorListImport.push({
            type: 'nik',
            message: 'Data NIK tidak lengkap pada baris ke ' + (idx + 2),
          });
        }
        if (el.Tanggal === undefined || el.Tanggal === '' || !el.Tanggal) {
          this.errorListImport.push({
            type: 'tanggal',
            message: 'Data Tanggal tidak lengkap pada baris ke ' + (idx + 2),
          });
        }
        return {
          employeeNIK: el.NIK,
          employeeName: el.Nama,
          date: convertDate(el.Tanggal),
          timeCheckIn: convertTime(el['Scan Masuk']),
          timeCheckOut: convertTime(el['Scan Pulang']),
          rawData: el,
        };
      },
    );
    let index = 0;
    this.postFile.filteredAttendance = await this.postFile.dataItems.reduce(
      (acc: any, cv: any, idx: number) => {
        const i = acc.findIndex((x: any) => {
          return x.employeeNIK === cv.employeeNIK && x.rawDate === cv.date;
        });
        const newDate = cv.date;
        if (i === -1) {
          acc.push({
            idx: index,
            employeeName: cv.employeeName,
            employeeNIK: cv.employeeNIK,
            rawDate: cv.date,
            date: formatDate(newDate, 'input'),
            timeCheckIns: [cv.timeCheckIn],
            timeCheckOuts: [cv.timeCheckOut],
            timeCheckIn:
              cv.timeCheckIn.length === 5
                ? formatDate(newDate + ' ' + cv.timeCheckIn, 'timeShort')
                : '',
            timeCheckOut:
              cv.timeCheckOut.length === 5
                ? formatDate(newDate + ' ' + cv.timeCheckOut, 'timeShort')
                : '',
            rawTimeCheckIn: cv.timeCheckIn,
            rawTimeCheckOut: cv.timeCheckOut,
            meta: {
              employeeName: cv.employeeName,
              employeeNIK: cv.employeeNIK,
              rawDate: newDate,
              date: formatDate(newDate, 'input'),
              timeCheckIns: [cv.timeCheckIn],
              timeCheckOuts: [cv.timeCheckOut],
              entries: [
                cv.timeCheckIn.length === 5
                  ? formatDate(newDate + ' ' + cv.timeCheckIn, 'timeShort')
                  : '',
                cv.timeCheckOut.length === 5
                  ? formatDate(newDate + ' ' + cv.timeCheckOut, 'timeShort')
                  : '',
              ],
              timeCheckIn:
                cv.timeCheckIn.length === 5
                  ? formatDate(newDate + ' ' + cv.timeCheckIn, 'timeShort')
                  : '',
              timeCheckOut:
                cv.timeCheckOut.length === 5
                  ? formatDate(newDate + ' ' + cv.timeCheckOut, 'timeShort')
                  : '',
              rawTimeCheckIn: cv.timeCheckIn,
              rawTimeCheckOut: cv.timeCheckOut,
            },
          });
          index++;
        } else {
          // TODO: check for errors
          acc[i].timeCheckIns.push(cv.timeCheckIn);
          acc[i].timeCheckOuts.push(cv.timeCheckOut);
          acc[i].meta.timeCheckIns.push(cv.timeCheckIn);
          acc[i].meta.timeCheckOuts.push(cv.timeCheckOut);
          acc[i].meta.entries.push(
            cv.timeCheckIn.length === 5
              ? formatDate(newDate + ' ' + cv.timeCheckIn, 'timeShort')
              : '',
          );
          acc[i].meta.entries.push(
            cv.timeCheckOut.length === 5
              ? formatDate(newDate + ' ' + cv.timeCheckOut, 'timeShort')
              : '',
          );
          // choose time for break start or check in
          if (acc[i].rawTimeCheckIn < cv.timeCheckIn) {
            acc[i].timeCheckIn =
              acc[i].rawTimeCheckIn.length === 5
                ? formatDate(
                    acc[i].rawDate + ' ' + acc[i].rawTimeCheckIn,
                    'timeShort',
                  )
                : '';
            acc[i].breakEnd =
              cv.timeCheckIn.length === 5
                ? formatDate(acc[i].rawDate + ' ' + cv.timeCheckIn, 'timeShort')
                : '';
          } else {
            const time = acc[i].rawTimeCheckIn;
            acc[i].timeCheckIn =
              cv.timeCheckIn.length === 5
                ? formatDate(acc[i].rawDate + ' ' + cv.timeCheckIn, 'timeShort')
                : '';
            acc[i].breakEnd =
              time.length === 5
                ? formatDate(acc[i].rawDate + ' ' + time, 'timeShort')
                : '';
          }
          // choose time for break end or check out
          if (acc[i].rawTimeCheckOut > cv.timeCheckOut) {
            acc[i].timeCheckOut =
              acc[i].rawTimeCheckOut.length === 5
                ? formatDate(
                    acc[i].rawDate + ' ' + acc[i].rawTimeCheckOut,
                    'timeShort',
                  )
                : '';
            acc[i].breakStart =
              cv.timeCheckOut.length === 5
                ? formatDate(
                    acc[i].rawDate + ' ' + cv.timeCheckOut,
                    'timeShort',
                  )
                : '';
          } else {
            const time = acc[i].rawTimeCheckOut;
            acc[i].timeCheckOut =
              cv.timeCheckOut.length === 5
                ? formatDate(
                    acc[i].rawDate + ' ' + cv.timeCheckOut,
                    'timeShort',
                  )
                : '';
            acc[i].breakStart =
              time.length === 5
                ? formatDate(acc[i].rawDate + ' ' + time, 'timeShort')
                : '';
          }
        }
        return acc;
      },
      [],
    );
    // remove a row if all time column empty, count it as absent
    this.postFile.filteredAttendance = await this.postFile.filteredAttendance.filter(
      (el: any, idx: number) => {
        if (
          !el.timeCheckIn &&
          !el.timeCheckOut &&
          !el.breakStart &&
          !el.breakEnd
        ) {
          this.postFile.absentsData.push(el);
          return false;
        } else if (
          !el.timeCheckIn ||
          !el.timeCheckOut ||
          !el.breakStart ||
          !el.breakEnd
        ) {
          const listColumn = [];
          if (!el.timeCheckIn) {
            listColumn.push('jam masuk');
          }
          if (!el.timeCheckOut) {
            listColumn.push('jam pulang');
          }
          if (!el.breakStart) {
            listColumn.push('jam mulai istirahat');
          }
          if (!el.breakEnd) {
            listColumn.push('jam selesai istirahat');
          }
          this.errorListImport.push({
            type: 'entries-' + el.employeeNIK,
            message: `Data [${listColumn.join(', ')}] pada ${
              el.date
            } tidak ada untuk karyawan "${el.employeeName}"`,
          });
        } else {
          return el;
        }
      },
    );

    index = 0;
    this.postFile.nik = await this.postFile.filteredAttendance.reduce(
      (acc: any, cv: any) => {
        const i = acc.findIndex((x: any) => {
          return String(x) === String(cv.employeeNIK);
        });
        if (i === -1) {
          if (String(cv.employeeNIK) && String(cv.employeeNIK).length > 0) {
            acc.push(String(cv.employeeNIK).trim());
            index++;
          }
        }
        return acc;
      },
      [],
    );
    this.employeeParams.filters = await this.employeeParams.filters.map(
      (el: any) => {
        if (el.operator && el.field === 'nik') {
          el.value = this.postFile.nik.toString();
        }
        return el;
      },
    );
    await this.getListBaseEmployee(this.employeeParams);
    if (this.listBaseEmployee.length > 0) {
      this.errorListImport = this.mapEmployeeToError(
        this.errorListImport,
        this.listBaseEmployee,
      );
      this.postFile.filteredAttendance = await this.postFile.filteredAttendance.map(
        (item: any) => {
          const findEmployee: any = this.listBaseEmployee.find((el: any) => {
            return el.nik.toString() === item.employeeNIK.toString();
          });
          const timeEntries: any = [];
          if (item.meta.entries.length >= 4) {
            for (const attendanceEntries of item.meta.entries) {
              const date = item.meta.date;
              timeEntries.push(
                formatDate(
                  new Date(date + ' ' + attendanceEntries + ':00').toString(),
                  'dateTimeShort',
                ),
              );
            }
            timeEntries.sort();
            if (findEmployee) {
              // replace with name from employee list
              item.employeeNameFromExcel = item.employeeName;
              item.employeeName = findEmployee.name;
              const currentSchedule = findEmployee.group.schedule.schedules.find(
                (el: any) => {
                  return el.value === new Date(timeEntries[0]).getDay();
                },
              );
              if (currentSchedule) {
                const schedules = {
                  time_check_in: currentSchedule.start_one,
                  time_check_out: currentSchedule.start_two,
                  time_break_start: currentSchedule.end_one,
                  time_break_end: currentSchedule.end_two,
                  is_break_flexible: currentSchedule.flexible_break,
                };
                const fixedEntries = detectEntries(timeEntries, schedules);
                if (fixedEntries) {
                  item = {
                    ...item,
                    breakStart: formatDate(
                      fixedEntries.time_break_start,
                      'timeShort',
                    ),
                    breakEnd: formatDate(
                      fixedEntries.time_break_end,
                      'timeShort',
                    ),
                    timeCheckIn: formatDate(
                      fixedEntries.time_check_in,
                      'timeShort',
                    ),
                    timeCheckOut: formatDate(
                      fixedEntries.time_check_out,
                      'timeShort',
                    ),
                  };
                }
              } else {
                this.errorListImport.push({
                  type: 'schedule',
                  message: 'Jadwal harian tidak di temukan',
                });
              }
              item = {
                ...item,
                group_id: findEmployee.group_id,
                group_name: findEmployee.group.name,
                area_id: findEmployee.area_id,
                department_id: findEmployee.department_id,
                department_name: findEmployee.department.name,
                department_meta: findEmployee.department.meta,
                schedules: findEmployee.group.schedule.schedules,
                status: true,
              };
            } else {
              item = {
                ...item,
                status: false,
              };
              this.errorListImport.push({
                type: 'employee',
                message:
                  'Ada karyawan yang belum terdaftar, cek karyawan dengan nik ' +
                  item.employeeNIK,
              });
            }
          }
          return item;
        },
      );
    } else {
      this.errorListImport.push({
        type: 'employee',
        message: 'Data karyawan kosong',
      });
    }
  }

  checkTimeSequence(
    timeCheckIn: any,
    breakStart: any,
    breakEnd: any,
    timeCheckOut: any,
    row: number,
  ) {
    const result = {
      timeCheckInFalse: false,
      timeCheckOutFalse: false,
      breakStartFalse: false,
      breakEndFalse: false,
    };
    breakEnd <= timeCheckIn ||
    breakEnd <= breakStart ||
    breakEnd >= timeCheckOut
      ? (result.breakEndFalse = true)
      : (result.breakEndFalse = false);

    timeCheckOut <= breakStart ||
    timeCheckOut <= breakEnd ||
    timeCheckOut <= timeCheckIn
      ? (result.timeCheckOutFalse = true)
      : (result.timeCheckOutFalse = false);

    breakStart <= timeCheckIn ||
    breakStart >= breakEnd ||
    breakStart >= timeCheckOut
      ? (result.breakStartFalse = true)
      : (result.breakStartFalse = false);

    timeCheckIn >= breakStart ||
    timeCheckIn >= breakEnd ||
    timeCheckIn >= timeCheckOut
      ? (result.timeCheckInFalse = true)
      : (result.timeCheckOutFalse = false);

    if (
      result.timeCheckInFalse ||
      result.timeCheckOutFalse ||
      result.breakEndFalse ||
      result.breakStartFalse
    ) {
      this.snackbar = {
        ...InitSnackbar,
        value: true,
        message: 'Selisih waktu tidak wajar, cek item berwarna merah',
        color: 'warn',
      };
      openSnackbarNow(this.snackbar);
      this.errorListImport.push({
        type: 'waktu',
        message: 'Selisih waktu tidak wajar pada baris: ' + row,
      });
    }
    return result;
  }

  async importAttendanceFlexible(JSON: any) {
    this.postFile.filteredAttendance = await JSON.filter((el: any) => {
      return el.NIK && el.NIK !== '' && el.Tanggal && el.Tanggal !== '';
    });
    this.postFile.filteredAttendance = await JSON.map(
      (el: any, idx: number) => {
        const checkInEntries = [];
        const checkOutEntries = [];
        const timeEntries = [];
        let tanggal = '';

        // validate empty cell
        if (el.NIK === undefined || el.NIK === '') {
          this.errorListImport.push({
            type: 'nik',
            message: 'Data NIK tidak lengkap pada baris ke ' + (idx + 2),
          });
        }
        if (el.Tanggal === undefined || el.Tanggal === '' || !el.Tanggal) {
          this.errorListImport.push({
            type: 'tanggal',
            message: 'Data Tanggal tidak lengkap pada baris ke ' + (idx + 2),
          });
        } else {
          tanggal = convertDate(el.Tanggal);
          if (
            !this.validateInput(el['Scan Masuk 1']) &&
            !this.validateInput(el['Scan Pulang 1']) &&
            !this.validateInput(el['Scan Masuk 1']) &&
            !this.validateInput(el['Scan Pulang 2']) &&
            !this.validateInput(el['Scan Masuk 2']) &&
            !this.validateInput(el['Scan Pulang 3']) &&
            !this.validateInput(el['Scan Masuk 3']) &&
            !this.validateInput(el['Scan Pulang 4']) &&
            !this.validateInput(el['Scan Masuk 4']) &&
            !this.validateInput(el['Scan Pulang 5']) &&
            !this.validateInput(el['Scan Masuk 5'])
          ) {
            this.postFile.absentsData.push({
              employeeNIK: el.NIK,
              date: tanggal,
            });
            return false;
          } else {
            if (this.validateInput(el['Scan Masuk 1'])) {
              checkInEntries.push(convertTime(el['Scan Masuk 1']));
              timeEntries.push(
                formatDate(tanggal + ' ' + el['Scan Masuk 1'], 'timeShort'),
              );
            } else {
              this.errorListImport.push({
                type: 'scan_masuk_1 ',
                message:
                  'Scan Masuk 1 tidak lengkap pada baris ke ' + (idx + 2),
              });
            }
            if (this.validateInput(el['Scan Pulang 1'])) {
              checkOutEntries.push(convertTime(el['Scan Pulang 1']));
              timeEntries.push(
                formatDate(tanggal + ' ' + el['Scan Pulang 1'], 'timeShort'),
              );
            } else {
              this.errorListImport.push({
                type: 'scan_pulang_1',
                message:
                  'Scan Pulang 1 tidak lengkap pada baris ke ' + (idx + 2),
              });
            }
            if (this.validateInput(el['Scan Masuk 2'])) {
              checkInEntries.push(convertTime(el['Scan Masuk 2']));
              timeEntries.push(
                formatDate(tanggal + ' ' + el['Scan Masuk 2'], 'timeShort'),
              );
            } else {
              this.errorListImport.push({
                type: 'scan_masuk_2',
                message:
                  'Scan Masuk 2 tidak lengkap pada baris ke ' + (idx + 2),
              });
            }
            if (this.validateInput(el['Scan Pulang 2'])) {
              checkOutEntries.push(convertTime(el['Scan Pulang 2']));
              timeEntries.push(
                formatDate(tanggal + ' ' + el['Scan Pulang 2'], 'timeShort'),
              );
            } else {
              this.errorListImport.push({
                type: 'scan_pulang_2',
                message:
                  'Scan Pulang 2 tidak lengkap pada baris ke ' + (idx + 2),
              });
            }
            if (this.validateInput(el['Scan Masuk 3'])) {
              checkInEntries.push(convertTime(el['Scan Masuk 3']));
              timeEntries.push(
                formatDate(tanggal + ' ' + el['Scan Masuk 3'], 'timeShort'),
              );
            }
            if (this.validateInput(el['Scan Pulang 3'])) {
              checkOutEntries.push(convertTime(el['Scan Pulang 3']));
              timeEntries.push(
                formatDate(tanggal + ' ' + el['Scan Pulang 3'], 'timeShort'),
              );
            }
            if (this.validateInput(el['Scan Masuk 4'])) {
              checkInEntries.push(convertTime(el['Scan Masuk 4']));
              timeEntries.push(
                formatDate(tanggal + ' ' + el['Scan Masuk 4'], 'timeShort'),
              );
            }
            if (this.validateInput(el['Scan Pulang 4'])) {
              checkOutEntries.push(convertTime(el['Scan Pulang 4']));
              timeEntries.push(
                formatDate(tanggal + ' ' + el['Scan Pulang 4'], 'timeShort'),
              );
            }
            if (this.validateInput(el['Scan Masuk 5'])) {
              checkInEntries.push(convertTime(el['Scan Masuk 5']));
              timeEntries.push(
                formatDate(tanggal + ' ' + el['Scan Masuk 5'], 'timeShort'),
              );
            }
            if (this.validateInput(el['Scan Pulang 5'])) {
              checkOutEntries.push(convertTime(el['Scan Pulang 5']));
              timeEntries.push(
                formatDate(tanggal + ' ' + el['Scan Pulang 5'], 'timeShort'),
              );
            }
            return {
              employeeNIK: el.NIK,
              employeeName: el.Nama,
              date: tanggal,
              timeCheckIn: convertTime(el['Scan Masuk 1']),
              breakStart: convertTime(el['Scan Pulang 1']),
              breakEnd: convertTime(el['Scan Masuk 2']),
              timeCheckOut: convertTime(el['Scan Pulang 2']),
              timeCheckIns: checkInEntries,
              timeCheckOuts: checkOutEntries,
              entries: timeEntries,
              rawData: el,
              meta: {
                employeeName: el.Nama,
                employeeNIK: el.NIK,
                date: formatDate(tanggal, 'input'),
                timeCheckIns: checkInEntries,
                timeCheckOuts: checkOutEntries,
                entries: timeEntries,
                timeCheckIn: formatDate(
                  tanggal + ' ' + el['Scan Masuk 1'],
                  'timeShort',
                ),
                timeCheckOut: formatDate(
                  tanggal + ' ' + el['Scan Pulang 2'],
                  'timeShort',
                ),
                breakStart: formatDate(
                  tanggal + ' ' + el['Scan Pulang 1'],
                  'timeShort',
                ),
                breakEnd: formatDate(
                  tanggal + ' ' + el['Scan Masuk 2'],
                  'timeShort',
                ),
              },
            };
          }
        }
      },
    );
    // remove empty time data and count as absent data
    this.postFile.filteredAttendance = this.postFile.filteredAttendance.filter(
      (el: any) => {
        return el ? el : false;
      },
    );
    // check for same date and NIK
    const uniqueData = this.postFile.filteredAttendance.reduce(
      (acc: any, cv: any, idx: number, arr: any) => {
        const i = acc.findIndex((x: any) => {
          return (
            String(x.employeeNIK) === String(cv.employeeNIK) &&
            x.date === cv.date
          );
        });
        if (i === -1) {
          if (String(cv.employeeNIK) && String(cv.employeeNIK).length > 0) {
            acc.push(cv);
          }
        } else {
          this.errorListImport.push({
            type: 'duplicate',
            message: 'Data Ganda pada baris ke:' + (idx + 2),
          });
        }
        return acc;
      },
      [],
    );
    this.postFile.nik = await this.postFile.filteredAttendance.reduce(
      (acc: any, cv: any) => {
        const i = acc.findIndex((x: any) => {
          return String(x) === String(cv.employeeNIK);
        });
        if (i === -1) {
          if (String(cv.employeeNIK) && String(cv.employeeNIK).length > 0) {
            acc.push(String(cv.employeeNIK).trim());
          }
        }
        return acc;
      },
      [],
    );
    this.employeeParams.filters = await this.employeeParams.filters.map(
      (el: any) => {
        if (el.operator && el.field === 'nik') {
          el.value = this.postFile.nik.toString();
        }
        return el;
      },
    );
    await this.getListBaseEmployee(this.employeeParams);
    if (this.listBaseEmployee.length > 0) {
      this.postFile.filteredAttendance = await this.postFile.filteredAttendance.map(
        (item: any, i: number) => {
          const findEmployee: any = this.listBaseEmployee.find((el: any) => {
            return el.nik.toString() === item.employeeNIK.toString();
          });
          const timeEntries: any = [];
          if (item.entries.length >= 4) {
            for (const attendanceEntries of item.entries) {
              const date = item.date;
              timeEntries.push(
                formatDate(
                  new Date(date + ' ' + attendanceEntries + ':00').toString(),
                  'dateTimeShort',
                ),
              );
            }
            timeEntries.sort();
            if (findEmployee) {
              item.employeeNameFromExcel = item.employeeName;
              item.employeeName = findEmployee.name;
              const currentSchedule = findEmployee.group.schedule.schedules.find(
                (el: any) => {
                  return el.value === new Date(timeEntries[0]).getDay();
                },
              );
              if (currentSchedule) {
                const schedules = {
                  time_check_in: currentSchedule.start_one,
                  time_check_out: currentSchedule.start_two,
                  time_break_start: currentSchedule.end_one,
                  time_break_end: currentSchedule.end_two,
                  is_break_flexible: currentSchedule.flexible_break,
                };
                const fixedEntries = detectEntries(timeEntries, schedules);
                if (fixedEntries) {
                  const sequenceResult = this.checkTimeSequence(
                    item.timeCheckIn,
                    item.breakStart,
                    item.breakEnd,
                    item.timeCheckOut,
                    i + 1,
                  );
                  if (sequenceResult) {
                    item = {
                      ...item,
                      timeCheckInFalse: sequenceResult.timeCheckInFalse,
                      timeCheckOutFalse: sequenceResult.timeCheckOutFalse,
                      breakStartFalse: sequenceResult.breakStartFalse,
                      breakEndFalse: sequenceResult.breakEndFalse,
                    };
                  }
                }
              } else {
                this.errorListImport.push({
                  type: 'schedule',
                  message:
                    'Jadwal harian tidak di temukan, Nik:' + findEmployee.nik,
                });
              }
              item = {
                ...item,
                group_id: findEmployee.group_id,
                group_name: findEmployee.group.name,
                area_id: findEmployee.area_id,
                department_id: findEmployee.department_id,
                department_name: findEmployee.department.name,
                department_meta: findEmployee.department.meta,
                schedules: findEmployee.group.schedule.schedules,
                status: true,
              };
            } else {
              item = {
                ...item,
                status: false,
              };
              this.errorListImport.push({
                type: 'employee',
                message:
                  'Ada karyawan yang belum terdaftar, cek baris ke ' + (i + 1),
              });
            }
          }
          return item;
        },
      );
    } else {
      this.errorListImport.push({
        type: 'employee',
        message: 'Data karyawan kosong',
      });
    }
  }

  validateInput(input: any) {
    if (typeof input !== 'string' && !input && input !== '') {
      const snackbar = {
        ...InitSnackbar,
        value: true,
        message: 'Format jam harus text, contoh: 12:59:00',
        color: 'error',
      };
      openSnackbarNow(snackbar);
      return false;
    } else {
      const rawTime = input.split(':');
      if (rawTime.length < 2 || rawTime.length > 3) {
        return false;
      } else {
        return !rawTime.find((el: any) => {
          return el.length !== 2;
        });
      }
    }
  }
  formatDate(date: any, type: string) {
    return formatDate(date, type);
  }
  async importSheets(event: any) {
    this.loading = true;
    this.errorListImport = [];
    this.errorData.status = 200;
    this.postFile.dataItems = [];
    this.postFile.absentsData = [];
    let file;
    const files = event;
    // console.info('event',event);
    if (!files || files.length === 0) {
      this.postFile.filteredAttendance = [];
      // TODO: warn user to pick file
      return false;
    }
    AttendanceStore.SET_LOADING_ATTENDANCE(true);
    const file_type = files[0].name.split('.');
    file = files[0];
    const reader = new FileReader();
    reader.onload = async (evt: any) => {
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
      let findColumn = '';
      JSON.find((el: any) => {
        if (el.NIK && el.Tanggal && el['Scan Masuk'] && el['Scan Pulang']) {
          findColumn = 'Fixed';
        }
        if (
          el.NIK &&
          el.Tanggal &&
          el['Scan Masuk 1'] &&
          el['Scan Pulang 1'] &&
          el['Scan Masuk 2'] &&
          el['Scan Pulang 2']
        ) {
          findColumn = 'Flexible';
        }
      });
      // TODO: validate if date beyond current datetime
      JSON.forEach((el:any, idx:number)=> {
        if (el.Tanggal) {
          const date = convertDate(el.Tanggal);
          if (new Date(date).getTime() > new Date().getTime()) {
            this.errorListImport.push({
              type: 'date',
              message: 'Tanggal lebih dari tanggal hari ini, pada baris ke ' + (idx + 2),
            });
          }
        } else {
          this.errorListImport.push({
            type: 'date',
            message: 'Tanggal kosong pada baris ke ' + (idx + 2),
          });
        }
      });
      // separate import based on header column
      if (findColumn === 'Fixed') {
        try {
          await this.importAttendanceFixed(JSON);
        } catch (err) {
          console.error(err);
        }
      } else if (findColumn === 'Flexible') {
        await this.importAttendanceFlexible(JSON);
      } else {
        // excel header format not match
      }
      AttendanceStore.SET_LOADING_ATTENDANCE(false);
    };

    reader.onerror = (evt) => {
      console.error(evt);
    };
    await reader.readAsArrayBuffer(file);
    this.loading = false;
  }
  cancelUpload() {
    AttendanceStore.SET_LOADING_ATTENDANCE(false);
    this.$emit('cancelUpload');
  }

  async save() {
    if (this.postFile.filteredAttendance.length === 0) {
      this.dialogInfo = true;
    } else {
      const bulkAttendance: any = [];
      const bulkLeaves: any = [];
      this.postFile.filteredAttendance.forEach((attendance: any) => {
        const employeeData: any = this.listBaseEmployee.find((item: any) => {
          return item.nik === attendance.employeeNIK;
          // ? item.id
          // : { id: attendance.employeeNIK };
        });
        const date = formatDate(attendance.date, 'input');
        const currentSchedule =
          attendance.schedules[new Date(attendance.date).getDay()];
        let totalDuration: any;
        const newAttendance: any = {
          employee_nik: attendance.employeeNIK.toString(),
          employee_id: employeeData.id,
          date,
          time_check_in: calculateDateTime(date, attendance.timeCheckIn),
          time_check_out_for_break: calculateDateTime(
            date,
            attendance.breakStart,
          ),
          time_check_in_for_break: calculateDateTime(date, attendance.breakEnd),
          time_check_out: calculateDateTime(date, attendance.timeCheckOut),
          entries: attendance.entries,
          meta: {
            rawData: attendance.meta,
            group_id: attendance.group_id,
            department_id: attendance.department_id,
            area_id: attendance.area_id,
            position_id: attendance.position_id,
          },
        };
        switch (attendance.department_meta.payslip_filter) {
          case 1:
            switch (Number(attendance.department_meta.payslip_type)) {
              // weekly fixed schedule
              case 1:
                totalDuration = calculateFixedTotalBreakWork(
                  newAttendance,
                  currentSchedule,
                );
                break;
              //  weekly flexible schedule
              case 2:
                totalDuration = calculateFlexibleTotalBreakAndWork(
                  attendance.meta,
                  currentSchedule,
                  attendance.department_meta.payslip_filter,
                  attendance.department_meta.payslip_type,
                );
                break;
              default:
            }
            break;
          //  monthly flexible schedule
          case 2:
            totalDuration = calculateFlexibleTotalBreakAndWork(
              attendance.meta,
              currentSchedule,
              attendance.department_meta.payslip_filter,
              attendance.department_meta.payslip_type,
            );
            break;
          default:
        }
        newAttendance.meta = {
          ...newAttendance.meta,
          totalLate: totalDuration.totalLate,
          totalOvertimeEarly: totalDuration.totalOvertimeEarly,
          totalOvertime: totalDuration.totalOvertime,
          totalOvertimeValidation: totalDuration.totalOvertimeValidation,
          totalWork: totalDuration.totalWorkingHour,
          totalBreak: totalDuration.totalBreakInHour,
          totalLeave: totalDuration.totalLeave,
          time_check_in_late: totalDuration.time_check_in_late,
          time_check_out_for_break_early:
            totalDuration.time_check_out_for_break_early,
          time_check_in_for_break_late:
            totalDuration.time_check_in_for_break_late,
          time_check_out_early: totalDuration.time_check_out_early,
          schedule: totalDuration.schedule,
          group_meta: employeeData.group,
        };
        bulkAttendance.push(newAttendance);
      });
      this.postFile.absentsData.forEach((absentItem: any) => {
        const employeeNIK = absentItem.employeeNIK;
        const employeeData = this.listBaseEmployee.find((el: any) => {
          return el.nik === employeeNIK;
        });
        const dateAbsent = absentItem.date;
        if (employeeData) {
          const newAbsent = {
            employee_id: employeeData.id,
            description: 'Izin (default)',
            date_start: new Date(dateAbsent + ' ' + '00:00:00').toISOString(),
            date_end: new Date(dateAbsent + ' ' + '23:59:59').toISOString(),
          };
          bulkLeaves.push(newAbsent);
        }
      });
      try {
        await AttendanceStore.setLoading(true);
        if (bulkLeaves.length > 0) {
          await LeaveStore.saveBulkLeave(bulkLeaves);
        }
        await AttendanceStore.saveBulkAttendance(bulkAttendance);
        this.$emit('successUpload');
      } catch (err) {
        await AttendanceStore.setLoading(false);
      }
    }
  }

  isDateTimeValid(date: any): boolean {
    return (
      !date ||
      (date && (date.length !== 5 || date.toLowerCase() === 'invalid date'))
    );
  }

  mapEmployeeToError(listError: any[], listEmployee: any[]) {
    return listError.map((item: any) => {
      if (item.type.includes('entries')) {
        const exp = item.type.split('-');
        const nik = exp[1];
        const employee = listEmployee.find(
          (el: any) => String(el.nik) === String(nik),
        );
        if (employee) {
          let additionalMessage;
          if (!item.message.includes(employee.nik)) {
            additionalMessage = `karyawan atas nama "${employee.name}"`;
          }
          item = {
            ...item,
            employee,
            additionalMessage,
          };
        }
      }
      return item;
    });
  }
}
