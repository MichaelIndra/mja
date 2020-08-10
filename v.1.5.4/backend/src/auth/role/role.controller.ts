import { Controller } from '@nestjs/common';
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto,
} from '@nestjsx/crud';
import { Role } from './role.entity';
import { ApiUseTags } from '@nestjs/swagger';
import { RolesGuard } from './roles.guard';
import { RoleService } from './role.service';
import { Roles } from './role.decorator';

@Crud({
  model: {
    type: Role,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags('Roles')
@Controller('roles')
export class RoleController implements CrudController<Role> {
  constructor(public service: RoleService) {}

  get base(): CrudController<Role> {
    return this;
  }

  // @Roles('admin')
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Roles('admin')
  @Override('getOneBase')
  getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Roles('admin')
  @Override()
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Role) {
    return this.base.createOneBase(req, dto);
  }

  @Roles('admin')
  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Role>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Roles('admin')
  @Override('updateOneBase')
  coolFunction(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Role) {
    return this.base.updateOneBase(req, dto);
  }

  @Roles('admin')
  @Override('replaceOneBase')
  awesomePUT(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Role) {
    return this.base.replaceOneBase(req, dto);
  }

  @Roles('admin')
  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
