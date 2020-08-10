import { Injectable, HttpException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from './loan.entity';
import { CrudRequest } from '@nestjsx/crud';
import { LogService } from '../log/log.service';
import { ENTITIES } from '../utils/constants';
import { ELoanType } from './loan.enum';
import { calculateLoan } from '../utils/loanCalculator';
import { Repository } from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Injectable()
export class LoanService extends TypeOrmCrudService<Loan> {
  constructor(
    @InjectRepository(Loan) repo,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly logService: LogService,
  ) {
    super(repo);
  }

  async customCreateOne(
    req: CrudRequest,
    dto: Loan,
    additionalData: any,
  ): Promise<Loan> {
    try {
      const latestLoanPay: Loan = await this.repo.findOne({
        where: {
          employee_id: dto.employee_id,
        },
        order: {
          created_at: 'DESC',
        },
      });
      const loanPayData: any = await calculateLoan(
        latestLoanPay,
        dto.type,
        dto.nominal,
      );
      if (loanPayData) {
        const newDto: any = {
          ...dto,
          ...loanPayData,
          create_by_id: additionalData.accountId,
        };
        const res: Loan = await super.createOne(req, newDto);
        return res;
      } else {
        return Promise.reject({
          statusCode: 400,
          message: 'Nominal must be more than 0',
        });
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async customUpdateOne(
    req: CrudRequest,
    dto: Loan,
    additionalData: any,
  ): Promise<Loan> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    const oldData = await super.findOne(filterId.value);
    const res: Loan = await super.updateOne(req, dto);
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
    dto: Loan,
    additionalData: any,
  ): Promise<Loan> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    const oldData: any = await super.findOne(filterId.value);
    const res: Loan = await super.replaceOne(req, dto);
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
    const keys = Object.keys(oldData);
    for (const key of keys) {
      if (oldData[key] !== newData[key]) {
        isAnyChange = true;
      }
    }

    return {
      isAnyChange,
      oldData,
      newData,
    };
  }

  async getCurrentLoanDetail(employeeId: string): Promise<any> {
    try {
      const queryBuilder = await this.repo
        .createQueryBuilder('loans')
        .addSelect('id')
        .addSelect('employee_id')
        .addSelect('type')
        .addSelect('SUM(loans.nominal)', 'sum_nominal')
        .where('employee_id = :employeeId ', { employeeId })
        .addGroupBy('employee_id')
        .addGroupBy('type');
      const results = await queryBuilder.getRawMany();
      const res = {
        total_loan: 0,
        total_paid: 0,
        current_loan: 0,
      };
      for (const data of results) {
        if (data.type === ELoanType.LOAN) {
          res.total_loan = Number(data.sum_nominal);
        } else if (data.type === ELoanType.PAY) {
          res.total_paid = Number(data.sum_nominal);
        }
      }
      res.current_loan = res.total_loan - res.total_paid;
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }
  async getTotalLoanByDepartment(): Promise<any> {
    try {
      /*select
      departments.name as 'department',
        sum((select loans.total_loan_current
      from loans
      where loans.employee_id = employees.id
      order by loans.loan_date desc
      limit 1) ) as 'total_loan'
      from employees
      join departments ON employees.department_id = departments.id
      group by departments.name
      ;*/

      const queryBuilder = await this.employeeRepository.createQueryBuilder(
        'employees',
      );
      const realQuery = queryBuilder
        .select(
          'sum((' +
            queryBuilder
              .subQuery()
              .select('loans.total_loan_current')
              .from(Loan, 'loans')
              .where('loans.employee_id = employees.id')
              .orderBy('loans.loan_date', 'DESC')
              .limit(1)
              .getQuery() +
            ') )',
          'total_loan',
        )
        .addSelect('departments.name')
        .leftJoin('employees.department', 'departments')
        .groupBy('departments.name');
      return await realQuery.getRawMany();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
