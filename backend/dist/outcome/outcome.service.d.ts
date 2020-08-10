import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Outcome } from './outcome.entity';
import { Department } from '../department/department.entity';
import { Repository } from 'typeorm';
import { Employee } from '../employee/employee.entity';
export declare class OutcomeService extends TypeOrmCrudService<Outcome> {
    private departmentService;
    private employeeService;
    constructor(repo: any, departmentService: Repository<Department>, employeeService: Repository<Employee>);
    customCreateOutcome(dto: any, userRole: any): Promise<Outcome>;
    getOutcomePerDepartment(query: any): Promise<any>;
}
