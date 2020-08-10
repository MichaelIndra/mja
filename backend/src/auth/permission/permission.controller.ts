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
import { Permission } from './permission.entity';
import { ApiUseTags } from '@nestjs/swagger';
import { PermissionsGuard } from './permission.guard';
import { PermissionService } from './permission.service';
import { Permissions } from './permission.decorator';

@Crud({
  model: {
    type: Permission,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags('Permissions')
@Controller('permissions')
export class PermissionController implements CrudController<Permission> {
  constructor(public service: PermissionService) {}

  get base(): CrudController<Permission> {
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
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Permission) {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Permission>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  coolFunction(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Permission,
  ) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  awesomePUT(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Permission) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
