import { Controller, UseGuards } from '@nestjs/common';
import { Area } from './area.entity';
import { AreaService } from './area.service';
import { RolesGuard } from '../../auth/role/roles.guard';
import { Roles } from '../../auth/role/role.decorator';
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
    type: Area,
  },
  params: {
    departmentId: {
      field: 'department_id',
      type: 'string',
    },
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags('Areas')
@Controller('departments/:departmentId/areas')
@UseGuards(RolesGuard)
export class AreaController implements CrudController<Area> {
  constructor(public service: AreaService) {}

  get base(): CrudController<Area> {
    return this;
  }

  // @Roles('admin')
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override()
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Area) {
    const paramsDepartment: any = req.parsed.paramsFilter.find(
      item => item.field === 'department_id',
    );
    const departmentId: any = paramsDepartment.value;
    const newDto: any = {
      ...dto,
      department_id: departmentId,
    };
    return this.base.createOneBase(req, newDto);
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Area>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  coolFunction(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Area) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  awesomePUT(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Area) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
