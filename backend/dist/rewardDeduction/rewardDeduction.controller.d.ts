import { RewardDeduction } from './rewardDeduction.entity';
import { RewardDeductionService } from './rewardDeduction.service';
import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
export declare class RewardDeductionController implements CrudController<RewardDeduction> {
    service: RewardDeductionService;
    constructor(service: RewardDeductionService);
    get base(): CrudController<RewardDeduction>;
    getMany(req: CrudRequest): Promise<RewardDeduction[] | import("@nestjsx/crud").GetManyDefaultResponse<RewardDeduction>>;
    getOneAndDoStuff(req: CrudRequest): Promise<RewardDeduction>;
    createOne(req: CrudRequest, dto: RewardDeduction): Promise<RewardDeduction>;
    createMany(req: CrudRequest, dto: CreateManyDto<RewardDeduction>): Promise<RewardDeduction[]>;
    coolFunction(req: CrudRequest, dto: RewardDeduction): Promise<RewardDeduction>;
    awesomePUT(req: CrudRequest, dto: RewardDeduction): Promise<RewardDeduction>;
    deleteOne(req: CrudRequest): Promise<void | RewardDeduction>;
}
