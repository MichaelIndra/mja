import { ILeave } from '@/common/interfaces/leave';
import request from '@/common/utils/request';
import { generateQueryMultiple, getHeader } from '../utils/config';

export const fetchLeaves = (params: any = '') => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/leaves?${queryString}`,
    method: 'get',
    headers: getHeader(),
    params,
  });
};
export const fetchOneLeave = (id: string, params: any = '') =>
  request({
    url: `/leaves/${id}`,
    method: 'get',
    headers: getHeader(),
    params,
  });

export const createLeave = (data: ILeave) =>
  request({
    url: '/leaves',
    method: 'POST',
    headers: getHeader(),
    data,
  });

export const createBulkLeave = (data: ILeave[]) =>
  request({
    url: '/leaves/bulk',
    method: 'POST',
    headers: getHeader(),
    data: {
      bulk: data,
    },
  });

export const updateLeave = (id: string, data: ILeave) =>
  request({
    url: `/leaves/${id}`,
    method: 'PUT',
    headers: getHeader(),
    data,
  });

export const deleteLeave = (id: string, soft: boolean = false) =>
  request({
    url: `/leaves/${id}${soft ? '/soft' : ''}`,
    method: 'DELETE',
    headers: getHeader(),
  });

export const deleteManyLeave = (data: any) => {
  if (data.query) {
    data.query = generateQueryMultiple(data.query);
  }
  return request({
    url: `/leaves/delete/bulk`,
    method: 'DELETE',
    data,
    headers: getHeader(),
  });
};
