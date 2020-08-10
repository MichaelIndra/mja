import { generateQueryMultiple } from '@/common/utils/config';
import request from '@/common/utils/request';

export const fetchLogs = (params: any) => {
  const queryString: any = generateQueryMultiple(params);
  return request({
    url: `/logs?${queryString}`,
    method: 'get',
  });
};

export const fetchOneLog = (id: string) =>
  request({
    url: `/logs/${id}`,
    method: 'get',
  });
