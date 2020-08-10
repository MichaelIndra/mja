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
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async getMostLateEmployeeMonthly(query: QueryEmployeeLateMonthly) {
    try {
      const date = query.date.split('-');
      const month: number = Number(date[1]);
      const year: number = Number(date[0]);

      const start_at = new Date(
        Number(year),
        Number(month) - 1,
        1,
        0,
        0,
        0,
      ).toLocaleString();
      const end_at = new Date(
        Number(year),
        Number(month) - 1 + 1,
        1,
        0,
        0,
        0,
      ).toLocaleString();

      console.info(' ==>> START END DATE', start_at, end_at);

      const queryBuilder: any = await this.payslipRepository
        .createQueryBuilder('payslip')
        .select('payslip.*')
        // .select('payslip.id', 'id')
        // .addSelect('payslip.start_at', 'start_at')
        // .addSelect('payslip.end_at', 'end_at')
        // .addSelect(
        //   `payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat'`,
        //   'late_duration',
        // )
        // .addSelect(
        //   `payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
        //   'leave_duration',
        // )
        // .addSelect(
        //   `payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat' + payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
        //   'total',
        // )
        .leftJoin('payslip.employee', 'employee')
        .addSelect(`employee.name`, 'name')
        .addSelect(`employee.id`, 'employee_id')
        .leftJoin('employee.department', 'department')
        .addSelect('department.name', 'department_name')
        .addSelect(`department.meta ->> '$.payslip_filter'`, 'payslip_filter')
        .where(`department.meta -> '$.payslip_filter' = 2`)
        .andWhere(
          `((YEAR(start_at) = :year AND MONTH(start_at) = :month) OR (YEAR(end_at) = :year AND MONTH(end_at) = :month))`,
          { month, year },
        )
        .orderBy(`total`, 'DESC');
      // .orderBy(
      //   `payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat'`,
      //   'DESC',
      // )
      // .addOrderBy(
      //   `payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`,
      //   'DESC',
      // )
      // .limit(10);
      let list = await queryBuilder.execute();

      list = list.map((el: any) => {
        let find: any = {};
        const payslip_type: any = el.employee_meta.department.meta.payslip_type;
        const payslip_filter: any =
          el.employee_meta.department.meta.payslip_filter;
        // calculateWorkingDays
        let total_late = 0;
        let nominal_late = 0;

        let total_leave = 0;
        let nominal_leave = 0;
        let total = 0;

        // late report
        if (
          el.payslip_meta.employee_deductions &&
          el.payslip_meta.employee_deductions.length > 0
        ) {
          el.payslip_meta.employee_deductions.forEach((data: any) => {
            let late_deduction = { result: 0, leftover: 0 };
            let leave_deduction = { result: 0, leftover: 0 };
            let late_duration = 0;
            let leave_duration = 0;

            if (data.type === 'late') {
              // late
              late_deduction = this.calculateWorkingDays(data.total_late, 1800);
              late_duration = late_deduction.result;
              if (payslip_type === '2' && payslip_filter === 2) {
                // potongan terlambat toko bulanan
                if (
                  late_deduction.leftover > 0 &&
                  late_deduction.leftover < 1800
                ) {
                  late_duration += late_deduction.leftover;
                }
              } else if (payslip_type === '1' && payslip_filter === 1) {
                // potongan terlambat produksi
                if (
                  late_deduction.leftover > 0 &&
                  late_deduction.leftover < 1800
                ) {
                  late_duration += 1800;
                } else if (late_deduction.leftover >= 1800) {
                  late_duration += 3600;
                }
              } else if (payslip_type === '2' && payslip_filter === 1) {
                // potongan terlambat mingguan
                if (
                  late_deduction.leftover > 0 &&
                  late_deduction.leftover < 1800
                ) {
                  late_duration += late_deduction.leftover;
                } else if (late_deduction.leftover >= 1800) {
                  late_duration += 3600;
                }
              }
            }

            if (data.type === 'leave') {
              // leave
              leave_deduction = this.calculateWorkingDays(
                data.total_leave,
                1800,
              );
              leave_duration = leave_deduction.result;
              if (
                leave_deduction.leftover > 0 &&
                leave_deduction.leftover < 1800
              ) {
                leave_duration += 1800;
              } else if (leave_deduction.leftover >= 1800) {
                leave_duration += 3600;
              }
            }

            if (data.type === 'both') {
              total_late += late_duration;
              nominal_late += data.cost;
              total_leave += leave_duration;
              nominal_leave += data.cost;
            } else if (data.type === 'late') {
              total_late += late_duration;
              nominal_late += data.cost;
            } else if (data.type === 'leave') {
              total_leave += leave_duration;
              nominal_leave += data.cost;
            }
            total += data.cost;
          });
        }
        if (payslip_type === '1' || payslip_type === '2') {
          find = {
            ...el,
            total_late,
            nominal_late,
            total_leave,
            nominal_leave,
            total,
            raw_total_late: total_late,
            raw_total_leave: total_leave,
            raw_total: total_late + total_leave,
          };
        } else if (payslip_type === '3') {
          const raw_total_late =
            el.payslip_meta.attendance_calculation.durasi_terlambat;
          const raw_total_leave =
            el.payslip_meta.deductions.jumlah_potongan_hari * 3600 * 24 +
            el.payslip_meta.deductions.jumlah_potongan_izin * 3600;

          find = {
            ...el,
            total_late:
              el.payslip_meta.attendance_calculation.durasi_terlambat +
              ' menit',
            nominal_late: el.payslip_meta.deductions.potongan_terlambat,
            total_leave:
              el.payslip_meta.deductions.jumlah_potongan_hari +
              ' hari ' +
              el.payslip_meta.deductions.jumlah_potongan_izin +
              ' jam',
            nominal_leave: el.payslip_meta.deductions.potongan_hari_kerja,
            total:
              el.payslip_meta.deductions.potongan_terlambat +
              el.payslip_meta.deductions.potongan_hari_kerja,
            raw_total_late,
            raw_total_leave,
            raw_total: raw_total_late + raw_total_leave,
          };
        } else {
          return el;
        }
        return find;
      });
      list.sort((a: any, b: any) => {
        return b.raw_total - a.raw_total;
      });
      list = list.filter((item, key) => key < 10);
      return list;

      return list;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getMostDiligentEmployeeMonthly(query: QueryEmployeeLateMonthly) {
    try {
      const date = query.date.split('-');
      const month: number = Number(date[1]);
      const year: number = Number(date[0]);

      const queryBuilder: any = await this.attendanceRepository
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

  calculateWorkingDays(
    totalWorkHours: number, // total working hours in seconds
    divider: number, // unit to achieve
  ) {
    let temp = 0;
    while (totalWorkHours >= divider) {
      temp += divider;
      totalWorkHours -= divider;
    }
    return {
      result: temp,
      leftover: totalWorkHours,
    };
  }
}
