import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QueryReportCost,
  QueryEmployeeLateWeekly,
  QueryEmployeeLateMonthly,
} from './query.dto';
import { Repository } from 'typeorm';
import { PaySlip } from '../paySlip/paySlip.entity';
import { Attendance } from '../attendance/attendance.entity';
import { Outcome } from '../outcome/outcome.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Outcome)
    private readonly outcomeRepository: Repository<Outcome>,
    @InjectRepository(PaySlip)
    private readonly payslipRepository: Repository<PaySlip>,
    @InjectRepository(Attendance)
    private readonly attendanceRepositoru: Repository<Attendance>,
  ) {}

  async getMostLateEmployeeMonthly(query: QueryEmployeeLateMonthly) {
    try {
      const date = query.date.split('-');
      const month: number = Number(date[1]);
      const year: number = Number(date[0]);

      const queryBuilder: any = await this.payslipRepository
        .createQueryBuilder('payslip')
        .select('payslip.id', 'id')
        .addSelect('payslip.created_at', 'created_at')
        .addSelect(
          `payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat'`,
          'late_duration',
        )
        .addSelect(
          `payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
          'leave_duration',
        )
        .addSelect(
          `payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat' + payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
          'total',
        )
        .leftJoin('payslip.employee', 'employee')
        .addSelect(`employee.name`, 'name')
        .addSelect(`employee.id`, 'employee_id')
        .leftJoin('employee.department', 'department')
        .addSelect('department.name', 'department_name')
        .addSelect(`department.meta ->> '$.payslip_filter'`, 'payslip_filter')
        .where(`department.meta -> '$.payslip_filter' = 2`)
        .andWhere(`MONTH(payslip.created_at) = :month`, { month })
        .andWhere(`YEAR(payslip.created_at) = :year`, { year })
        .orderBy(`total`, 'DESC')
        // .orderBy(
        //   `payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat'`,
        //   'DESC',
        // )
        // .addOrderBy(
        //   `payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
        //   'DESC',
        // )
        .limit(10);
      const res = await queryBuilder.execute();

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getMostDiligentEmployeeMonthly(query: QueryEmployeeLateMonthly) {
    try {
      const date = query.date.split('-');
      const month: number = Number(date[1]);
      const year: number = Number(date[0]);

      const queryBuilder: any = await this.attendanceRepositoru
        .createQueryBuilder('attendances')
        .select('employees.name', 'employee_name')
        .addSelect('departments.name', 'department_name')
        .addSelect(`SUM(attendances.meta ->> '$.totalLate')`, 'total_late')
        .addSelect(`SUM(attendances.meta ->> '$.totalLeave')`, 'total_leave')
        .addSelect(`SUM(attendances.meta ->> '$.totalWork')`, 'total_work')
        .addSelect('count(attendances.id)', 'total_day_work')
        .addSelect(
          `SUM(attendances.meta ->> '$.totalWork') - (SUM(attendances.meta ->> '$.totalLate') + SUM(attendances.meta ->> '$.totalLeave'))`,
          'temp_late_leave',
        )
        .leftJoin('attendances.employee', 'employees')
        .leftJoin('employees.department', 'departments')
        .where(`MONTH(attendances.time_check_in) = :month`, { month })
        .andWhere(`YEAR(attendances.time_check_in) = :year`, { year })
        .groupBy('attendances.employee_id')
        .orderBy('temp_late_leave', 'DESC')
        .limit(10);
      const res = await queryBuilder.execute();

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getMostLateEmployeeWeekly(query: QueryEmployeeLateWeekly) {
    try {
      const start = query.dateStart.slice(0, 23);
      const end = query.dateEnd.slice(0, 23);
      const queryBuilder: any = await this.payslipRepository
        .createQueryBuilder('payslip')
        .select('payslip.id', 'id')
        .addSelect('payslip.created_at', 'created_at')
        .addSelect(
          `payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat'`,
          'late_duration',
        )
        .addSelect(
          `payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
          'leave_duration',
        )
        .addSelect(
          `payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat' + payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
          'total',
        )
        .leftJoin('payslip.employee', 'employee')
        .addSelect(`employee.name`, 'name')
        .addSelect(`employee.id`, 'employee_id')
        .leftJoin('employee.department', 'department')
        .addSelect('department.name', 'department_name')
        .addSelect(`department.meta ->> '$.payslip_filter'`, 'payslip_filter')
        .where(`department.meta -> '$.payslip_filter' = 1`)
        .andWhere(`payslip.created_at BETWEEN :start AND :end`, { start, end })
        .orderBy(`total`, 'DESC')
        // .addOrderBy(
        //   `payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
        //   'DESC',
        // )
        .limit(10);
      const res = await queryBuilder.execute();

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getTotalCost(query: QueryReportCost) {
    try {
      let month_before;
      let year_before;
      if (Number(query.month) === 1) {
        month_before = 12;
        year_before = Number(query.year) - 1;
      } else {
        month_before = Number(query.month) - 1;
        year_before = Number(query.year);
      }

      // get current outcome
      const queryBuilderCurrent = this.outcomeRepository
        .createQueryBuilder('outcomes')
        .select('SUM(outcomes.nominal_per_period)', 'sum_total')
        .where(
          '(MONTH(start_at) = :month AND YEAR(start_at) = :year) AND (MONTH(end_at) = :month AND YEAR(end_at) = :year)',
          { month: query.month, year: query.year },
        );

      // get before outcome
      const queryBuilderBefore = this.outcomeRepository
        .createQueryBuilder('outcomes')
        .select('SUM(outcomes.nominal_per_period)', 'sum_total')
        .where(
          '(MONTH(start_at) = :month AND YEAR(start_at) = :year) AND (MONTH(end_at) = :month AND YEAR(end_at) = :year)',
          { month: month_before, year: year_before },
        );

      // get current lembur
      const queryBuilderCurrentOvertime = this.payslipRepository
        .createQueryBuilder('payslips')
        .select(
          `SUM(payslips.payslip_meta ->> '$.attendance_calculation.tambahan_lembur')`,
          'overtime_total',
        )
        .where(
          '(MONTH(start_at) = :month AND YEAR(start_at) = :year) AND (MONTH(end_at) = :month AND YEAR(end_at) = :year)',
          { month: query.month, year: query.year },
        );

      // get before lembur
      const queryBuilderBeforeOvertime = this.payslipRepository
        .createQueryBuilder('payslips')
        .select(
          `SUM(payslips.payslip_meta ->> '$.attendance_calculation.tambahan_lembur')`,
          'overtime_total',
        )
        .where(
          '(MONTH(start_at) = :month AND YEAR(start_at) = :year) AND (MONTH(end_at) = :month AND YEAR(end_at) = :year)',
          { month: month_before, year: year_before },
        );

      const resCurrent: any = await queryBuilderCurrent.execute();
      const resBefore: any = await queryBuilderBefore.execute();
      const resOvertimeCurrent: any = await queryBuilderCurrentOvertime.execute();
      const resOvertimeBefore: any = await queryBuilderBeforeOvertime.execute();

      return {
        current_year: Number(query.year),
        current_month: Number(query.month),
        current_total: resCurrent[0] ? resCurrent[0].sum_total : 0,
        before_year: Number(year_before),
        before_month: Number(month_before),
        before_total: resBefore[0] ? resBefore[0].sum_total : 0,
        total_overtime_current: resOvertimeCurrent[0]
          ? resOvertimeCurrent[0].overtime_total
          : 0,
        total_overtime_before: resOvertimeBefore[0]
          ? resOvertimeBefore[0].overtime_total
          : 0,
      };
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getTotalCostOld(query: QueryReportCost) {
    try {
      const queryBuilderCurrent = await this.payslipRepository
        .createQueryBuilder('payslips')
        .select('SUM(payslips.total)', 'sum_total')
        // .addSelect(
        //   `SUM(payslips.payslip_meta ->> '$.attendance_calculation.tambahan_lembur')`,
        //   'overtime_total',
        // )
        .where(
          '(MONTH(start_at) = :month AND YEAR(start_at) = :year) OR (MONTH(end_at) = :month AND YEAR(end_at) = :year)',
          { month: query.month, year: query.year },
        );
      // .groupBy(`payslips.employee_meta ->> '$.department.id'`)
      let month_before;
      let year_before;
      if (Number(query.month) === 1) {
        month_before = 12;
        year_before = Number(query.year) - 1;
      } else {
        month_before = Number(query.month) - 1;
        year_before = Number(query.year);
      }
      const queryBuilderBefore = await this.payslipRepository
        .createQueryBuilder('payslips')
        .select('SUM(payslips.total)', 'sum_total')
        .addSelect(
          `SUM(payslips.payslip_meta ->> '$.attendance_calculation.tambahan_lembur')`,
          'overtime_total',
        )
        // .addSelect(`payslips.employee_meta ->> '$.department.id'`, 'group_name')
        .where(
          '(MONTH(start_at) = :month AND YEAR(start_at) = :year) AND (MONTH(end_at) = :month AND YEAR(end_at) = :year)',
          { month: month_before, year: year_before },
        );
      // .groupBy(`payslips.employee_meta ->> '$.department.id'`)

      const resCurrent: any = await queryBuilderCurrent.execute();
      const resBefore: any = await queryBuilderBefore.execute();

      const prev: any = queryBuilderBefore.getSql();
      const dataReport: any = {
        current_year: Number(query.year),
        current_month: Number(query.month),
        current_total: resCurrent[0] ? resCurrent[0].sum_total : 0,
        before_year: Number(year_before),
        before_month: Number(month_before),
        before_total: resBefore[0] ? resBefore[0].sum_total : 0,
        total_overtime_current: resCurrent[0]
          ? resCurrent[0].overtime_total
          : 0,
        total_overtime_before: resBefore[0] ? resBefore[0].overtime_total : 0,
      };
      console.info('yonan2', prev);

      return {
        current_year: Number(query.year),
        current_month: Number(query.month),
        current_total: resCurrent[0] ? resCurrent[0].sum_total : 0,
        before_year: Number(year_before),
        before_month: Number(month_before),
        before_total: resBefore[0] ? resBefore[0].sum_total : 0,
        total_overtime_current: resCurrent[0]
          ? resCurrent[0].overtime_total
          : 0,
        total_overtime_before: resBefore[0] ? resBefore[0].overtime_total : 0,
      };
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
