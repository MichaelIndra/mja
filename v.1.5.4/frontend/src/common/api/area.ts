import request from '@/common/utils/request';
import { IArea } from '../interfaces/area';
import { generateQueryMultiple } from '../utils/config';

export const fetchAreasFilter = (data: any) => {
  const queryString = generateQueryMultiple(data.params);
  return request({
    url: `/departments/${data.department_id}/areas?sort=name%2CDESC&${queryString}`,
    method: 'get',
  });
};

export const fetchAreas = (departmentId: string) => {
  return request({
    url: `/departments/${departmentId}/areas?sort=name%2CDESC`,
    method: 'get',
  });
};

export const fetchOneArea = (data: any, params: any = '') =>
  request({
    url: `/departments/${data.departmentId}/areas/${data.areaId}`,
    method: 'get',
    params,
  });

export const createArea = (data: IArea, departmentId: string) =>
  request({
    url: `/departments/${departmentId}/areas`,
    method: 'POST',
    data,
  });

export const updateArea = (id: string, data: IArea, departmentId: string) =>
  request({
    url: `/departments/${departmentId}/areas/${id}`,
    method: 'PUT',
    data,
  });

export const deleteArea = (
  id: string,
  soft: boolean = false,
  departmentId: string,
) =>
  request({
    url: `/departments/${departmentId}/areas/${id}${soft ? '/soft' : ''}`,
    method: 'DELETE',
  });
