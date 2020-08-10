import { InitSnackbar, ISnackbar } from '@/common/interfaces/snackbar';
import { getToken } from '@/common/utils/cookies';
import { decodeToken } from '@/common/utils/jwt';
import router from '@/router';
import { AuthModule } from '@/store/modules/auth';
import { ErrorStore, InitErrorData } from '@/store/modules/catchError';
import { InitNotifData, NotifStore } from '@/store/modules/notification';
import { SettingsStore } from '@/store/modules/settings';
import moment from 'moment';

export const getHeader = () => {
  const token = AuthModule.token;
  if (token) {
    const headers: any = {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    };
    return headers;
  }
};

export const setNotification = (data: any) => {
  let notification = InitNotifData;
  let snackbar = InitSnackbar;
  if (
    (data.config.url === `${process.env.VUE_APP_BASE_URL}/employees/bulk` ||
      data.config.url === `${process.env.VUE_APP_BASE_URL}/attendances/bulk`) &&
    data.status === 201
  ) {
    notification = {
      status: data.status,
      message: data.message,
      data: [],
    };
    snackbar = {
      ...InitSnackbar,
      value: true,
      message:
        'Sukses menambahkan data ' +
        (data.config.url.includes('employees')
          ? 'karyawan'
          : data.config.url.includes('attendances')
          ? 'kehadiran'
          : ''),
      color: 'success',
    };
    openSnackbarNow(snackbar);
    NotifStore.setNotifFetch(true);
    NotifStore.setNotifData(notification);
  }
};

export const setError = (data: any) => {
  let notification = InitErrorData;
  let snackbar = InitSnackbar;
  // console.info('errorRespornse',data);
  if (data.status) {
    notification = {
      status: data.status,
      message: data.message,
      data: data.data ? data.data : [],
    };
    const messages: any = data.message.split(' ');
    snackbar = {
      ...InitSnackbar,
      value: true,
      message:
        data.status === 404
          ? `${
              messages[0] === 'Login'
                ? 'Login ke sistem gagal, data tidak ditemukan'
                : 'Data tidak ditemukan'
            }`
          : data.message,
      color: 'error',
    };
    openSnackbarNow(snackbar);
    ErrorStore.setErrorFetch(true);
    ErrorStore.setErrorData(notification);
  } else if (data.statusCode) {
    let errorData = [];
    if (data.message && data.message.length > 0 && data.statusCode !== 409) {
      for (const item of data.message) {
        errorData.push({ field: item.property });
      }
    } else if (data.statusCode === 409) {
      errorData = data.message;
    }
    notification = {
      status: data.statusCode,
      message:
        data.statusCode === 400
          ? 'Ada kesalahan saat menambahkan/mengubah data'
          : data.statusCode === 500
          ? 'Ada Kesalahan pada server'
          : data.statusCode === 409
          ? 'Ada duplikasi data saat menambahkan'
          : data.statusCode === 406
          ? 'Ada data yang tidak sesuai'
          : 'Ada kesalahan',
      data: data.statusCode === 406 ? data.data : errorData,
    };
    snackbar = {
      ...InitSnackbar,
      value: true,
      message:
        data.statusCode === 400
          ? 'Ada kesalahan saat menambahkan data'
          : data.statusCode === 500
          ? 'Ada Kesalahan pada server'
          : data.statusCode === 409
          ? 'Ada duplikasi data saat menambahkan'
          : data.statusCode === 409
          ? 'Ada data yang tidak sesuai'
          : data.statusCode === 403
          ? 'Sesi login anda habis'
          : data.statusCode === 404
          ? 'Data tidak ditemukan'
          : data.statusCode === 406
          ? data.message
          : 'Ada kesalahan',
      color: 'error',
    };
    if (data.statusCode === 403) {
      AuthModule.LogoutUser();
      router.push({
        path: '/login',
      });
    }
    openSnackbarNow(snackbar);
    ErrorStore.setErrorForm(true);
    ErrorStore.setErrorData(notification);
  }
};

export const isAuth = () => {
  const item: any = getToken();
  return !!item;
};

export const isAdmin = () => {
  const item: any = getToken();
  const userData = decodeToken(item);
  const roles = userData ? userData.roles : [];
  if (roles && roles.length > 0) {
    return roles.find((el: any) => el === 'admin');
  } else {
    return false;
  }
};

export const isBranchHRP = () => {
  const item: any = getToken();
  const userData = decodeToken(item);
  const roles = userData ? userData.roles : [];
  if (roles && roles.length > 0) {
    return roles.find((el: any) => el === 'branch_hr_payroll');
  } else {
    return false;
  }
};

export const isBranchHRA = () => {
  const item: any = getToken();
  const userData = decodeToken(item);
  const roles = userData ? userData.roles : [];
  if (roles && roles.length > 0) {
    return roles.find((el: any) => el === 'branch_hr_attendance');
  } else {
    return false;
  }
};

export const isBranchManager = () => {
  const item: any = getToken();
  const userData = decodeToken(item);
  const roles = userData ? userData.roles : [];
  if (roles && roles.length > 0) {
    return roles.find((el: any) => el === 'branch_manager');
  } else {
    return false;
  }
};

