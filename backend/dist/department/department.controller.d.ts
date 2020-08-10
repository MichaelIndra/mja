import { Department } from './department.entity';
import { DepartmentService } from './department.service';
import { CrudController, CrudRequest, CreateManyDto } from '@nestjsx/crud';
export declare class DepartmentController implements CrudController<Department> {
    service: DepartmentService;
    constructor(service: DepartmentService);
    get base(): CrudController<Department>;
    getMany(req: CrudRequest): Promise<Department[] | import("@nestjsx/crud").GetManyDefaultResponse<Department>>;
    getOneAndDoStuff(req: CrudRequest): Promise<Department>;
    createOne(req: CrudRequest, dto: Department): Promise<Department>;
    createMany(req: CrudRequest, dto: CreateManyDto<Department>): Promise<Department[]>;
    coolFunction(req: CrudRequest, dto: Department): Promise<Department>;
    awesomePUT(req: CrudRequest, dto: Department): Promise<Department>;
    deleteOne(department_id: any, req: CrudRequest): Promise<void | Department>;
}
