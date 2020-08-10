import request from '@/common/utils/request';
import { IBranch } from '../interfaces/branch';

export const fetchBranchs = (params: any = '') =>
  request({
    url: '/branchs',
    method: 'get',
    params,
  });

export const fetchOneBranch = (id: string, params: any = '') =>
  request({
    url: `/branchs/${id}`,
    method: 'get',
    params,
  });

export const createBranch = (data: IBranch) =>
  request({
    url: '/branchs',
    method: 'POST',
    data,
  });

export const updateBranch = (id: string, data: IBranch) =>
  request({
    url: `/branchs/${id}`,
    method: 'PUT',
    data,
  });

export const deleteBranch = (id: string, soft: boolean = false) =>
  request({
    url: `/branchs/${id}${soft ? '/soft' : ''}`,
    method: 'DELETE',
  });
