import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Log } from './log.entity';
import { CrudRequest } from '@nestjsx/crud';
import { Repository } from 'typeorm';
import { Department } from '../department/department.entity';
import { Group } from '../department/group/group.entity';
import { Area } from '../department/area/area.entity';
import { Position } from '../department/area/position/position.entity';
export declare class LogService extends TypeOrmCrudService<Log> {
    private readonly departmentRepository;
    private readonly groupRepository;
    private readonly areaRepository;
    private readonly positionRepository;
    constructor(repo: any, departmentRepository: Repository<Department>, groupRepository: Repository<Group>, areaRepository: Repository<Area>, positionRepository: Repository<Position>);
    create(dto: Partial<Log>): Promise<Log>;
    getMany(req: CrudRequest): Promise<any>;
    getOne(req: CrudRequest): Promise<any>;
    getChangeDetails(res: any): Promise<any>;
    getChangeDetail(res: any): Promise<any>;
}
