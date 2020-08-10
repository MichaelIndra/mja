import { Controller, UseGuards, Req, Request } from '@nestjs/common';
import { Group } from './group.entity';
import { GroupService } from './group.service';
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
import { getAccountId } from '../../utils/auth';

@Crud({
  model: {
    type: Group,
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
@ApiUseTags('Groups')
@Controller('departments/:departmentId/groups')
@UseGuards(RolesGuard)
export class GroupController implements CrudController<Group> {
  constructor(public service: GroupService) {}

  get base(): CrudController<Group> {
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
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Group) {
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
    @ParsedBody() dto: CreateManyDto<Group>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override()
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Group,
    @Req() request: Request,
  ) {
    const accountId = await getAccountId(
      (request.headers as any).authorization,
    );
    return await this.service.customUpdateOne(req, dto, { accountId });
  }

  @Override()
  async replaceOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Group,
    @Req() request: Request,
  ) {
    const accountId = await getAccountId(
      (request.headers as any).authorization,
    );
    return await this.service.customReplaceOne(req, dto, { accountId });
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest, @Req() request: Request) {
    const accountId = await getAccountId(
      (request.headers as any).authorization,
    );
    return await this.service.customDeleteOne(req, { accountId });
  }
}
