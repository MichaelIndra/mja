import request from '@/common/utils/request';
import { generateQueryMultiple, getHeader } from '../utils/config';

export const fetchOutcomeOwner = (params: any = '') => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/outcomes/?${queryString}`,
    method: 'GET',
    headers: getHeader(),
  });
};

export const fetchOutcome = (params: any = '') => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/payslips/custom/getOutcomeReport?${queryString}`,
    method: 'GET',
    headers: getHeader(),
  });
};

export const fetchOneOutcome = (id: string | any) => {
  return request({
    url: `/outcomes/${id}`,
    method: 'GET',
    headers: getHeader(),
  });
};

export const createOutcome = (data: any) =>
  request({
    url: `/outcomes`,
    method: 'POST',
    headers: getHeader(),
    data,
  });

export const getOutcomePerDepartment = (params: any = '') => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/outcomes/custom/getOutcomePerDepartment?${queryString}`,
    method: 'get',
    headers: getHeader(),
  });
};
