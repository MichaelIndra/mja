import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './department.entity';
import {Employee} from '../employee/employee.entity';
import {In, Repository} from 'typeorm';

@Injectable()
export class DepartmentService extends TypeOrmCrudService<Department> {
  constructor(
    @InjectRepository(Department) repo,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {
    super(repo);
  }
  async findByNames(names: string[]): Promise<Department[]> {
    try {
      if (names.length === 0) {
        return Promise.reject({
          statusCode: 400,
          message: 'Department name must be an array of string',
        });
      }
      const res = await this.repo.find({
        where: {name: In(names)},
        relations: [
          'groups',
          'areas',
          'areas.positions',
        ],
      });
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findEmployeeByDepartmentId(departmentId: string): Promise<any> {
    try {
      const res = await this.employeeRepository.find({
        where: {department_id: departmentId},
      });
      console.info('res', res);
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
