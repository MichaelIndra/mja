import {
  Controller,
  HttpException,
  UseGuards,
  Delete,
  Request,
  Body,
  Req,
} from '@nestjs/common';
import { Leave } from './leave.entity';
import { LeaveService } from './leave.service';
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
import { getAccountId } from 'utils/auth';
import { DeleteManyLeaveDto } from './leave.dto';

@Crud({
  model: {
    type: Leave,
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
      employee: {
        exclude: [],
      },
      'employee.group': {
        exclude: [],
      },
      'employee.department': {
        exclude: [],
      },
      'employee.area': {
        exclude: [],
      },
      'employee.position': {
        exclude: [],
      },
    },
  },
})
@ApiUseTags('Leaves')
@Controller('leaves')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class LeaveController implements CrudController<Leave> {
  constructor(public service: LeaveService) {}

  get base(): CrudController<Leave> {
    return this;
  }

  // @Roles('admin', 'hr')
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override()
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Leave) {
    const count: any = await this.service.checkForDuplicate(dto);
    const validateAttendance: any = await this.service.validateAttendance(dto);
    const totalLeaveDurationInSeconds =
      new Date(dto.date_end).getTime() - new Date(dto.date_start).getTime();
    // limit hourly leave at 8 hours a day
    if (
      totalLeaveDurationInSeconds > 0 &&
      totalLeaveDurationInSeconds <= 28800
    ) {
      if (Number(count)) {
        return this.base.createOneBase(req, dto);
      } else {
        throw new HttpException('Duplicate value', 409);
      }
    } else {
      if (Number(count) === 0 && Number(validateAttendance) === 0) {
        return this.base.createOneBase(req, dto);
      } else {
        if (Number(count) > 0) {
          throw new HttpException('Duplicate value', 409);
        }
        if (Number(validateAttendance) > 0) {
          throw new HttpException('Attendance data exist', 406);
        }
      }
    }
  }

  @Override()
  async createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Leave>,
  ) {
    // TODO: create custom controller and use transaction with attendance bulk insert
    let countError = 0;
    for (const leaveItem of dto.bulk) {
      countError += Number(await this.service.checkForDuplicate(leaveItem));
    }
    if (countError === 0) {
      return this.base.createManyBase(req, dto);
    } else {
      throw new HttpException('Duplicate value', 409);
    }
  }

  @Override('updateOneBase')
  coolFunction(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Leave) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  awesomePUT(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Leave) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }

  @Delete('delete/bulk')
  async deleteMany(@Body() dto: DeleteManyLeaveDto, @Req() request: Request) {
    return await this.service.deleteMany(dto);
  }
}
