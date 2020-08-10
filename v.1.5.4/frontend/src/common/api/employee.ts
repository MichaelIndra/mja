import {generateQueryMultiple, generateQueryPayslip, getHeader} from '@/common/utils/config';
import request from '@/common/utils/request';
import { IEmployee } from '../interfaces/employee';

export const fetchEmployees = (params: any = '') => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/employees?${queryString}`,
    method: 'get',
    headers: getHeader(),
  });
};
export const getEmployeeDataForPayslip = (params: any ) => {
  const query = generateQueryPayslip(params);
  return request({
    url: `/employees/custom/getEmployeeDataForPayslip?${query}`,
    method: 'get',
    headers: getHeader(),
  });
};
export const fetchOneEmployee = (id: string, params: any = {}) => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/employees/${id}?${queryString}`,
    method: 'get',
    headers: getHeader(),
  });
};

export const createEmployee = (data: IEmployee) =>
  request({
    url: '/employees',
    method: 'POST',
    data,
  });

export const createBulkEmployee = (data: IEmployee[]) =>
  request({
    url: '/employees/bulk',
    method: 'POST',
    data: {
      bulk: data,
    },
  });

export const updateEmployee = (id: string, data: IEmployee) =>
  request({
    url: `/employees/${id}`,
    method: 'PUT',
    headers: getHeader(),
    data,
  });

export const deleteEmployee = (id: string, soft: boolean = false) =>
  request({
    url: `/employees/${id}${soft ? '/soft' : ''}`,
    method: 'DELETE',
  });

export const fetchCurrentEmployeeBirthday = () => {
  return request({
    url: `/employees/custom/getBirthday`,
    method: 'get',
    headers: getHeader(),
  });
};

export const fetchTotalEmployee = () => {
  return request({
    url: `/employees/custom/getTotalEmployee`,
    method: 'get',
    headers: getHeader(),
  });
};

export const backup = () => {
  return request({
    url: `/employees/custom/backup`,
    method: 'get',
    headers: getHeader(),
  });
};

export const switchGroup = () => {
  return request({
    url: `/employees/custom/switchGroup`,
    method: 'PUT',
    headers: getHeader(),
  });
};
