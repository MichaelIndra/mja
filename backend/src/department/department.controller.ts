import {Controller, Delete, HttpException, Param} from '@nestjs/common';
import { Department } from './department.entity';
import { DepartmentService } from './department.service';
import { RolesGuard } from '../auth/role/roles.guard';
import { Roles } from '../auth/role/role.decorator';
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto,
} from '@nestjsx/crud';
import { ApiUseTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Department,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  query: {
    join: {
      'position': {
        exclude: [],
      },
      'position.area': {
        exclude: [],
      },
      'groups': {
        exclude: [],
      },
      'branch': {
        exclude: [],
      },
    },
  },
})
@ApiUseTags('Departments')
@Controller('departments')
export class DepartmentController implements CrudController<Department> {
  constructor(public service: DepartmentService) {}

  get base(): CrudController<Department> {
    return this;
  }

  @Roles('admin')
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override()
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Department) {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Department>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  coolFunction(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Department,
  ) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  awesomePUT(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Department) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  @Delete()
  async deleteOne(@Param() department_id, @ParsedRequest() req: CrudRequest) {
    if (department_id.id) {
      const validate = await this.service.findEmployeeByDepartmentId(department_id.id);
      // console.info('length', validate.length);
      if (validate.length > 0) {
        throw new HttpException('Departemen tidak dapat di hapus jika masih terdapat karyawan dalam departemen tersebut.', 406);
      } else {
        return this.base.deleteOneBase(req);
      }
    } else {
      throw new HttpException('provide department id', 404);
    }
  }
}
