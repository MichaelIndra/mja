import request from '@/common/utils/request';
import { IAccountRole } from '../interfaces/accountRole';

export const createAccountRole = (data: IAccountRole) =>
  request({
    url: '/account_roles',
    method: 'post',
    data,
  });

export const updateAccountRole = (id: string, data: IAccountRole) =>
  request({
    url: `/account_roles/${id}`,
    method: 'patch',
    data,
  });
