import { Position } from './position.entity';
import { PositionService } from './position.service';
import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
export declare class PositionController implements CrudController<Position> {
    service: PositionService;
    constructor(service: PositionService);
    get base(): CrudController<Position>;
    getMany(req: CrudRequest): Promise<Position[] | import("@nestjsx/crud").GetManyDefaultResponse<Position>>;
    getOneAndDoStuff(req: CrudRequest): Promise<Position>;
    createOne(req: CrudRequest, dto: Position): Promise<Position>;
    createMany(req: CrudRequest, dto: CreateManyDto<Position>): Promise<Position[]>;
    coolFunction(req: CrudRequest, dto: Position): Promise<Position>;
    awesomePUT(req: CrudRequest, dto: Position): Promise<Position>;
    deleteOne(req: CrudRequest): Promise<void | Position>;
}
