import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
import { DepartmentService } from '../department/department.service';
import { GetEmployeeDataForPayslipDto } from './employee.dto';
export declare class EmployeeController implements CrudController<Employee> {
    service: EmployeeService;
    private readonly departmentService;
    constructor(service: EmployeeService, departmentService: DepartmentService);
    get base(): CrudController<Employee>;
    getMany(req: CrudRequest, request: Request): Promise<Employee>;
    getOneAndDoStuff(req: CrudRequest): Promise<Employee>;
    createOne(req: CrudRequest, dto: Employee): Promise<Employee>;
    createMany(req: CrudRequest, dto: CreateManyDto<Employee>): Promise<Employee[]>;
    updateOne(req: CrudRequest, dto: Employee, request: Request): Promise<Employee>;
    replaceOne(req: CrudRequest, dto: Employee, request: Request): Promise<Employee>;
    deleteOne(req: CrudRequest, request: Request): Promise<any>;
    getBirthday(): Promise<any>;
    getTotalEmployee(): Promise<{
        total_employee: any;
        total_active_employee: any;
    }>;
    switchGroup(request: Request): Promise<{
        changed: any[];
    }>;
    getEmployeeDataForPayslip(query: GetEmployeeDataForPayslipDto): Promise<any>;
    getDbBackup(request: Request): any;
}
