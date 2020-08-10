import { Loan } from './loan.entity';
import { LoanService } from './loan.service';
import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
export declare class LoanController implements CrudController<Loan> {
    service: LoanService;
    constructor(service: LoanService);
    get base(): CrudController<Loan>;
    getMany(req: CrudRequest): Promise<Loan[] | import("@nestjsx/crud").GetManyDefaultResponse<Loan>>;
    getOneAndDoStuff(req: CrudRequest): Promise<Loan>;
    createOne(req: CrudRequest, dto: Loan, request: Request): Promise<Loan>;
    createMany(req: CrudRequest, dto: CreateManyDto<Loan>, request: Request): Promise<Loan[]>;
    updateOne(req: CrudRequest, dto: Loan, request: Request): Promise<Loan>;
    replaceOne(req: CrudRequest, dto: Loan, request: Request): Promise<Loan>;
    deleteOne(req: CrudRequest, request: Request): Promise<any>;
    getCurrentLoan(employeeId: string): Promise<any>;
    getTotalLoan(): Promise<any>;
}
