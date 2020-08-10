import request from '@/common/utils/request';
import { IGroup } from '../interfaces/group';
import { generateQueryMultiple, getHeader } from '../utils/config';

export const fetchGroups = (departmentId: string, params: any = '') => {
  return request({
    url: `/departments/${departmentId}/groups?sort=name%2CASC`,
    method: 'get',
    headers: getHeader(),
  });
};

export const fetchOneGroup = (departmentId: string, id: string) => {
  return request({
    url: `/departments/${departmentId}/groups/${id}`,
    method: 'get',
    headers: getHeader(),
  });
};

export const createGroup = (data: IGroup, departmentId: string) =>
  request({
    url: `/departments/${departmentId}/groups`,
    method: 'POST',
    headers: getHeader(),
    data,
  });

export const updateGroup = (id: string, data: IGroup) => {
  return request({
    url: `/departments/${data.department_id}/groups/${id}`,
    method: 'PUT',
    headers: getHeader(),
    data,
  });
};

export const deleteGroup = (data: IGroup, soft: boolean = false) =>
  request({
    url: `/departments/${data.department_id}/groups/${data.id}${
      soft ? '/soft' : ''
    }`,
    method: 'DELETE',
    headers: getHeader(),
  });
