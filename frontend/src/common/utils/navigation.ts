import {
  admin,
  branchManager,
  branchOfficeOne,
  branchOfficeTwo,
  generalManager,
  generalOfficeOne,
  generalOfficeTwo,
  owner,
} from './role';

// admin navigation
export const adminMenu = [
  {
    title: 'Beranda',
    routeName: 'admin',
    icon: 'home',
    role: admin,
  },
  { header: 'Informasi Karyawan', role: admin },
  {
    title: 'Data Role',
    routeName: 'role-management',
    icon: 'assignment_ind',
    role: admin,
  },
  {
    title: 'Data Cabang',
    routeName: 'branch-management',
    icon: 'assessment',
    role: admin,
  },
  {
    title: 'Data Departemen',
    routeName: 'department',
    icon: 'dashboard',
    role: admin,
  },
  { header: 'Informasi Pengguna', role: admin },
  {
    title: 'Daftar Pengguna',
    routeName: 'user-management',
    icon: 'people',
    role: admin,
  },
  {
    title: 'Data Log',
    routeName: 'log',
    icon: 'assessment',
    role: admin,
  },
  {
    title: 'Laporan Terlambat',
    routeName: 'report-payslip-deduction',
    icon: 'assessment',
    role: admin,
  },
  {
    title: 'Laporan Lembur',
    routeName: 'report-payslip-overtime',
    icon: 'assessment',
    role: admin,
  },
  {
    title: 'Laporan Pengeluaran',
    routeName: 'report-payslip-outcome',
    icon: 'equalizer',
    role: admin,
  },
];

// general manager navigation
export const generalManagerMenu = [
  {
    title: 'Beranda',
    routeName: 'general',
    icon: 'home',
    role: generalManager,
  },
  { header: 'Informasi Karyawan', role: generalManager },
  {
    title: 'Daftar Karyawan',
    routeName: 'employee',
    icon: 'people',
    role: generalManager,
  },
  {
    title: 'Data Departemen',
    routeName: 'department',
    icon: 'dashboard',
    role: generalManager,
  },
  { header: 'Informasi Laporan', role: generalManager },
  {
    title: 'Data Kehadiran',
    routeName: 'report-attendance',
    icon: 'event_available',
    role: generalManager,
  },
  {
    title: 'Data Absensi',
    routeName: 'report-leave',
    icon: 'event_busy',
    role: generalManager,
  },
  {
    title: 'Buat Payslip',
    routeName: 'choose-report-payslip',
    icon: 'archive',
    role: generalManager,
  },
  // {
  //   title: 'Laporan Terlambat',
  //   routeName: 'report-payslip',
  //   icon: 'assessment',
  //   role: generalManager,
  // },
  /* {
    title: 'Laporan Kehadiran',
    routeName: 'report-attendance-summary',
    icon: 'assessment',
    role: generalManager,
  }, */
];

// general hr attendance navigation
export const generalHRAttendanceMenu = [
  {
    title: 'Beranda',
    routeName: 'general-hr-attendance',
    icon: 'home',
    role: generalOfficeTwo,
  },
  { header: 'Informasi Karyawan', role: generalOfficeTwo },
  {
    title: 'Daftar Karyawan',
    routeName: 'employee',
    icon: 'people',
    role: generalOfficeTwo,
  },
  {
    title: 'Data Departemen',
    routeName: 'department',
    icon: 'dashboard',
    role: generalOfficeTwo,
  },
  { header: 'Data Laporan', role: generalOfficeTwo },
  {
    title: 'Data Kehadiran',
    routeName: 'attendance',
    icon: 'event_available',
    role: generalOfficeTwo,
  },
  {
    title: 'Data Absensi',
    routeName: 'leave',
    icon: 'event_busy',
    role: generalOfficeTwo,
  },
];

// branch manager navigation
export const branchManagerMenu = [
  {
    title: 'Beranda',
    routeName: 'branch',
    icon: 'home',
    role: branchManager,
  },
  { header: 'Informasi Karyawan', role: branchManager },
  {
    title: 'Daftar Karyawan',
    routeName: 'employee',
    icon: 'people',
    role: branchManager,
  },
  {
    title: 'Data Departemen',
    routeName: 'department',
    icon: 'dashboard',
    role: generalOfficeTwo,
  },
  { header: 'Informasi Laporan', role: branchManager },
  {
    title: 'Laporan Kehadiran',
    routeName: 'report-attendance',
    icon: 'event_available',
    role: branchManager,
  },
  {
    title: 'Laporan Absensi',
    routeName: 'report-leave',
    icon: 'event_busy',
    role: branchManager,
  },
  {
    title: 'Laporan Gaji Karyawan',
    routeName: 'choose-report-payslip',
    icon: 'archive',
    role: branchManager,
  },
];

