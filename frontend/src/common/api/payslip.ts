import request from '@/common/utils/request';
import { IPayslip } from '../interfaces/payslip';
import { generateQueryMultiple, getHeader } from '../utils/config';

export const fetchReportPayslipOvertime = (params: any = '') => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/payslips/custom/getOvertimeReport?${queryString}`,
    method: 'GET',
    headers: getHeader(),
  });
};

export const fetchPayslipOvertime = (params: any = '') => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/payslips/custom/getPayslipOvertime?${queryString}`,
    method: 'GET',
    headers: getHeader(),
  });
};

export const fetchPayslip = (params: any = '') => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/payslips?${queryString}`,
    method: 'GET',
    headers: getHeader(),
  });
};

export const fetchOnePayslip = (id: any) => {
  return request({
    url: `/payslips/${id}`,
    method: 'GET',
    headers: getHeader(),
  });
};

export const createPayslipBulk = (data: IPayslip[]) =>
  request({
    url: `/payslips/bulk`,
    method: 'POST',
    headers: getHeader(),
    data,
  });

export const updatePayslipBulk = (data: IPayslip[]) =>
  request({
    url: `/payslips/custom/bulkUpdate`,
    method: 'PUT',
    headers: getHeader(),
    data,
  });
