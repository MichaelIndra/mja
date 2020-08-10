import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Group } from './group.entity';
import { CrudRequest } from '@nestjsx/crud';
import { LogService } from '../../log/log.service';
export declare class GroupService extends TypeOrmCrudService<Group> {
    private readonly logService;
    constructor(repo: any, logService: LogService);
    findByName(names: string[]): Promise<Group[]>;
    customUpdateOne(req: CrudRequest, dto: Group, additionalData: any): Promise<Group>;
    customReplaceOne(req: CrudRequest, dto: Group, additionalData: any): Promise<Group>;
    customDeleteOne(req: CrudRequest, additionalData: any): Promise<any>;
    getChangeDetail(oldData: any, newData: any): Promise<any>;
    getListSwitchable(): Promise<Group[]>;
}
