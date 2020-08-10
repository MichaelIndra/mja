import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Attendance } from './attendance.entity';
import { CrudRequest } from '@nestjsx/crud';
import { LogService } from '../log/log.service';
import { DeleteManyDto } from './delete.dto';
export declare class AttendanceService extends TypeOrmCrudService<Attendance> {
    private readonly logService;
    constructor(repo: any, logService: LogService);
    checkForDuplicate(dto: any): Promise<Attendance[]>;
    customUpdateOne(req: CrudRequest, dto: Attendance, additionalData: any): Promise<Attendance>;
    customReplaceOne(req: CrudRequest, dto: Attendance, additionalData: any): Promise<Attendance>;
    customDeleteOne(req: CrudRequest, additionalData: any): Promise<any>;
    getChangeDetail(oldData: any, newData: any): Promise<any>;
    deleteMany(dto: DeleteManyDto): Promise<any>;
}
