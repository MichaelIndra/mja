import { Controller, UseGuards } from '@nestjs/common';
import { Branch } from './branch.entity';
import { BranchService } from './branch.service';
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
    type: Branch,
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
      // tslint:disable-next-line: object-literal-key-quotes
      departments: {
        exclude: [],
      },
      accounts: {
        exclude: [],
      },
    },
  },
})
@ApiUseTags('Branch')
@Controller('branchs')
@UseGuards(RolesGuard)
export class BranchController implements CrudController<Branch> {
  constructor(public service: BranchService) {}

  get base(): CrudController<Branch> {
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
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Branch) {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Branch>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  coolFunction(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Branch) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  awesomePUT(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Branch) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
