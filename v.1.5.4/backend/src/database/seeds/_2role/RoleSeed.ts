import { ROLES } from '../../../auth/auth.constant';

export const SeedData: any[] = [
  {
    id: '04558fec-bcad-48f6-bf09-33a287f10c0c',
    name: ROLES.ADMIN,
    description: 'Administrator',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '0f72e8c5-1af4-4803-98dd-8c0c7abb0af2',
    name: ROLES.BRANCH_HR_PAYROLL,
    description: 'Branch Human Resource Payroll',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'ceabeb9f-5704-45e3-8b37-eac3bd172eec',
    name: ROLES.BRANCH_HR_ATTENDANCE,
    description: 'Branch Human Resource Attendance',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '1242df9d-ecae-4dd0-ae33-2f627054dd8f',
    name: ROLES.BRANCH_MANAGER,
    description: 'Branch Manager',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2a350d91-1d98-489a-9763-53d27485b572',
    name: ROLES.GENERAL_HR_PAYROLL,
    description: 'General Human Resource Payroll',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '25265602-368a-4b0d-afc7-01155eb408d0',
    name: ROLES.GENERAL_HR_ATTENDANCE,
    description: 'General Human Resource Attendance',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '12917db9-bb72-491f-adfb-13f392bbbe1a',
    name: ROLES.GENERAL_MANAGER,
    description: 'General Manager',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '7d35d0d3-18b0-446f-adea-dbb1b3291c6b',
    name: ROLES.OWNER,
    description: 'Owner',
    created_at: new Date(),
    updated_at: new Date(),
  },
];
