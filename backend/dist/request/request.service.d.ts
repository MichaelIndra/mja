import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Request } from './request.entity';
export declare class RequestService extends TypeOrmCrudService<Request> {
    constructor(repo: any);
}
