import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
import { OutcomeService } from './outcome.service';
import { Outcome } from './outcome.entity';
export declare class OutcomeController implements CrudController<Outcome> {
    service: OutcomeService;
    constructor(service: OutcomeService);
    get base(): CrudController<Outcome>;
    getMany(req: CrudRequest): Promise<Outcome[] | import("@nestjsx/crud").GetManyDefaultResponse<Outcome>>;
    createOne(req: CrudRequest, dto: any, request: Request): Promise<Outcome>;
    createMany(req: CrudRequest, dto: CreateManyDto<Outcome>): Promise<Outcome[]>;
    deleteOne(req: CrudRequest): Promise<void | Outcome>;
    getTotalLoan(query: any): Promise<any>;
}
