import { formatDate } from '../utils/config';

export interface IQuery {
  page?: number;
  per_page?: number;
  join?: string;
  filters?: [] | any;
}

export const InitQuery: IQuery = {
  page: 1,
  per_page: 10,
};

export const InitQueryOutcome: IQuery = {
  ...InitQuery,
  filters: [
    {
      field: 'start_at',
      value: 'ASC',
    },
    {
      field: 'department',
      value: 'join',
    },
  ],
};

export const InitQueryLog: IQuery = {
  ...InitQuery,
  filters: [
    {
      field: 'account',
      value: 'join',
    },
  ],
};

export const InitQueryEmployee: IQuery = {
  ...InitQuery,
  filters: [
    {
      field: 'name',
      value: 'ASC',
    },
    {
      field: 'active',
      operator: 'eq',
      value: true,
    },
    {
      field: 'department',
      value: 'join',
    },
    {
      field: 'group',
      value: 'join',
    },
    {
      field: 'area',
      value: 'join',
    },
    {
      field: 'position',
      value: 'join',
    },
    {
      field: 'loans',
      value: 'join',
    },
  ],
};

export const InitQueryLeave: IQuery = {
  ...InitQuery,
  filters: [
    {
      field: 'employee',
      value: 'join',
    },
    {
      field: 'employee.name',
      value: 'ASC',
    },
    {
      field: 'employee.department',
      value: 'join',
    },
    {
      field: 'employee.active',
      operator: 'eq',
      value: true,
    },
    {
      field: 'employee.group',
      value: 'join',
    },
    {
      field: 'employee.area',
      value: 'join',
    },
    {
      field: 'employee.position',
      value: 'join',
    },
  ],
};

export const InitQueryAttendance: IQuery = {
  ...InitQuery,
  filters: [
    {
      field: 'time_check_in',
      value: 'DESC',
    },
    {
      field: 'employee',
      value: 'join',
    },
    {
      field: 'employee.department',
      value: 'join',
    },
    {
      field: 'employee.active',
      operator: 'eq',
      value: true,
    },
    {
      field: 'employee.department.groups',
      value: 'join',
    },
    {
      field: 'employee.group',
      value: 'join',
    },
    {
      field: 'employee.area',
      value: 'join',
    },
    {
      field: 'employee.position',
      value: 'join',
    },
  ],
};

export const InitQueryArea: IQuery = {
  ...InitQuery,
  filters: [
    {
      field: 'name',
      value: 'ASC',
    },
  ],
};

export const InitQueryPayslip: IQuery = {
  ...InitQuery,
  filters: [
    {
      field: 'start_at',
      value: 'ASC',
    },
    {
      field: 'employee',
      value: 'join',
    },
  ],
};

export const InitQueryOvertime: IQuery = {
  ...InitQuery,
  filters: [],
};
