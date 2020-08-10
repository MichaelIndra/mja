import { Attendance } from './attendance.entity';
import { AttendanceService } from './attendance.service';
import { CrudController, CrudRequest } from '@nestjsx/crud';
import { EmployeeService } from '../employee/employee.service';
import { CreateAttendanceDto, CreateManyAttendanceDto } from './attendance.dto';
import { DeleteManyDto } from './delete.dto';
export declare class AttendanceController implements CrudController<Attendance> {
    service: AttendanceService;
    private readonly employeeService;
    constructor(service: AttendanceService, employeeService: EmployeeService);
    get base(): CrudController<Attendance>;
    getMany(req: CrudRequest): Promise<Attendance[] | import("@nestjsx/crud").GetManyDefaultResponse<Attendance>>;
    getOneAndDoStuff(req: CrudRequest): Promise<Attendance>;
    createOne(req: CrudRequest, dto: CreateAttendanceDto): Promise<Attendance>;
    createMany(req: CrudRequest, dto: CreateManyAttendanceDto): Promise<Attendance[]>;
    updateOne(req: CrudRequest, dto: Attendance, request: Request): Promise<Attendance>;
    replaceOne(req: CrudRequest, dto: Attendance, request: Request): Promise<Attendance>;
    deleteOne(req: CrudRequest, request: Request): Promise<any>;
    deleteMany(dto: DeleteManyDto, request: Request): Promise<any>;
}
