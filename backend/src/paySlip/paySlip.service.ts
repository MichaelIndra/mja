import { Injectable, HttpException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaySlip } from './paySlip.entity';
import { CrudRequest, CreateManyDto } from '@nestjsx/crud';
import { LogService } from '../log/log.service';
import { ENTITIES } from '../utils/constants';
import { Loan } from '../loan/loan.entity';
import { Repository, getConnection } from 'typeorm';
import { ELoanType } from '../loan/loan.enum';
import { calculateLoan } from '../utils/loanCalculator';
import { findDuplicate } from '../utils/findDuplicate';
import uuid = require('uuid');

@Injectable()
export class PaySlipService extends TypeOrmCrudService<PaySlip> {
  constructor(
    @InjectRepository(PaySlip) repo,
    @InjectRepository(Loan)
    private readonly loanRepo: Repository<Loan>,
    private readonly logService: LogService,
  ) {
    super(repo);
  }

  async customCreateMany(
    dto: CreateManyDto<PaySlip>,
    additionalData: any,
  ): Promise<any> {
    try {
      if (findDuplicate(dto.bulk).length > 0) {
        throw new HttpException(
          {
            message: 'Ada payslip yang sudah pernah di cetak.',
            data: {
              payslips: findDuplicate(dto.bulk),
            },
          },
          409,
        );
      }
      let queryBuilder: any = await this.repo.createQueryBuilder('payslips');
      for (const data of dto.bulk) {
        queryBuilder = await queryBuilder.orWhere(
          `employee_id = :employee_id AND DATE(start_at) <= :start_at AND DATE(end_at) >= :end_at`,
          { ...data },
        );
      }
      const isPayslipExists = await queryBuilder.getMany();
      if (isPayslipExists.length === 0) {
        const res = {
          payslips: [],
          loans: [],
        };
        await getConnection().transaction(async transactionalEntityManager => {
          for (const data of dto.bulk) {
            const tmpData: any = { ...data };
            const tmpDataPayslipCreated: PaySlip = await this.repo.create(data);
            const tmpDataPayslipSaved = await transactionalEntityManager.save(
              tmpDataPayslipCreated,
            );
            res.payslips.push(tmpDataPayslipSaved);

            const latestLoanPay: any = await this.loanRepo.findOne({
              where: {
                employee_id: data.employee_id,
              },
              order: {
                created_at: 'DESC',
              },
            });
            let tmpDataLoan: Partial<Loan> = {
              employee_id: tmpData.employee_id,
              created_by_id: additionalData.accountId,
              type: ELoanType.PAY,
              loan_date: new Date(),
              nominal:
                tmpData.meta && tmpData.meta.payslip
                  ? tmpData.meta.payslip.value_bon_deduction
                  : 0,
            };
            const loanPayData = await calculateLoan(
              latestLoanPay,
              ELoanType.PAY,
              tmpDataLoan.nominal,
            );
            tmpDataLoan = {
              ...tmpDataLoan,
              ...loanPayData,
            };
            if (tmpDataLoan.nominal > 0) {
              const tmpDataLoanCreated: Loan = await this.loanRepo.create(
                tmpDataLoan,
              );
              const tmpDataLoanSaved = await transactionalEntityManager.save(
                tmpDataLoanCreated,
              );
              res.loans.push(tmpDataLoanSaved);
            }
          }
        });
        return res;
      } else {
        throw new HttpException(
          {
            message: 'Ada payslip yang sudah pernah di generate.',
            data: {
              payslips: isPayslipExists,
              // loans: isLoanExists,
            },
          },
          409,
        );
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async customUpdateMany(dto: any, additionalData: any): Promise<any> {
    try {
      let queryBuilder: any = await this.repo.createQueryBuilder('payslips');
      for (const data of dto.bulk) {
        queryBuilder = await queryBuilder.orWhere(`id = :id`, { ...data });
      }
      const isPayslipExists = await queryBuilder.getMany();
      if (isPayslipExists.length > 0) {
        const res = {
          payslips: [],
          loans: [],
        };
        await getConnection().transaction(async transactionalEntityManager => {
          for (const data of dto.bulk) {
            const tmpData: any = { ...data };
            const payslipData = new PaySlip();
            payslipData.id = data.id;
            payslipData.start_at = data.start_at;
            payslipData.end_at = data.end_at;
            const newMeta = {
              ...data.payslip_meta,
              owner_payslip: data.owner_payslip,
            };
            payslipData.payslip_meta = newMeta;
            const tmpDataPayslipSaved = await transactionalEntityManager.save(
              payslipData,
            );
            res.payslips.push(tmpDataPayslipSaved);

            const latestLoanPay: any = await this.loanRepo.findOne({
              where: {
                employee_id: data.employee_id,
              },
              order: {
                created_at: 'DESC',
              },
            });
            let tmpDataLoan: Partial<Loan> = {
              employee_id: tmpData.employee_id,
              created_by_id: additionalData.accountId,
              type: ELoanType.PAY,
              loan_date: new Date(),
              nominal: tmpData.meta
                ? tmpData.meta.payslip.value_bon_deduction
                : 0,
            };
            const loanPayData = await calculateLoan(
              latestLoanPay,
              ELoanType.PAY,
              tmpDataLoan.nominal,
            );
            tmpDataLoan = {
              ...tmpDataLoan,
              ...loanPayData,
            };
            if (tmpDataLoan.nominal > 0) {
              const tmpDataLoanCreated: Loan = await this.loanRepo.create(
                tmpDataLoan,
              );
              const tmpDataLoanSaved = await transactionalEntityManager.save(
                tmpDataLoanCreated,
              );
              res.loans.push(tmpDataLoanSaved);
            }
          }
        });

        return res;
      } else {
        throw new HttpException(
          {
            message: 'Ada payslip yang sudah pernah di generate.',
            data: {
              payslips: isPayslipExists,
              // loans: isLoanExists,
            },
          },
          409,
        );
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async customUpdateOne(
    req: CrudRequest,
    dto: PaySlip,
    additionalData: any,
  ): Promise<PaySlip> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    const oldData = await super.findOne(filterId.value);
    const res: PaySlip = await super.updateOne(req, dto);
    const newData = await super.findOne(filterId.value);

    const changeDetail = await this.getChangeDetail(oldData, newData);

    if (changeDetail.isAnyChange) {
      await this.logService.create({
        entity: ENTITIES.payslip,
        action: 'UPDATE',
        account_id: additionalData.accountId,
        meta: {
          previous_data: changeDetail.oldData,
          current_data: changeDetail.newData,
        },
      });
    }
    return res;
  }

  async customReplaceOne(
    req: CrudRequest,
    dto: PaySlip,
    additionalData: any,
  ): Promise<PaySlip> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    const oldData: any = await super.findOne(filterId.value);
    const res: PaySlip = await super.replaceOne(req, dto);
    const newData: any = await super.findOne(filterId.value);

    const changeDetail = await this.getChangeDetail(oldData, newData);

    if (changeDetail.isAnyChange) {
      await this.logService.create({
        entity: ENTITIES.payslip,
        action: 'UPDATE',
        account_id: additionalData.accountId,
        meta: {
          previous_data: changeDetail.oldData,
          current_data: changeDetail.newData,
        },
      });
    }
    return res;
  }

  async customDeleteOne(req: CrudRequest, additionalData: any): Promise<any> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    const oldData = await super.findOne(filterId.value);
    const res: any = await super.deleteOne(req);
    await this.logService.create({
      entity: ENTITIES.payslip,
      action: 'DELETE',
      account_id: additionalData.accountId,
      meta: {
        previous_data: oldData,
        current_data: null,
      },
    });
    return res;
  }

  async getChangeDetail(oldData: any, newData: any): Promise<any> {
    let isAnyChange: boolean = false;
    if (oldData.meta && newData.meta) {
      const keys = await Object.keys(oldData.meta.payslip);
      for (const key of keys) {
        if (typeof oldData.payslip_meta[key] === 'object') {
          const metaKeys = await Object.keys(oldData.payslip_meta[key]);
          for (const metaKey of metaKeys) {
            if (
              oldData.payslip_meta[key][metaKey] !==
              newData.payslip_meta[key][metaKey]
            ) {
              isAnyChange = true;
            }
          }
        } else if (oldData.payslip_meta[key] !== newData.payslip_meta[key]) {
          isAnyChange = true;
        }
      }
    }

    return {
      isAnyChange,
      oldData,
      newData,
    };
  }

  async getTotalOvertime(datePrams: any) {
    try {
      const queryBuilderCurrent = await this.repo
        .createQueryBuilder('payslips')
        .select(
          `SUM(payslips.payslip_meta ->> '$.attendance_calculation.tambahan_lembur')`,
          'overtime_total',
        )
        // .addSelect(`payslips.employee_meta ->> '$.department.name' `,'department_name')
        .addSelect(
          `payslips.employee_meta ->> '$.department.id' `,
          'department_id',
        )
        .where('start_at >= :startAt AND end_at <= :endAt', {
          startAt: datePrams.start_at,
          endAt: datePrams.end_at,
        })
        // .andWhere(
        //   `payslips.employee_meta ->> '$.department.meta.payslip_type' = '1'`,
        // )
        .groupBy(`payslips.employee_meta ->> '$.department.id'`);

      return await queryBuilderCurrent.execute();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getTotalOvertimeCustom(params: any) {
    try {
      const dateStart = params.filter[0].split('||')[2];
      const dateEnd = params.filter[1].split('||')[2];

      const queryBuilderCurrent = this.repo
        .createQueryBuilder('payslips')
        .select(
          `SUM(payslips.payslip_meta ->> '$.attendance_calculation.tambahan_lembur')`,
          'overtime_total',
        )
        // .addSelect(`payslips.employee_meta ->> '$.department.name' `,'department_name')
        .addSelect(
          `payslips.employee_meta ->> '$.department.id' `,
          'department_id',
        )
        .where('start_at >= :startAt AND end_at <= :endAt', {
          startAt: dateStart,
          endAt: dateEnd,
        })
        // .andWhere(
        //   `payslips.employee_meta ->> '$.department.meta.payslip_type' = '1'`,
        // )
        .groupBy(`payslips.employee_meta ->> '$.department.id'`);
      return await queryBuilderCurrent.execute();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getReportOvertimeEmployee(params: any) {
    try {
      let dateStart = '';
      let dateEnd = '';
      let departmentValue = '';
      let employeeValue = '';

      params.filter.forEach((el: any) => {
        const split = el.split('||');

        if (split.length === 3) {
          if (split[0] === 'start_at') {
            dateStart = split[2];
          } else if (split[0] === 'end_at') {
            dateEnd = split[2];
          } else if (split[0] === 'employee.department_id') {
            departmentValue = split[2];
          } else if (split[0] === 'employee.name') {
            employeeValue = split[2];
          }
        }
      });

      const limit = Number(params.per_page);
      const offset = Number(params.page) - 1;
      const page = Number(params.page);

      let queryBuilder = await this.repo.createQueryBuilder('payslips');
      queryBuilder = queryBuilder
        .select('*')
        // .where(
        //   `payslips.employee_meta ->> '$.department.meta.payslip_type' = 1`,
        // )
        .andWhere('start_at >= :startAt AND end_at <= :endAt', {
          startAt: dateStart,
          endAt: dateEnd,
        });
      if (departmentValue !== '') {
        queryBuilder = queryBuilder.andWhere(
          `payslips.employee_meta ->> '$.department.id' = '${departmentValue}'`,
        );
      }
      if (employeeValue !== '') {
        queryBuilder = queryBuilder.andWhere(
          `payslips.employee_meta ->> '$.name' LIKE '%${employeeValue}%'`,
        );
      }
      queryBuilder = queryBuilder.limit(limit).offset(offset);

      const result = await queryBuilder.getRawMany();
      const total = await queryBuilder.getCount();

      if (total > 0) {
        const returnFormat = {
          data: [],
          count: limit,
          total,
          page,
          pageCount: Math.ceil(total / limit),
        };
        return {
          ...returnFormat,
          data: result,
        };
      } else {
        return {
          count: 0,
          data: [],
          page: 1,
          total: 0,
        };
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getTotalOvertimeReport(params: any) {
    try {
      let dateStart = '';
      let dateEnd = '';
      let departmentValue = '';
      let firstDayOfMonth = '';
      let lastDayOfMonth = '';

      params.filter.forEach((el: any) => {
        const split = el.split('||');
        if (split.length === 3) {
          if (split[0] === 'start_at') {
            dateStart = split[2];
          } else if (split[0] === 'end_at') {
            dateEnd = split[2];
          } else if (split[0] === 'employee.department_id') {
            departmentValue = split[2];
          } else if (split[0] === 'start') {
            firstDayOfMonth = split[2];
          } else if (split[0] === 'end') {
            lastDayOfMonth = split[2];
          }
        }
      });

      let queryBuilder = this.repo.createQueryBuilder('payslips');
      queryBuilder = queryBuilder
        .select(`payslips.employee_meta ->> '$.name'`, 'name')
        .addSelect(
          `payslips.employee_meta ->> '$.department.id'`,
          'department_id',
        )
        .addSelect(
          `payslips.employee_meta ->> '$.department.name'`,
          'department_name',
        )
        .addSelect(`payslips.employee_meta ->> '$.area.name'`, 'area')
        .addSelect(`payslips.employee_meta ->> '$.area.name'`, 'nik')
        .addSelect(`payslips.employee_meta ->> '$.position.name'`, 'position')
        .addSelect('payslips.payslip_meta', 'payslip_meta')
        .addSelect('payslips.start_at', 'start_at')
        .addSelect('payslips.end_at', 'end_at')
        .addSelect(
          `payslips.payslip_meta ->> '$.rewards.durasi_lembur'`,
          'overtime_duration',
        )
        .andWhere('start_at >= :startAt AND end_at <= :endAt', {
          startAt: dateStart,
          endAt: dateEnd,
        })
        .andWhere(
          `payslips.employee_meta ->> '$.department.meta.payslip_filter' = 1`,
        );
      if (departmentValue !== '') {
        queryBuilder = queryBuilder.andWhere(
          `payslips.employee_meta ->> '$.department.id' = '${departmentValue}'`,
        );
      }
      const result = await queryBuilder.getRawMany();
      const res = await this.convertOvertimePayslipWeekly(
        result,
        firstDayOfMonth,
        lastDayOfMonth,
        'dashboard',
      );
      const total = res.reduce(
        (sum, { total_per_department }) => sum + total_per_department,
        0,
      );
      return {
        total,
        start_at: firstDayOfMonth,
        end_at: lastDayOfMonth,
      };
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getOvertimeReport(params: any) {
    try {
      let dateStart = '';
      let dateEnd = '';
      let departmentValue = '';
      let firstDayOfMonth = '';
      let lastDayOfMonth = '';

      params.filter.forEach((el: any) => {
        const split = el.split('||');
        if (split.length === 3) {
          if (split[0] === 'start_at') {
            dateStart = split[2];
          } else if (split[0] === 'end_at') {
            dateEnd = split[2];
          } else if (split[0] === 'employee.department_id') {
            departmentValue = split[2];
          } else if (split[0] === 'start') {
            firstDayOfMonth = split[2];
          } else if (split[0] === 'end') {
            lastDayOfMonth = split[2];
          }
        }
      });

      const limit = Number(params.per_page);
      const offset = Number(params.page) - 1;
      const page = Number(params.page);

      // get raw data
      let queryBuilder = this.repo.createQueryBuilder('payslips');
      queryBuilder = queryBuilder
        .select(`payslips.employee_meta ->> '$.name'`, 'name')
        .addSelect(
          `payslips.employee_meta ->> '$.department.id'`,
          'department_id',
        )
        .addSelect(
          `payslips.employee_meta ->> '$.department.name'`,
          'department_name',
        )
        .addSelect(`payslips.employee_meta ->> '$.area.name'`, 'area')
        .addSelect(`payslips.employee_meta ->> '$.area.name'`, 'nik')
        .addSelect(`payslips.employee_meta ->> '$.position.name'`, 'position')
        .addSelect('payslips.payslip_meta', 'payslip_meta')
        .addSelect('payslips.start_at', 'start_at')
        .addSelect('payslips.end_at', 'end_at')
        .addSelect(
          `payslips.payslip_meta ->> '$.rewards.durasi_lembur'`,
          'overtime_duration',
        )
        .andWhere('start_at >= :startAt AND end_at <= :endAt', {
          startAt: dateStart,
          endAt: dateEnd,
        })
        .andWhere(
          `payslips.employee_meta ->> '$.department.meta.payslip_filter' = 1`,
        );
      if (departmentValue !== '') {
        queryBuilder = queryBuilder.andWhere(
          `payslips.employee_meta ->> '$.department.id' = '${departmentValue}'`,
        );
      }
      const result = await queryBuilder.getRawMany();
      const total = await queryBuilder.getCount();
      const res = await this.convertOvertimePayslipWeekly(
        result,
        firstDayOfMonth,
        lastDayOfMonth,
        'report',
      );

      if (total > 0) {
        const returnFormat = {
          data: [],
          count: limit,
          total,
          page,
          pageCount: Math.ceil(total / limit),
        };
        return {
          ...returnFormat,
          data: res,
        };
      } else {
        return {
          count: 0,
          data: [],
          page: 1,
          total: 0,
        };
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async convertOvertimePayslipWeekly(
    res: any,
    firstDayOfMonth: string,
    lastDayOfMonth: string,
    type: string,
  ) {
    const thisMonth = firstDayOfMonth.substring(0, 10).split('-')[1];
    const thisYears = new Date().getFullYear();

    const result = res.map((el: any, index: number) => {
      const department = {
        name: el.department_name,
        id: el.department_id,
      };
      const employee = {
        name: el.name,
        nik: el.nik,
        position: el.position,
        area: el.area,
      };
      const monthStart = el.start_at
        .toISOString()
        .substring(0, 10)
        .split('-')[1];
      const monthEnd = el.end_at
        .toISOString()
        .substring(0, 10)
        .split('-')[1];
      const overtime = [];
      let totalCost = 0;

      // proses hitung gaji sesuai presensi (split di awal bulan)
      if (monthStart !== thisMonth) {
        const awalTanggalMulaiBulanIni = this.firstDayOfMonth(
          thisYears,
          Number(thisMonth) - 1,
        );
        const awalTanggalSelesaiPeriodeIni = Number(
          el.end_at
            .toISOString()
            .substring(0, 10)
            .split('-')[2],
        );
        const rangeAwalBulan = this.createDateRange(
          awalTanggalMulaiBulanIni,
          awalTanggalSelesaiPeriodeIni,
          thisMonth,
        );
        el.payslip_meta.employee_overtimes.forEach((data: any) => {
          const find = rangeAwalBulan.find((a: any) => {
            return (
              a.date.substring(0, 10) === data.time_check_in.substring(0, 10)
            );
          });
          if (find) {
            totalCost += data.overtime_cost;
            overtime.push({
              date: data.time_check_in,
              duration: data.total_overtime,
              nominal: data.overtime_cost,
            });
          }
        });
        return {
          department,
          employee,
          overtime,
          overtime_duration: el.overtime_duration,
          total: totalCost,
          start_at: new Date(firstDayOfMonth).toISOString(),
          end_at: new Date(el.end_at).toISOString(),
          is_split: 'begining_of_month',
        };
      }
      // proses hitung gaji sesuai presensi (split di akhir bulan)
      if (monthEnd !== thisMonth) {
        const akhirTanggalMulaiBulanIni = Number(
          el.start_at
            .toISOString()
            .substring(0, 10)
            .split('-')[2],
        );
        const akhirTanggalSelesaiPeriodeIni = this.lastDayOfMonth(
          thisYears,
          Number(thisMonth) - 1,
        );
        const rangeAkhirBulan = this.createDateRange(
          akhirTanggalMulaiBulanIni,
          akhirTanggalSelesaiPeriodeIni,
          thisMonth,
        );
        el.payslip_meta.employee_overtimes.forEach((data: any) => {
          const find = rangeAkhirBulan.find((a: any) => {
            return (
              a.date.substring(0, 10) === data.time_check_in.substring(0, 10)
            );
          });
          if (find) {
            totalCost += data.overtime_cost;
            overtime.push({
              date: data.time_check_in,
              duration: data.total_overtime,
              nominal: data.overtime_cost,
            });
          }
        });
        return {
          department,
          employee,
          overtime,
          total: totalCost,
          overtime_duration: el.overtime_duration,
          start_at: new Date(el.start_at).toISOString(),
          end_at: new Date(lastDayOfMonth).toISOString(),
          is_split: 'end_of_month',
        };
      }
      el.payslip_meta.employee_overtimes.forEach((data: any) => {
        totalCost += data.overtime_cost;
        overtime.push({
          date: data.time_check_in,
          duration: data.total_overtime,
          nominal: data.overtime_cost,
        });
      });
      return {
        department,
        employee,
        overtime,
        total: totalCost,
        overtime_duration: el.overtime_duration,
        start_at: new Date(el.start_at).toISOString(),
        end_at: new Date(el.end_at).toISOString(),
        is_split: 'none',
      };
    });
    if (type === 'report') {
      // proses group data berdasarkan departemen dan periode
      const groupPerDepartment = await this.groupingOvertimeDataByDepartment(
        result,
      );
      const endResult = await groupPerDepartment.map(el => {
        const data = this.groupingOutcomeDataByPeriode(el.data);
        return {
          ...el,
          data,
        };
      });
      return endResult;
    } else if (type === 'dashboard') {
      return await this.groupingOvertimeDataByDepartment(result);
    }
  }

  async groupingOvertimeDataByDepartment(arr: any) {
    const groupDepartment = await arr.reduce((acc, d) => {
      const found = acc.find(a => {
        return a.department.id === d.department.id;
      });
      const value = {
        total: Number(d.total),
        employee_name: d.employee.name,
        overtime_duration: d.overtime_duration,
        start_at: d.start_at,
        end_at: d.end_at,
        department_id: d.department.id,
        department: d.department.name,
        area: d.employee.area,
        position: d.employee.position,
        group: d.employee.group,
        nik: d.employee.nik,
        is_split: d.is_split,
        id: uuid.v4(),
      };
      if (!found) {
        acc.push({
          department: {
            id: d.department.id,
          },
          start_at: d.start_at,
          end_at: d.end_at,
          department_name: d.department.name,
          department_id: d.department.id,
          data: [value],
          total_per_department: Number(d.total),
        });
      } else {
        found.total_per_department += Number(value.total);
        found.data.push(value);
      }
      return acc;
    }, []);
    return groupDepartment;
  }

  async getTotalOutcomeReport(params: any) {
    try {
      let dateStart = '';
      let dateEnd = '';
      let departmentValue = '';
      let firstDayOfMonth = '';
      let lastDayOfMonth = '';

      params.filter.forEach((el: any) => {
        const split = el.split('||');
        if (split.length === 3) {
          if (split[0] === 'start_at') {
            dateStart = split[2];
          } else if (split[0] === 'end_at') {
            dateEnd = split[2];
          } else if (split[0] === 'employee.department_id') {
            departmentValue = split[2];
          } else if (split[0] === 'start') {
            firstDayOfMonth = split[2];
          } else if (split[0] === 'end') {
            lastDayOfMonth = split[2];
          }
        }
      });

      // get raw data
      let queryBuilder = this.repo.createQueryBuilder('payslips');
      queryBuilder = queryBuilder
        .select('*')
        .andWhere('start_at >= :startAt AND end_at <= :endAt', {
          startAt: dateStart,
          endAt: dateEnd,
        });
      const result = await queryBuilder.getRawMany();
      const res = await this.convertOutcomePayslips(
        result,
        firstDayOfMonth,
        lastDayOfMonth,
        'dashboard',
      );
      const total = res.reduce(
        (sum, { total_per_department }) => sum + total_per_department,
        0,
      );
      return {
        total,
        start_at: firstDayOfMonth,
        end_at: lastDayOfMonth,
      };
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getOutcomeReport(params: any) {
    try {
      let dateStart = '';
      let dateEnd = '';
      let departmentValue = '';
      let firstDayOfMonth = '';
      let lastDayOfMonth = '';

      params.filter.forEach((el: any) => {
        const split = el.split('||');
        if (split.length === 3) {
          if (split[0] === 'start_at') {
            dateStart = split[2];
          } else if (split[0] === 'end_at') {
            dateEnd = split[2];
          } else if (split[0] === 'employee.department_id') {
            departmentValue = split[2];
          } else if (split[0] === 'start') {
            firstDayOfMonth = split[2];
          } else if (split[0] === 'end') {
            lastDayOfMonth = split[2];
          }
        }
      });

      const limit = Number(params.per_page);
      const offset = Number(params.page) - 1;
      const page = Number(params.page);

      // get raw data
      let queryBuilder = this.repo.createQueryBuilder('payslips');
      queryBuilder = queryBuilder
        .select('*')
        .andWhere('start_at >= :startAt AND end_at <= :endAt', {
          startAt: dateStart,
          endAt: dateEnd,
        });
      if (departmentValue !== '') {
        queryBuilder = queryBuilder.andWhere(
          `payslips.employee_meta ->> '$.department.id' = '${departmentValue}'`,
        );
      }
      const result = await queryBuilder.getRawMany();
      const total = await queryBuilder.getCount();
      const res = await this.convertOutcomePayslips(
        result,
        firstDayOfMonth,
        lastDayOfMonth,
        'report',
      );

      if (total > 0) {
        const returnFormat = {
          data: [],
          count: limit,
          total,
          page,
          pageCount: Math.ceil(total / limit),
        };
        return {
          ...returnFormat,
          data: res,
        };
      } else {
        return {
          count: 0,
          data: [],
          page: 1,
          total: 0,
        };
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async convertOutcomePayslips(
    res: any,
    firstDayOfMonth: string,
    lastDayOfMonth: string,
    type: string,
  ) {
    const thisMonth = firstDayOfMonth.substring(0, 10).split('-')[1];
    const thisYears = new Date().getFullYear();

    const result = res.map((el: any, index: number) => {
      const monthStart = el.start_at
        .toISOString()
        .substring(0, 10)
        .split('-')[1];
      const monthEnd = el.end_at
        .toISOString()
        .substring(0, 10)
        .split('-')[1];
      const gajiHarian = el.total / el.employee_meta.attendances.length;

      // proses hitung gaji sesuai presensi (split di awal bulan)
      if (monthStart !== thisMonth) {
        let awalGajiSesuaiPresensi = 0;
        const awalTanggalMulaiBulanIni = this.firstDayOfMonth(
          thisYears,
          Number(thisMonth) - 1,
        );
        const awalTanggalSelesaiPeriodeIni = Number(
          el.end_at
            .toISOString()
            .substring(0, 10)
            .split('-')[2],
        );
        const rangeAwalBulan = this.createDateRange(
          awalTanggalMulaiBulanIni,
          awalTanggalSelesaiPeriodeIni,
          thisMonth,
        );
        el.employee_meta.attendances.forEach((data: any) => {
          const find = rangeAwalBulan.find((a: any) => {
            return a.date.substring(0, 10) === data.date.substring(0, 10);
          });
          if (find) {
            awalGajiSesuaiPresensi += gajiHarian;
          }
        });
        return {
          ...el,
          total: awalGajiSesuaiPresensi,
          start_at: new Date(firstDayOfMonth).toISOString(),
          end_at: new Date(el.end_at).toISOString(),
          is_split: 'begining_of_month',
        };
      }

      // proses hitung gaji sesuai presensi (split di akhir bulan)
      if (monthEnd !== thisMonth) {
        let akhirGajiSesuaiPresensi = 0;
        const akhirTanggalMulaiBulanIni = Number(
          el.start_at
            .toISOString()
            .substring(0, 10)
            .split('-')[2],
        );
        const akhirTanggalSelesaiPeriodeIni = this.lastDayOfMonth(
          thisYears,
          Number(thisMonth) - 1,
        );
        const rangeAkhirBulan = this.createDateRange(
          akhirTanggalMulaiBulanIni,
          akhirTanggalSelesaiPeriodeIni,
          thisMonth,
        );
        el.employee_meta.attendances.forEach((data: any) => {
          const find = rangeAkhirBulan.find((a: any) => {
            return a.date.substring(0, 10) === data.date.substring(0, 10);
          });
          if (find) {
            akhirGajiSesuaiPresensi += gajiHarian;
          }
        });
        return {
          ...el,
          total: akhirGajiSesuaiPresensi,
          start_at: new Date(el.start_at).toISOString(),
          end_at: new Date(lastDayOfMonth).toISOString(),
          is_split: 'end_of_month',
        };
      }
      return { ...el, is_split: 'none' };
    });
    if (type === 'report') {
      // proses group data berdasarkan departemen dan periode
      const groupPerDepartment = await this.groupingOutcomeDataByDepartment(
        result,
      );
      const endResult = await groupPerDepartment.map(el => {
        const data = this.groupingOutcomeDataByPeriode(el.data);
        return {
          ...el,
          data,
        };
      });
      return endResult;
    } else if (type === 'dashboard') {
      return await this.groupingOutcomeDataByDepartment(result);
    }
  }

  async groupingOutcomeDataByDepartment(arr: any) {
    const groupDepartment = await arr.reduce((acc, d) => {
      const found = acc.find(a => {
        return a.employee_meta.department_id === d.employee_meta.department_id;
      });
      const value = {
        total: Number(d.total),
        employee_name: d.employee_meta.name,
        start_at: d.start_at,
        end_at: d.end_at,
        department_id: d.employee_meta.department_id,
        department: d.employee_meta.department.name,
        area: d.employee_meta.area.name,
        position: d.employee_meta.position.name,
        group: d.employee_meta.group.name,
        nik: d.employee_meta.nik,
        is_split: d.is_split,
        id: uuid.v4(),
      };
      if (!found) {
        acc.push({
          employee_meta: {
            department_id: d.employee_meta.department_id,
          },
          start_at: d.start_at,
          end_at: d.end_at,
          department_name: d.employee_meta.department.name,
          department_id: d.employee_meta.department.id,
          data: [value],
          total_per_department: Number(d.total),
        });
      } else {
        found.total_per_department += Number(value.total);
        found.data.push(value);
      }
      return acc;
    }, []);
    return groupDepartment;
  }

  groupingOutcomeDataByPeriode(arr: any) {
    const groupDepartmentDate = arr.reduce((acc, d) => {
      const found = acc.find(a => {
        return (
          new Date(a.start_at).toISOString() ===
          new Date(d.start_at).toISOString()
        );
      });
      const value = {
        total: Number(d.total),
        name: d.employee_name,
        department: d.department,
        group: d.group,
        position: d.position,
        area: d.area,
        nik: d.nik,
        overtime_duration: d.overtime_duration || 0,
      };
      if (!found) {
        acc.push({
          id: d.id,
          department: d.department,
          department_id: d.department_id,
          start_at: d.start_at,
          end_at: d.end_at,
          data: [value],
          total_per_periode: Number(d.total),
          total_employee: 1,
          is_split: d.is_split,
        });
      } else {
        found.total_per_periode += Number(value.total);
        found.total_employee += 1;
        found.data.push(value);
      }
      return acc;
    }, []);
    return groupDepartmentDate;
  }

  createDateRange(start: number, end: number, month: string) {
    const year = new Date().getFullYear();
    const data = [];
    for (let i = start; i <= end; i++) {
      const date =
        year + '-' + month + '-' + (i < 10 ? '0' + i : i) + ' 00:00:00';
      data.push({
        date,
        nominal: 0,
      });
    }
    return data;
  }

  lastDayOfMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  firstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDate();
  }
}
