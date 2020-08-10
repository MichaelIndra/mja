import request from '@/common/utils/request';
import { IRole } from '../interfaces/role';

export const fetchRoles = (params: any = '') =>
  request({
    url: '/roles',
    method: 'get',
    params,
  });

export const fetchOneRole = (id: string, params: any = '') =>
  request({
    url: `/roles/${id}`,
    method: 'get',
    params,
  });

export const createRole = (data: IRole) =>
  request({
    url: '/roles',
    method: 'POST',
    data,
  });

export const updateRole = (id: string, data: IRole) =>
  request({
    url: `/roles/${id}`,
    method: 'PUT',
    data,
  });

export const deleteRole = (id: string, soft: boolean = false) =>
  request({
    url: `/roles/${id}${soft ? '/soft' : ''}`,
    method: 'DELETE',
  });
