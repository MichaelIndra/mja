import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Department } from './department.entity';
import { Employee } from '../employee/employee.entity';
import { Repository } from 'typeorm';
export declare class DepartmentService extends TypeOrmCrudService<Department> {
    private readonly employeeRepository;
    constructor(repo: any, employeeRepository: Repository<Employee>);
    findByNames(names: string[]): Promise<Department[]>;
    findEmployeeByDepartmentId(departmentId: string): Promise<any>;
}
