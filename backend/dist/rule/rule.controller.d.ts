import { Rule } from './rule.entity';
import { RuleService } from './rule.service';
import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
export declare class RuleController implements CrudController<Rule> {
    service: RuleService;
    constructor(service: RuleService);
    get base(): CrudController<Rule>;
    getMany(req: CrudRequest): Promise<import("@nestjsx/crud").GetManyDefaultResponse<Rule> | Rule[]>;
    getOneAndDoStuff(req: CrudRequest): Promise<Rule>;
    createOne(req: CrudRequest, dto: Rule): Promise<Rule>;
    createMany(req: CrudRequest, dto: CreateManyDto<Rule>): Promise<Rule[]>;
    coolFunction(req: CrudRequest, dto: Rule): Promise<Rule>;
    awesomePUT(req: CrudRequest, dto: Rule): Promise<Rule>;
    deleteOne(req: CrudRequest): Promise<void | Rule>;
}
