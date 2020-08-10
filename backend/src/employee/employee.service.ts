import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { In, DeleteResult, getConnection, Repository } from 'typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { LogService } from '../log/log.service';
import { ENTITIES } from '../utils/constants';
import { DepartmentService } from '../department/department.service';
import { GroupService } from '../department/group/group.service';
import { AreaService } from '../department/area/area.service';
import { PositionService } from '../department/area/position/position.service';
import { Log } from '../log/log.entity';
import { GetEmployeeDataForPayslipDto } from './employee.dto';
import { Loan } from '../loan/loan.entity';

@Injectable()
export class EmployeeService extends TypeOrmCrudService<Employee> {
  constructor(
    @InjectRepository(Employee) repo,
    @InjectRepository(Loan)
    private readonly loanRepo: Repository<Loan>,
    private readonly logService: LogService,
    private readonly departmentService: DepartmentService,
    private readonly groupService: GroupService,
    private readonly areaService: AreaService,
    private readonly positionService: PositionService,
  ) {
    super(repo);
  }

  async findByNiks(niks: any[]): Promise<Employee[]> {
    try {
      if (niks.length === 0) {
        return Promise.reject({
          statusCode: 400,
          message: 'NIK must be an array of string',
        });
      }
      const res = await this.repo.find({
        where: { nik: In(niks) },
        relations: ['group', 'group.department', 'position', 'area'],
      });
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findByIds(ids: string[]): Promise<Employee[]> {
    try {
      if (ids.length === 0) {
        return Promise.reject({
          statusCode: 400,
          message: 'ID must be an array of string',
        });
      }
      const res = await this.repo.find({
        id: In(ids),
      });
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async customGetOne(req: CrudRequest): Promise<Employee> {
    try {
      const isJoinLoans: any = await req.parsed.join.find(item =>
        item.field.includes('loan'),
      );
      let res: any = await super.getOne(req);

      if (isJoinLoans) {
        const latestLoan = await this.loanRepo.findOne({
          where: {
            employee_id: res.id,
          },
          order: {
            created_at: 'DESC',
          },
        });
        res = {
          ...res,
          latestLoan,
        };
      }
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async customGetMany(req: CrudRequest): Promise<Employee> {
    try {
      const isJoinLoans: any = await req.parsed.join.find(item =>
        item.field.includes('loan'),
      );
      let res: any = await super.getMany(req);

      let resData = [];
      if (Array.isArray(res)) {
        resData = res;
      } else if (Array.isArray(res.data)) {
        resData = res.data;
      }

      if (isJoinLoans) {
        for (const idx in resData) {
          if (resData[idx]) {
            const latestLoan = await this.loanRepo.findOne({
              where: {
                employee_id: resData[idx].id,
              },
              order: {
                created_at: 'DESC',
              },
            });
            resData[idx] = {
              ...resData[idx],
              latestLoan,
            };
          }
        }
      }
      if (Array.isArray(res)) {
        res = resData;
      } else if (Array.isArray(res.data)) {
        res = {
          ...res,
          data: res.data,
        };
      }
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async customUpdateOne(
    req: CrudRequest,
    dto: Employee,
    additionalData: any,
  ): Promise<Employee> {
    try {
      const filterId = req.parsed.paramsFilter.find(
        item => item.field === 'id',
      );
      const oldData = await super.findOne(filterId.value);
      const res: Employee = await super.updateOne(req, dto);
      const newData = await super.findOne(filterId.value);

      const changeDetail = await this.getChangeDetail(oldData, newData);

      if (changeDetail.isAnyChange) {
        await this.logService.create({
          entity: ENTITIES.employee,
          action: 'UPDATE',
          account_id: additionalData.accountId,
          meta: {
            previous_data: changeDetail.oldData,
            current_data: changeDetail.newData,
          },
        });
      }
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async customReplaceOne(
    req: CrudRequest,
    dto: Employee,
    additionalData: any,
  ): Promise<Employee> {
    try {
      const filterId = req.parsed.paramsFilter.find(
        item => item.field === 'id',
      );
      const oldData: any = await super.findOne(filterId.value);
      const res: Employee = await super.replaceOne(req, dto);
      const newData: any = await super.findOne(filterId.value);

      const changeDetail = await this.getChangeDetail(oldData, newData);

      if (changeDetail.isAnyChange) {
        await this.logService.create({
          entity: ENTITIES.employee,
          action: 'UPDATE',
          account_id: additionalData.accountId,
          meta: {
            previous_data: changeDetail.oldData,
            current_data: changeDetail.newData,
          },
        });
      }
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async customDeleteOne(req: CrudRequest, additionalData: any): Promise<any> {
    try {
      const filterId = req.parsed.paramsFilter.find(
        item => item.field === 'id',
      );
      const oldData = await super.findOne(filterId.value);
      const res: any = await super.deleteOne(req);
      await this.logService.create({
        entity: ENTITIES.employee,
        action: 'DELETE',
        account_id: additionalData.accountId,
        meta: {
          previous_data: oldData,
          current_data: null,
        },
      });
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getChangeDetail(oldData: any, newData: any): Promise<any> {
    try {
      let isAnyChange: boolean = false;
      if (oldData.department_id !== newData.department_id) {
        isAnyChange = true;
        let department = await this.departmentService.findOne(
          oldData.department_id,
        );
        oldData = {
          ...oldData,
          department_data: department,
        };

        department = await this.departmentService.findOne(
          newData.department_id,
        );
        newData = {
          ...newData,
          department_data: department,
        };
      }

      if (oldData.group_id !== newData.group_id) {
        isAnyChange = true;
        let group = await this.groupService.findOne(oldData.group_id);
        oldData = {
          ...oldData,
          group_data: group,
        };

        group = await this.groupService.findOne(newData.group_id);
        newData = {
          ...newData,
          group_data: group,
        };
      }

      if (oldData.area_id !== newData.area_id) {
        isAnyChange = true;
        let area = await this.areaService.findOne(oldData.area_id);
        oldData = {
          ...oldData,
          area_data: area,
        };

        area = await this.areaService.findOne(newData.area_id);
        newData = {
          ...newData,
          area_data: area,
        };
      }

      if (oldData.position_id !== newData.position_id) {
        isAnyChange = true;
        let position = await this.positionService.findOne(oldData.position_id);
        oldData = {
          ...oldData,
          position_data: position,
        };

        position = await this.positionService.findOne(newData.position_id);
        newData = {
          ...newData,
          position_data: position,
        };
      }

      if (oldData.meta && newData.meta) {
        const keys = await Object.keys(oldData.meta.payslip);
        for (const key of keys) {
          if (oldData.meta.payslip[key] !== newData.meta.payslip[key]) {
            isAnyChange = true;
          }
        }
      }

      return {
        isAnyChange,
        oldData,
        newData,
      };
    } catch (err) {
      return Promise.reject(err);
    }
  }
  async getEmployeeBirthday() {
    try {
      const queryBuilder: any = this.repo
        .createQueryBuilder('employees')
        .addSelect('nik')
        .addSelect('picture')
        .addSelect('name')
        .addSelect('date_of_birth')
        .addSelect(
          `DATE(CONCAT(YEAR(CURDATE()),'-',SUBSTRING_INDEX(SUBSTRING_INDEX(date_of_birth,'/',-1),'-',-2)))`,
          'current_birth_day',
        )
        .where(
          `DATE(CONCAT(YEAR(CURDATE()),'-',SUBSTRING_INDEX(SUBSTRING_INDEX(date_of_birth,'/',-1),'-',-2))) >= CURDATE()`,
        )
        .orderBy('current_birth_day', 'ASC')
        .limit(5);
      return await queryBuilder.getMany();
    } catch (err) {
      return Promise.reject(err);
    }
  }
  async getEmployeeDataForPayslip(query: GetEmployeeDataForPayslipDto) {
    const { department_id, date_start, date_end, status } = query;
    try {
      let queryBuilder: any = await this.repo
        .createQueryBuilder('Employee')
        .innerJoinAndSelect('Employee.department', 'departments')
        .innerJoinAndSelect('Employee.group', 'groups')
        .innerJoinAndSelect('Employee.area', 'areas')
        .innerJoinAndSelect('Employee.position', 'positions')
        .leftJoinAndSelect(
          'Employee.attendances',
          'attendances',
            `attendances.time_check_in >= :date_start AND attendances.time_check_out <= :date_end`,
          { date_start, date_end },
          )
        .leftJoinAndSelect(
          'Employee.leaves',
          'leaves',
          `leaves.date_start >= :date_start OR leaves.date_end <= :date_end`,
          { date_start, date_end },
        )
        // .leftJoinAndSelect('Employee.loans', 'loans')
        .leftJoinAndSelect(
          'Employee.payslips',
          'Payslips',
          `Payslips.start_at >= :date_start AND Payslips.end_at <= :date_end`,
          { date_start, date_end },
        )
        .where(`Employee.active = true`)
      ;

      if (status !== undefined) {
        queryBuilder = queryBuilder.andWhere('Employee.status = :status', {
          status,
        });
      }

      queryBuilder = queryBuilder
        .andWhere(`Employee.department_id = :department_id`, { department_id })
        .andWhere(
          `attendances.time_check_in BETWEEN :date_start AND :date_end`,
          { date_start, date_end },
        )
        .orderBy('Employee.name', 'ASC')
        .addOrderBy('attendances.time_check_in', 'ASC')
      ;
      let res = await queryBuilder.getMany();

      let resData = [];
      if (Array.isArray(res)) {
        resData = res;
      } else if (Array.isArray(res.data)) {
        resData = res.data;
      }

      for (const idx in resData) {
        if (resData[idx]) {
          const latestLoan = await this.loanRepo.findOne({
            where: {
              employee_id: resData[idx].id,
            },
            order: {
              created_at: 'DESC',
            },
          });
          resData[idx] = {
            ...resData[idx],
            latestLoan,
          };
        }
      }
      if (Array.isArray(res)) {
        res = resData;
      } else if (Array.isArray(res.data)) {
        res = {
          ...res,
          data: res.data,
        };
      }

      if (status !== undefined && status === 'KHUSUS') {
        res = res.filter((el: any) => {
          return el.payslips && el.payslips.length > 0;
        });
      }

      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getTotalEmployee() {
    try {
      const queryBuilder: any = await this.repo.createQueryBuilder('employees');
      const queryBuilderActive: any = await this.repo
        .createQueryBuilder('employees')
        .where('active = 1');
      const totalEmployee = await queryBuilder.getCount();
      const totalActiveEmployee = await queryBuilderActive.getCount();
      return {
        total_employee: totalEmployee,
        total_active_employee: totalActiveEmployee,
      };
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async switchGroup(additionalData: any) {
    try {
      const listEmployee: any = await this.repo
        .createQueryBuilder('employee')
        .select('employee.id', 'id')
        .addSelect('employee.name', 'name')
        .addSelect('group.switchable', 'group_switchable')
        .addSelect('employee.group_id', 'group_id')
        .addSelect('group.name', 'group_name')
        .leftJoin('employee.group', 'group')
        .where('group.switchable = 1')
        .andWhere('employee.active = 1')
        .getRawMany();

      const listGroup: any = await this.groupService.getListSwitchable();
      const listDepartmentWithGroup = await listGroup.reduce((acc, curr) => {
        if (!acc[curr.department_id]) {
          acc[curr.department_id] = {
            department_id: curr.department_id,
            groups: [curr],
          };
          return acc;
        }
        acc[curr.department_id].groups.push(curr);
        return acc;
      }, {});

      for (const department_id of Object.keys(listDepartmentWithGroup)) {
        const dataDepartment = listDepartmentWithGroup[department_id];
        if (dataDepartment.groups.length > 0) {
          for (const index in dataDepartment.groups) {
            if (dataDepartment.groups[index]) {
              let indexChanged;
              const maxIndex = dataDepartment.groups.length - 1;
              if (Number(index) === 0 && maxIndex === 0) {
                indexChanged = null;
              } else if (Number(index) + 1 <= maxIndex) {
                indexChanged = Number(index) + 1;
              } else if (Number(index) === maxIndex) {
                indexChanged = 0;
              } else {
                indexChanged = null;
              }

              if (indexChanged === null) {
                // do nothing
              } else {
                const employees = listEmployee.filter(
                  (item: any) =>
                    item.group_id === dataDepartment.groups[index].id,
                );
                listDepartmentWithGroup[department_id].groups[index] = {
                  ...dataDepartment.groups[index],
                  switch_to_group: dataDepartment.groups[indexChanged],
                  employees,
                };
              }
            }
          }
        }
      }

      const res = {
        changed: [],
      };
      await getConnection().transaction(async transactionalEntityManager => {
        for (const department_id of Object.keys(listDepartmentWithGroup)) {
          const dataDepartment = listDepartmentWithGroup[department_id];
          if (dataDepartment.groups.length > 0) {
            for (const dataGroup of dataDepartment.groups) {
              if (dataGroup.switch_to_group) {
                for (const dataEmployee of dataGroup.employees) {
                  await transactionalEntityManager.update(
                    Employee,
                    dataEmployee.id,
                    { group_id: dataGroup.switch_to_group.id },
                  );
                  const tmpData = {
                    ...dataEmployee,
                    switch_to_group: {
                      id: dataGroup.switch_to_group.id,
                      name: dataGroup.switch_to_group.name,
                      department: dataGroup.switch_to_group.department,
                    },
                  };
                  res.changed.push(tmpData);
                }
              }
            }
          }
        }
        const logData: any = {
          entity: ENTITIES.employee,
          action: 'SWITCH_GROUP',
          account_id: additionalData.accountId,
          meta: {
            previous_data: null,
            current_data: null,
            additional_data: res,
          },
        };
        const logCreated = await transactionalEntityManager.create(
          Log,
          logData,
        );
        await transactionalEntityManager.save(logCreated);
      });

      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
