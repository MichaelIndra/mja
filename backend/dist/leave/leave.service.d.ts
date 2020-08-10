import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Leave } from './leave.entity';
import { DeleteManyLeaveDto } from './leave.dto';
export declare class LeaveService extends TypeOrmCrudService<Leave> {
    constructor(repo: any);
    checkForDuplicate(dto: Leave): Promise<any>;
    validateAttendance(dto: Leave): Promise<any>;
    deleteMany(dto: DeleteManyLeaveDto): Promise<any>;
}
