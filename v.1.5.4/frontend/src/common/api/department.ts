import request from '@/common/utils/request';
import { IDepartment } from '../interfaces/department';
import { generateQueryMultiple } from '../utils/config';

export const fetchDepartments = (params: any = '') => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/departments?${queryString}`,
    method: 'get',
  });
};

export const fetchOneDepartment = (data: any = '') => {
  const queryString = generateQueryMultiple(data.params);
  return request({
    url: `/departments/${data.departmentId}?${queryString}`,
    method: 'get',
  });
};

export const createDepartment = (data: IDepartment) =>
  request({
    url: '/departments',
    method: 'POST',
    data,
  });

export const updateDepartment = (id: string, data: any) =>
  request({
    url: `/departments/${id}`,
    method: 'PUT',
    data,
  });

export const deleteDepartment = (id: string, soft: boolean = false) =>
  request({
    url: `/departments/${id}${soft ? '/soft' : ''}`,
    method: 'DELETE',
  });