export const isGeneralHRP = () => {
  const item: any = getToken();
  const userData = decodeToken(item);
  const roles = userData ? userData.roles : [];
  if (roles && roles.length > 0) {
    return roles.find((el: any) => el === 'general_hr_payroll');
  } else {
    return false;
  }
};

export const isGeneralHRA = () => {
  const item: any = getToken();
  const userData = decodeToken(item);
  const roles = userData ? userData.roles : [];
  if (roles && roles.length > 0) {
    return roles.find((el: any) => el === 'general_hr_attendance');
  } else {
    return false;
  }
};

export const isGeneralManager = () => {
  const item: any = getToken();
  const userData = decodeToken(item);
  const roles = userData ? userData.roles : [];
  if (roles && roles.length > 0) {
    return roles.find((el: any) => el === 'general_manager');
  } else {
    return false;
  }
};

export const isOwner = () => {
  const item: any = getToken();
  const userData = decodeToken(item);
  const roles = userData ? userData.roles : [];
  if (roles && roles.length > 0) {
    return roles.find((el: any) => el === 'owner');
  } else {
    return false;
  }
};

export const fullName = (first_name: string, last_name: string) => {
  if (last_name) {
    return first_name + ' ' + last_name;
  } else {
    return first_name;
  }
};

export const formatPrice = (value: string | number) => {
  if (!Number(value)) {
    return 'Rp0,00';
  } else {
    const val = (Number(value) / 1).toFixed(0).replace('.', ',');
    return 'Rp' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
};

export const formatPricePayslip = (value: string | number) => {
  if (!Number(value)) {
    return '0,00';
  } else {
    const val = (Number(value) / 1).toFixed(0).replace('.', ',');
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',00';
  }
};

export const openSnackbarNow = (snackbar: ISnackbar) => {
  SettingsStore.showSnackbar(snackbar);
  setTimeout(() => {
    SettingsStore.closeSnackbar();
  }, snackbar.timeout);
};

export const splitTimeStart = (date: string) => {
  const a = date.split(' - ');
  return a[0];
};

export const splitTimeEnd = (date: string) => {
  const a = date.split(' - ');
  return a[1];
};

export const splitDateOfBirth = (data: string) => {
  return data.split('/');
};

export const mergeTime = (start: string, end: string) => start + ' - ' + end;

export const formatDate = (value: string | Date, type: string) => {
  if (type === 'short') {
    return moment(value)
      .locale('id')
      .format('DD-MM-YY');
  } else if (type === 'short-date') {
    return moment(value)
      .locale('id')
      .format('DD-MM-YYYY');
  } else if (type === 'short-dateTime') {
    return moment(value)
      .locale('id')
      .format('DD-MM-YYYY HH:mm');
  } else if (type === 'medium') {
    return moment(value)
      .locale('id')
      .format('DD MMM YYYY');
  } else if (type === 'long') {
    return moment(value)
      .locale('id')
      .format('DD MMMM YYYY');
  } else if (type === 'complete') {
    return moment(value)
      .locale('id')
      .format('dddd, DD MMMM YYYY');
  } else if (type === 'dateTime') {
    return moment(value)
      .locale('id')
      .format('YYYY-MM-DD HH:mm:ss');
  } else if (type === 'dateTimeShort') {
    return moment(value)
      .locale('id')
      .format('YYYY-MM-DD HH:mm');
  } else if (type === 'input') {
    return moment(value)
      .locale('id')
      .format('YYYY-MM-DD');
  } else if (type === 'timeShort') {
    return moment(value)
      .locale('id')
      .format('HH:mm');
  } else if (type === 'slash') {
    return moment(value)
      .locale('id')
      .format('DD/MM/YY');
  } else if (type === 'M/D/YYYY') {
    return moment(value)
      .locale('id')
      .format('M/D/YYYY');
  } else if (type === 'start_at') {
    return moment(value)
      .locale('id')
      .format('YYYY-MM-DD 00:00:00');
  } else if (type === 'end_at') {
    return moment(value)
      .locale('id')
      .format('YYYY-MM-DD 23:59:59');
  } else {
    return moment(value).locale('id');
  }
};
// yyyy-mm-dd HH:mm
export const formatTimestamp = (date: string, time: string) => {
  if (time.length === 0) {
    time = '00:00';
  }
  const newDate = date.substring(0, 10) + ' ' + time;
  return new Date(newDate).toISOString();
};
export const flipDateFormat = (date: string) => {
  const datePart = date.split('-');
  return datePart[2] + '-' + datePart[1] + '-' + datePart[0];
};
export const convertDuration = (time: number) => {
  if (time === 0) {
    return '-';
  } else {
    return moment
      .utc(moment.duration(time, 'seconds').asMilliseconds())
      .format('HH:mm');
  }
};
export const checkTimeFormat = (time: string) => {
  return moment(time, 'HH:mm').diff(moment().startOf('day'), 'seconds');
};
export const calculateDateTime = (date_entry: any, time: string) => {
  const dateTime = new Date(date_entry + ' ' + time);
  return dateTime.toISOString();
};

export const convertDate = (index: any) => {
  return ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][
    index
  ];
};

