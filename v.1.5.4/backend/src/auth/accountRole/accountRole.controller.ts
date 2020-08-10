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
import { AccountRole } from './accountRole.entity';
import { ApiUseTags } from '@nestjs/swagger';
import { AccountRoleService } from './accountRole.service';

@Crud({
  model: {
    type: AccountRole,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags('AccountRoles')
@Controller('account_roles')
export class AccountRoleController implements CrudController<AccountRole> {
  constructor(public service: AccountRoleService) {}

  get base(): CrudController<AccountRole> {
    return this;
  }

  // @Roles('admin')
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  // @Roles('admin')
  @Override('getOneBase')
  getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  // @Roles('admin')
  @Override()
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: AccountRole) {
    return this.base.createOneBase(req, dto);
  }

  // @Roles('admin')
  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<AccountRole>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  // @Roles('admin')
  @Override('updateOneBase')
  coolFunction(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: AccountRole,
  ) {
    return this.base.updateOneBase(req, dto);
  }

  // @Roles('admin')
  @Override('replaceOneBase')
  awesomePUT(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: AccountRole,
  ) {
    return this.base.replaceOneBase(req, dto);
  }

  // @Roles('admin')
  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
