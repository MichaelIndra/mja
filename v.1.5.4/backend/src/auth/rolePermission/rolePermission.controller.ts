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
import { RolePermission } from './rolePermission.entity';
import { ApiUseTags } from '@nestjs/swagger';
import { RolePermissionService } from './rolePermission.service';

@Crud({
  model: {
    type: RolePermission,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags('RolePermissions')
@Controller('role_permissions')
export class RolePermissionController
  implements CrudController<RolePermission> {
  constructor(public service: RolePermissionService) {}

  get base(): CrudController<RolePermission> {
    return this;
  }

  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override()
  createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: RolePermission,
  ) {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<RolePermission>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  coolFunction(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: RolePermission,
  ) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  awesomePUT(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: RolePermission,
  ) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
