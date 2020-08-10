import { Controller, UseGuards } from '@nestjs/common';
import { Log } from './log.entity';
import { LogService } from './log.service';
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
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Log,
  },
  query: {
    join: {
      account: {
        exclude: [],
      },
    },
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags('Log History')
@Controller('logs')
// @UseGuards(RolesGuard)
@ApiBearerAuth()
export class LogController implements CrudController<Log> {
  constructor(public service: LogService) {}

  get base(): CrudController<Log> {
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
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Log) {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Log>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  coolFunction(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Log) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  awesomePUT(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Log) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
