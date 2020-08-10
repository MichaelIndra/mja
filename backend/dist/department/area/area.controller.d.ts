import { Area } from './area.entity';
import { AreaService } from './area.service';
import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
export declare class AreaController implements CrudController<Area> {
    service: AreaService;
    constructor(service: AreaService);
    get base(): CrudController<Area>;
    getMany(req: CrudRequest): Promise<Area[] | import("@nestjsx/crud").GetManyDefaultResponse<Area>>;
    getOneAndDoStuff(req: CrudRequest): Promise<Area>;
    createOne(req: CrudRequest, dto: Area): Promise<Area>;
    createMany(req: CrudRequest, dto: CreateManyDto<Area>): Promise<Area[]>;
    coolFunction(req: CrudRequest, dto: Area): Promise<Area>;
    awesomePUT(req: CrudRequest, dto: Area): Promise<Area>;
    deleteOne(req: CrudRequest): Promise<void | Area>;
}
