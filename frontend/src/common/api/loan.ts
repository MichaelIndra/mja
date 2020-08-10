import request from '@/common/utils/request';
import { ILoan } from '../interfaces/loan';
import { generateQueryMultiple, getHeader } from '../utils/config';

export const fetchLoan = (params: any = '') => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/loans?${queryString}`,
    method: 'get',
    headers: getHeader(),
  });
};

export const fetchTotalLoan = () => {
  return request({
    url: `/loans/custom/totalLoanByDepartment`,
    method: 'get',
    headers: getHeader(),
  });
};

export const fetchOneLoan = (id: string, params: any = '') =>
  request({
    url: `/loans/${id}`,
    method: 'get',
    headers: getHeader(),
  });

export const createLoan = (data: ILoan) =>
  request({
    url: '/loans',
    method: 'POST',
    headers: getHeader(),
    data,
  });

export const createBulkLoan = (data: ILoan[]) =>
  request({
    url: '/loans/bulk',
    method: 'POST',
    headers: getHeader(),
    data: {
      bulk: data,
    },
  });
