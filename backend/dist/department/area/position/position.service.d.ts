import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Position } from './position.entity';
export declare class PositionService extends TypeOrmCrudService<Position> {
    constructor(repo: any);
    findByName(names: string[]): Promise<Position[]>;
}
