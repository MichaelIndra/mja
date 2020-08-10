import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Loan } from './loan.entity';
import { CrudRequest } from '@nestjsx/crud';
import { LogService } from '../log/log.service';
import { Repository } from 'typeorm';
import { Employee } from '../employee/employee.entity';
export declare class LoanService extends TypeOrmCrudService<Loan> {
    private readonly employeeRepository;
    private readonly logService;
    constructor(repo: any, employeeRepository: Repository<Employee>, logService: LogService);
    customCreateOne(req: CrudRequest, dto: Loan, additionalData: any): Promise<Loan>;
    customUpdateOne(req: CrudRequest, dto: Loan, additionalData: any): Promise<Loan>;
    customReplaceOne(req: CrudRequest, dto: Loan, additionalData: any): Promise<Loan>;
    customDeleteOne(req: CrudRequest, additionalData: any): Promise<any>;
    getChangeDetail(oldData: any, newData: any): Promise<any>;
    getCurrentLoanDetail(employeeId: string): Promise<any>;
    getTotalLoanByDepartment(): Promise<any>;
}
