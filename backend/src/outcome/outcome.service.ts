import { Injectable, HttpException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Outcome } from './outcome.entity';
import { Department } from '../department/department.entity';
import { Repository } from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Injectable()
export class OutcomeService extends TypeOrmCrudService<Outcome> {
  constructor(
    @InjectRepository(Outcome) repo,
    @InjectRepository(Department)
    private departmentService: Repository<Department>,
    @InjectRepository(Employee)
    private employeeService: Repository<Employee>,
  ) {
    super(repo);
  }

  async customCreateOutcome(dto: any, userRole: any): Promise<Outcome> {
    try {
      let result: any = {};
      const endAt: any = new Date(dto.end_at + ' 23:59:59').toISOString();
      const outcomeData: any = await this.repo
        .createQueryBuilder('Outcome')
        .where(`department_id = '${dto.department_id}'`)
        .andWhere(`start_at >= '${dto.start_at}'`)
        .andWhere(`end_at <= '${endAt}'`)
        .getOne();
      if (outcomeData) {
        let newNominal: number = outcomeData.nominal_per_period || 0;
        if (userRole === 'owner') {
          dto.employee_payslip.forEach((el: any) => {
            newNominal += el.tambahan_owner;
            outcomeData.employee_payslip.push({
              ...el,
              total_pendapatan: el.tambahan_buku_2,
              total_potongan: el.potongan_buku_2,
              from_owner: true,
            });
          });
        } else {
          dto.employee_payslip.forEach((el: any) => {
            newNominal += el.pendapatan_gaji;
            outcomeData.employee_payslip.push(el);
          });
        }
        const newOutcomeData: any = {
          ...outcomeData,
          nominal_per_period: newNominal,
        };
        console.info('supremacy', newOutcomeData);
        result = await this.repo.save(newOutcomeData);
      } else {
        const newDto: any = {
          ...dto,
          end_at: new Date(dto.end_at).toISOString(),
        };
        const newOutcome = await this.repo.create(newDto);
        result = await this.repo.save(newOutcome);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error, when try get data outcomes.',
          data: {
            // loans: isLoanExists,
          },
        },
        500,
      );
    }
  }

  async getOutcomePerDepartment(query: any): Promise<any> {
    try {
      let start_at: any = '';
      let end_at: any = '';
      if (query.filter && query.filter.length > 0) {
        query.filter.forEach((el: any) => {
          const split = el.split('||');
          if (split[0] === 'start_at') {
            start_at = split[2];
          }
          if (split[0] === 'end_at') {
            end_at = split[2];
          }
        });
      }

      const queryBuilder = this.departmentService.createQueryBuilder(
        'departments',
      );
      /*select
    SELECT departments.name AS departments_name,
    (select sum(outcomes.nominal_per_period) AS 'total' FROM outcomes WHERE outcomes.department_id = departments.id and outcomes.end_at < '2020-01-25 00:00:00' and outcomes.start_at >= '2020-01-11 00:00:00' group by outcomes.department_id) AS nominal FROM departments
    ;*/
      const outcomeTotal = queryBuilder
        .select('departments.name', 'department_name')
        .addSelect(
          queryBuilder
            .subQuery()
            .select('sum(outcomes.nominal_per_period)', 'total')
            .from(Outcome, 'outcomes')
            .where('outcomes.department_id = departments.id')
            .andWhere(`outcomes.start_at >= '${start_at}'`)
            .andWhere(`outcomes.end_at <= '${end_at}'`)
            .groupBy('outcomes.department_id')
            .getQuery(),
          'total',
        );
      console.info('getOutcomePerDepartment', outcomeTotal.getSql());
      return outcomeTotal.getRawMany();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
