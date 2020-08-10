import { Controller, UseGuards } from '@nestjs/common';
import { Position } from './position.entity';
import { PositionService } from './position.service';
import { RolesGuard } from '../../../auth/role/roles.guard';
import { Roles } from '../../../auth/role/role.decorator';
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
    type: Position,
  },
  params: {
    areaId: {
      field: 'area_id',
      type: 'string',
    },
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags('Positions')
@Controller('areas/:areaId/positions')
@UseGuards(RolesGuard)
export class PositionController implements CrudController<Position> {
  constructor(public service: PositionService) {}

  get base(): CrudController<Position> {
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
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Position) {
    const paramsDepartment: any = req.parsed.paramsFilter.find(
      item => item.field === 'area_id',
    );
    const areaId: any = paramsDepartment.value;
    const newDto: any = {
      ...dto,
      area_id: areaId,
    };
    return this.base.createOneBase(req, newDto);
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Position>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  coolFunction(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Position) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  awesomePUT(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Position) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
