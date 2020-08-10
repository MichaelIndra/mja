import { IAttendance } from '@/common/interfaces/attendance';
import request from '@/common/utils/request';
import { generateQueryMultiple, getHeader } from '../utils/config';

export const fetchAttendances = (params: any = '') => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/attendances?${queryString}`,
    method: 'get',
    headers: getHeader(),
  });
};
export const fetchOneAttendance = (id: string, params: any = '') => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/attendances/${id}?${queryString}`,
    method: 'get',
    headers: getHeader(),
  });
};

export const createAttendance = (data: IAttendance) =>
  request({
    url: '/attendances',
    method: 'POST',
    // headers: getHeader(),
    data,
  });
export const createBulkAttendance = (data: IAttendance[]) =>
  request({
    url: '/attendances/bulk',
    method: 'POST',
    // headers: getHeader(),
    data: {
      bulk: data,
    },
  });

export const updateAttendance = (id: string, data: IAttendance) =>
  request({
    url: `/attendances/${id}`,
    method: 'PUT',
    headers: getHeader(),
    data,
  });

export const deleteAttendance = (id: string, soft: boolean = false) =>
  request({
    url: `/attendances/${id}${soft ? '/soft' : ''}`,
    method: 'DELETE',
    // headers: getHeader(),
  });

export const deleteManyAttendance = (data: any) => {
  if (data.query) {
    data.query = generateQueryMultiple(data.query);
  }
  return request({
    url: `/attendances/custom/bulk`,
    method: 'DELETE',
    data,
    headers: getHeader(),
  });
};
