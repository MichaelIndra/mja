import request from '@/common/utils/request';
import { generateQueryMultiple, getHeader } from '../utils/config';

export const fetchOvertimeExpenseReport = (params: any) => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/payslips/custom/getTotalOvertimeReport?${queryString}`,
    headers: getHeader(),
    method: 'get',
  });
};

export const fetchOutcomeExpenseReport = (params: any) => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/payslips/custom/getTotalOutcomeReport?${queryString}`,
    headers: getHeader(),
    method: 'get',
  });
};

export const fetchExpenseReport = (data: any = '') => {
  return request({
    url: `/reports/cost-per-month?year=${data.year}&month=${data.month}`,
    headers: getHeader(),
    method: 'get',
  });
};

export const getMostLateEmployeeMonthly = (filter: string) => {
  return request({
    url: `/reports/report-most-late-employee-monthly?date=${filter}`,
    headers: getHeader(),
    method: 'get',
  });
};

export const getMostDiligentEmployeeMonthly = (filter: string) => {
  return request({
    url: `/reports/report-most-diligent-employee-monthly?date=${filter}`,
    headers: getHeader(),
    method: 'get',
  });
};

export const getMostLateEmployeeWeekly = (filter: any) => {
  return request({
    url: `/reports/report-most-late-employee-weekly?dateStart=${
      filter.weekStart
    }&dateEnd=${filter.weekEnd}`,
    headers: getHeader(),
    method: 'get',
  });
};
