import request from '@/common/utils/request';
import { generateQueryMultiple, getHeader } from '../utils/config';

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
    url: `/reports/report-most-late-employee-weekly?dateStart=${filter.weekStart}&dateEnd=${filter.weekEnd}`,
    headers: getHeader(),
    method: 'get',
  });
};
