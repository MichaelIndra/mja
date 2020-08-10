import Cookies from 'js-cookie';

// App
const sidebarStatusKey = 'sidebar_status';
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey);
export const setSidebarStatus = (sidebarStatus: string) =>
  Cookies.set(sidebarStatusKey, sidebarStatus);

const languageKey = 'language';
export const getLanguage = () => Cookies.get(languageKey);
export const setLanguage = (language: string) =>
  Cookies.set(languageKey, language);

const sizeKey = 'size';
export const getSize = () => Cookies.get(sizeKey);
export const setSize = (size: string) => Cookies.set(sizeKey, size);

// User
const tokenKey = 'mja_payroll_token';
export const getToken = () => Cookies.get(tokenKey);
export const setToken = (token: string) =>
  Cookies.set(tokenKey, token, { expires: 2 });
export const removeToken = () => Cookies.remove(tokenKey);

// Temporary payslip
// export const getPayslipTemp = () => {
//   const dataPayslip: any = window.localStorage.getItem('payslip_record');
//   const dataPayslipParse: any = JSON.parse(dataPayslip);
//   return dataPayslipParse;
// };

// export const setPayslipTemp = (data: any) => {
//   const dataPayslip: any = window.localStorage.getItem('payslip_record');
//   const dataPayslipParse: any = JSON.parse(dataPayslip);
//   if (dataPayslipParse && dataPayslipParse.length > 0) {
//     dataPayslipParse.push(data);
//     const newData: any = JSON.stringify(dataPayslipParse);
//     window.localStorage.setItem('payslip_record', newData);
//   } else {
//     const initData: any = [data];
//     const initDataStringify: any = JSON.stringify(initData);
//     window.localStorage.setItem('payslip_record', initDataStringify);
//   }
// };

// export const updatePayslipTemp: any = (dataTemporary: any) => {
//   const dataPayslip: any = window.localStorage.getItem('payslip_record');
//   const dataPayslipParse: any = JSON.parse(dataPayslip);
//   const newDataFilter: any = dataPayslipParse.map((el: any) => {
//     const data: any = el.employee_id === dataTemporary.employee_id;
//     if (data) {
//       el = dataTemporary;
//     }
//     return el;
//   });
//   const newDataFilterUpdated: any = JSON.stringify(newDataFilter);
//   window.localStorage.setItem('payslip_record', newDataFilterUpdated);
// };

// export function findPayslipTemp(dataTemporary: any) {
//   const dataPayslip: any = window.localStorage.getItem('payslip_record');
//   const dataPayslipParse: any = JSON.parse(dataPayslip);
//   return dataPayslipParse.find((el: any) => {
//     return el.employee_id === dataTemporary.employee_id;
//   });
// }

// export const removePayslipTemp: any = () => {
//   window.localStorage.removeItem('payslip_record');
// };
