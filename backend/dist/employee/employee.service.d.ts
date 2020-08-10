import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Employee } from './employee.entity';
import { Repository } from 'typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { LogService } from '../log/log.service';
import { DepartmentService } from '../department/department.service';
import { GroupService } from '../department/group/group.service';
import { AreaService } from '../department/area/area.service';
import { PositionService } from '../department/area/position/position.service';
import { GetEmployeeDataForPayslipDto } from './employee.dto';
import { Loan } from '../loan/loan.entity';
export declare class EmployeeService extends TypeOrmCrudService<Employee> {
    private readonly loanRepo;
    private readonly logService;
    private readonly departmentService;
    private readonly groupService;
    private readonly areaService;
    private readonly positionService;
    constructor(repo: any, loanRepo: Repository<Loan>, logService: LogService, departmentService: DepartmentService, groupService: GroupService, areaService: AreaService, positionService: PositionService);
    findByNiks(niks: any[]): Promise<Employee[]>;
    findByIds(ids: string[]): Promise<Employee[]>;
    customGetOne(req: CrudRequest): Promise<Employee>;
    customGetMany(req: CrudRequest): Promise<Employee>;
    customUpdateOne(req: CrudRequest, dto: Employee, additionalData: any): Promise<Employee>;
    customReplaceOne(req: CrudRequest, dto: Employee, additionalData: any): Promise<Employee>;
    customDeleteOne(req: CrudRequest, additionalData: any): Promise<any>;
    getChangeDetail(oldData: any, newData: any): Promise<any>;
    getEmployeeBirthday(): Promise<any>;
    getEmployeeDataForPayslip(query: GetEmployeeDataForPayslipDto): Promise<any>;
    getTotalEmployee(): Promise<{
        total_employee: any;
        total_active_employee: any;
    }>;
    switchGroup(additionalData: any): Promise<{
        changed: any[];
    }>;
}
