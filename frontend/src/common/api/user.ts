import request from '@/common/utils/request';
import { IUser } from '../interfaces/user';
import { generateQueryMultiple, getHeader } from '../utils/config';

export const fetchUser = (params: any = '') => {
  const queryString = generateQueryMultiple(params);
  return request({
    url: `/accounts?${queryString}`,
    headers: getHeader(),
    method: 'get',
  });
};

export const fetchOneUser = (id: string, params: any = '') =>
  request({
    url: `/accounts/${id}`,
    headers: getHeader(),
    method: 'get',
    params,
  });

export const createUser = (data: IUser) => {
  return request({
    url: '/accounts',
    headers: getHeader(),
    method: 'POST',
    data,
  });
};

export const updateUser = (id: string, data: IUser) => {
  return request({
    url: `/accounts/${id}`,
    headers: getHeader(),
    method: 'PATCH',
    data,
  });
};

export const deleteUser = (id: string, soft: boolean = false) =>
  request({
    url: `/accounts/${id}${soft ? '/soft' : ''}`,
    headers: getHeader(),
    method: 'DELETE',
  });