export const ExcelDateToJSDate = (serial: number) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const fractional_day = serial - Math.floor(serial) + 0.0000001;
  let total_seconds = Math.floor(86400 * fractional_day);
  const seconds = total_seconds % 60;
  total_seconds -= seconds;
  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;
  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds,
  );
};

export const convertSecondToTimeRound = (seconds: number) => {
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  if (minutes > 30) {
    minutes = 0;
    hours++;
  } else if (minutes > 5 && minutes <= 30) {
    minutes = 30;
  }
  const days = Math.floor(hours / 24);
  hours = hours % 24;
  if (days > 0) {
    return `(${days} hari ${hours} jam ${minutes} menit)`;
  } else if (days <= 0 && hours > 0) {
    return `(${hours} jam ${minutes} menit)`;
  } else if (days <= 0 && hours <= 0) {
    return `(${minutes} menit)`;
  }
};

export const convertSecondToTime = (seconds: number) => {
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  const days = Math.floor(hours / 24);
  hours = hours % 24;
  if (days > 0) {
    return `${days} hari ${hours} jam ${minutes} menit`;
  } else if (days <= 0 && hours > 0) {
    return `${hours} jam ${minutes} menit`;
  } else if (days <= 0 && hours <= 0) {
    return `${minutes} menit`;
  }
};
export const convertSecondToTimeEightHours = (seconds: number) => {
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  const days = Math.floor(hours / 8);
  hours = hours % 24;
  if (days > 0) {
    return `${days} hari ${hours} jam ${minutes} menit`;
  } else if (days <= 0 && hours > 0) {
    return `${hours} jam ${minutes} menit`;
  } else if (days <= 0 && hours <= 0) {
    return `${minutes} menit`;
  }
};

export const generateQueryMultiple = (params: any) => {
  const queries = [];
  if (params.filters) {
    if (Array.isArray(params.filters)) {
      for (const key in params.filters) {
        if (
          params.filters.hasOwnProperty(key) &&
          Number(key) === 0 &&
          params.filters[key].value === 'ASC' &&
          params.filters[key].value === 'DESC'
        ) {
          queries.push(
            `filter=${Object.values(params.filters[key]).join('%7C%7C')}`,
          );
        } else if (
          params.filters[key].value === 'ASC' ||
          params.filters[key].value === 'DESC'
        ) {
          queries.push(
            `sort=${Object.values(params.filters[key]).join('%2C')}`,
          );
        } else if (params.filters[key].value === 'join') {
          queries.push(`join=${params.filters[key].field}`);
        } else if (params.filters[key].value === 'join-field') {
          queries.push(
            `join=${params.filters[key].field}%7C%7C${
              params.filters[key].fieldName
            }`,
          );
        } else if (params.filters[key].value === 'field') {
          queries.push(
            `fields=${params.filters[key].field.split(',').join('%2C')}`,
          );
        } else if (params.filters[key].operator === 'between') {
          queries.push(
            `filter=${params.filters[key].field}%7C%7C${
              params.filters[key].operator
            }%7C%7C${params.filters[key].value.split(',').join('%2C')}`,
          );
        } else {
          queries.push(
            `filter[]=${Object.values(params.filters[key]).join('%7C%7C')}`,
          );
        }
      }
    } else {
      queries.push(`filter=${Object.values(params.filters).join('%7C%7C')}`);
    }
  } else if (params.filter) {
    queries.push(`filter=${Object.values(params.filter).join('%7C%7C')}`);
  }
  if (params.join) {
    queries.push(`join=${params.join}`);
  }
  if (params.per_page) {
    queries.push(`per_page=${params.per_page}`);
  }
  if (params.page) {
    queries.push(`page=${params.page}`);
  }
  if (params.sort) {
    queries.push(`sort=${params.sort}`);
  }
  queries.push('cache=0');
  return queries.join('&');
};

export const generateQueryPayslip = (
  params: any = {
    department_id: null,
    date_start: null,
    date_end: null,
    status: null,
  },
) => {
  let query = '';
  if (
    params.department_id &&
    params.department_id.toString().trim().length > 0
  ) {
    if (query.length > 0) {
      query += '&department_id=' + params.department_id;
    } else {
      query = 'department_id=' + params.department_id;
    }
  }
  if (params.date_start && params.date_start.toString().trim().length > 0) {
    if (query.length > 0) {
      query += '&date_start=' + params.date_start;
    } else {
      query = 'date_start=' + params.date_start;
    }
  }
  if (params.date_end && params.date_end.toString().trim().length > 0) {
    if (query.length > 0) {
      query += '&date_end=' + params.date_end;
    } else {
      query = 'date_end=' + params.date_end;
    }
  }
  if (params.status && params.status.toString().trim().length > 0) {
    if (query.length > 0) {
      query += '&status=' + params.status;
    } else {
      query = 'status=' + params.status;
    }
  }
  return query;
};

export const reloadOnce = () => {
  if (localStorage.getItem('reloaded')) {
    localStorage.removeItem('reloaded');
  } else {
    localStorage.setItem('reloaded', '1');
    location.reload();
  }
};
