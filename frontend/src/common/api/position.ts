import request from '@/common/utils/request';
import { IPosition } from '../interfaces/position';

export const fetchPositions = (departmentId: string) =>
  request({
    url: `/areas/${departmentId}/positions`,
    method: 'get',
  });

export const fetchOnePosition = (data: any) =>
  request({
    url: `/areas/${data.areaId}/positions/${data.positionId}`,
    method: 'get',
  });

export const createPosition = (data: IPosition, departmentId: string) =>
  request({
    url: `/areas/${departmentId}/positions`,
    method: 'POST',
    data,
  });

export const updatePosition = (
  id: string,
  data: IPosition,
  departmentId: string,
) =>
  request({
    url: `/areas/${departmentId}/positions/${id}`,
    method: 'PUT',
    data,
  });

export const deletePosition = (
  id: string,
  soft: boolean = false,
  departmentId: string,
) =>
  request({
    url: `/areas/${departmentId}/positions/${id}${soft ? '/soft' : ''}`,
    method: 'DELETE',
  });
