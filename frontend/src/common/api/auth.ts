import request from '@/common/utils/request';
import { getHeader } from '../utils/config';

export const getUsers = (params: any) =>
  request({
    url: '/users',
    method: 'get',
    params,
  });

export const getUserInfo = (data: any) =>
  request({
    url: '/users/info',
    method: 'post',
    data,
  });

export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'get',
  });

export const updateUser = (username: string, data: any) =>
  request({
    url: `/users/${username}`,
    method: 'put',
    data,
  });

export const deleteUser = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'delete',
  });

export const updateAccount = (data: string | any) =>
  request({
    url: `/accounts/${data.id}`,
    method: 'put',
    data,
    headers: getHeader(),
  });

export const login = (data: any) =>
  request({
    url: `auth/login`,
    method: 'post',
    data,
    headers: {
      contentType: 'application/json',
    },
  });

export const logout = () =>
  request({
    url: '/users/logout',
    method: 'post',
  });

export const register = (data: any) =>
  request({
    url: '/users/register',
    method: 'post',
    data,
  });

export const resetAndGenerateToken = (data: {
  email: string;
  redirect_url: string | null;
}) =>
  request({
    url: `auth/reset-password/generate-token`,
    method: 'post',
    data,
    headers: {
      contentType: 'application/json',
    },
  });

export const resetPasswordByToken = (data: {
  password: string;
  re_password: string;
  email: string;
  token: string;
}) =>
  request({
    url: `auth/reset-password/by-token`,
    method: 'PUT',
    data,
    headers: {
      contentType: 'application/json',
    },
  });