// general hr attendance navigation
export const branchHRAttendanceMenu = [
  {
    title: 'Beranda',
    routeName: 'branch-hr-attendance',
    icon: 'home',
    role: branchOfficeTwo,
  },
  { header: 'Informasi Karyawan', role: branchOfficeTwo },
  {
    title: 'Daftar Karyawan',
    routeName: 'employee',
    icon: 'people',
    role: branchOfficeTwo,
  },
  {
    title: 'Data Departemen',
    routeName: 'department',
    icon: 'dashboard',
    role: branchOfficeTwo,
  },
  { header: 'Data Laporan', role: branchOfficeTwo },
  {
    title: 'Data Kehadiran',
    routeName: 'attendance',
    icon: 'event_available',
    role: branchOfficeTwo,
  },
  {
    title: 'Data Absensi',
    routeName: 'leave',
    icon: 'event_busy',
    role: branchOfficeTwo,
  },
];

// general hr payslip navigation
export const generalHRPayslipMenu = [
  {
    title: 'Beranda',
    routeName: 'general-hr-payroll',
    icon: 'home',
    role: generalOfficeOne,
  },
  { header: 'Informasi Karyawan', role: generalOfficeOne },
  {
    title: 'Daftar Karyawan',
    routeName: 'employee',
    icon: 'people',
    role: generalOfficeOne,
  },
  {
    title: 'Data Departemen',
    routeName: 'department',
    icon: 'dashboard',
    role: generalOfficeOne,
  },
  { header: 'Data Laporan', role: generalOfficeOne },
  {
    title: 'Data Kehadiran',
    routeName: 'attendance',
    icon: 'event_available',
    role: generalOfficeOne,
  },
  {
    title: 'Data Absensi',
    routeName: 'leave',
    icon: 'event_busy',
    role: generalOfficeOne,
  },
  {
    title: 'Data Pinjaman',
    routeName: 'loan-management',
    icon: 'info',
    role: generalOfficeOne,
  },
  {
    title: 'Buat Payslip',
    routeName: 'choose-report-payslip',
    icon: 'archive',
    role: generalOfficeOne,
  },
  {
    title: 'Laporan Terlambat',
    routeName: 'report-payslip-deduction',
    icon: 'assessment',
    role: generalOfficeOne,
  },
  {
    title: 'Laporan Lembur',
    routeName: 'report-payslip-overtime',
    icon: 'assessment',
    role: generalOfficeOne,
  },
  {
    title: 'Laporan Pengeluaran',
    routeName: 'report-payslip-outcome',
    icon: 'equalizer',
    role: generalOfficeOne,
  },
];

// general hr payslip navigation
export const branchHRPayslipMenu = [
  {
    title: 'Beranda',
    routeName: 'branch-hr-payroll',
    icon: 'home',
    role: branchOfficeOne,
  },
  { header: 'Informasi Karyawan', role: branchOfficeOne },
  {
    title: 'Daftar Karyawan',
    routeName: 'employee',
    icon: 'people',
    role: branchOfficeOne,
  },
  {
    title: 'Data Departemen',
    routeName: 'department',
    icon: 'dashboard',
    role: branchOfficeOne,
  },
  { header: 'Data Laporan', role: branchOfficeOne },
  {
    title: 'Data Kehadiran',
    routeName: 'attendance',
    icon: 'event_available',
    role: branchOfficeOne,
  },
  {
    title: 'Data Absensi',
    routeName: 'leave',
    icon: 'event_busy',
    role: branchOfficeOne,
  },
  {
    title: 'Buat Payslip',
    routeName: 'choose-report-payslip',
    icon: 'archive',
    role: branchOfficeOne,
  },
  // {
  //   title: 'Laporan Terlambat',
  //   routeName: 'report-payslip',
  //   icon: 'assessment',
  //   role: branchOfficeOne,
  // },
];

// owner navigation
export const ownerMenu = [
  {
    title: 'Beranda',
    routeName: 'branch-hr-payroll',
    icon: 'home',
    role: owner,
  },
  { header: 'Informasi Karyawan', role: owner },
  {
    title: 'Daftar Karyawan',
    routeName: 'employee',
    icon: 'people',
    role: owner,
  },
  {
    title: 'Data Departemen',
    routeName: 'department',
    icon: 'dashboard',
    role: owner,
  },
  { header: 'Data Laporan', role: owner },
  {
    title: 'Data Kehadiran',
    routeName: 'attendance',
    icon: 'event_available',
    role: owner,
  },
  {
    title: 'Data Absensi',
    routeName: 'leave',
    icon: 'event_busy',
    role: owner,
  },
  {
    title: 'Data Pinjaman',
    routeName: 'loan-management',
    icon: 'info',
    role: owner,
  },
  {
    title: 'Buat Payslip',
    routeName: 'choose-report-payslip',
    icon: 'archive',
    role: owner,
  },
  {
    title: 'Laporan Terlambat',
    routeName: 'report-payslip-deduction',
    icon: 'assessment',
    role: owner,
  },
  {
    title: 'Laporan Lembur',
    routeName: 'report-payslip-overtime',
    icon: 'assessment',
    role: owner,
  },
  {
    title: 'Laporan Pengeluaran',
    routeName: 'report-payslip-outcome',
    icon: 'equalizer',
    role: owner,
  },
  {
    title: 'Data Log',
    routeName: 'log',
    icon: 'assessment',
    role: owner,
  },
];
