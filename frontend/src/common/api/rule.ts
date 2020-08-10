import request from '@/common/utils/request';
import { IRule } from '../interfaces/rule';

export const fetchRules = (params: any = '') =>
  request({
    url: '/rules',
    method: 'get',
    params,
  });

export const fetchOneRule = (id: string, params: any = '') =>
  request({
    url: `/rules/${id}`,
    method: 'get',
    params,
  });

export const createRule = (data: IRule) =>
  request({
    url: '/rules',
    method: 'POST',
    data,
  });

export const updateRule = (id: string, data: IRule) =>
  request({
    url: `/rules/${id}`,
    method: 'PUT',
    data,
  });

export const deleteRule = (id: string, soft: boolean = false) =>
  request({
    url: `/rules/${id}${soft ? '/soft' : ''}`,
    method: 'DELETE',
  });
