import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Area } from './area.entity';
export declare class AreaService extends TypeOrmCrudService<Area> {
    constructor(repo: any);
    findByName(names: string[]): Promise<Area[]>;
}
