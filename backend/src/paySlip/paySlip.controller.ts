import {
  Controller,
  UseGuards,
  Req,
  Request,
  HttpException,
  Put,
  Get,
  Query,
} from '@nestjs/common';
import { PaySlip } from './paySlip.entity';
import { PaySlipService } from './paySlip.service';
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
import { getAccountId } from '../utils/auth';
import { QueryOvertimeEmployee, QueryOutcomeReport } from '../report/query.dto';

@Crud({
  model: {
    type: PaySlip,
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
      employee: {
        exclude: [],
      },
    },
  },
})
@ApiUseTags('PaySlips')
@Controller('payslips')
// @UseGuards(RolesGuard)
@ApiBearerAuth()
export class PaySlipController implements CrudController<PaySlip> {
  constructor(public service: PaySlipService) {}

  get base(): CrudController<PaySlip> {
    return this;
  }

  @Roles('admin')
  @Override()
  async getMany(@ParsedRequest() req: CrudRequest) {
    const res = await this.base.getManyBase(req);
    const filterList = req.parsed.filter;
    if (filterList.length > 0) {
      let dateStart: any = filterList.find(
        (el: any) => el.field === 'start_at' && el.operator === 'gte',
      );
      let dateEnd: any = filterList.find(
        (el: any) => el.field === 'end_at' && el.operator === 'lte',
      );
      if (dateStart) {
        dateStart = dateStart.value;
      } else {
        dateStart = new Date().toISOString();
      }
      if (dateEnd) {
        dateEnd = dateEnd.value;
      } else {
        dateEnd = new Date().toISOString();
      }
      const dateFilter = {
        start_at: dateStart,
        end_at: dateEnd,
      };
      const totalOvertime = await this.service.getTotalOvertime(dateFilter);
      return {
        ...res,
        report: totalOvertime,
      };
    } else {
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth() - 2, 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() - 1, 0);
      const dateFilter = {
        start_at: firstDay,
        end_at: lastDay,
      };
      const totalOvertime = await this.service.getTotalOvertime(dateFilter);
      return {
        ...res,
        report: totalOvertime,
      };
    }
  }

  @Override('getOneBase')
  getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override()
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: PaySlip) {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  async createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<PaySlip>,
    @Req() request: Request,
  ) {
    try {
      const accountId = await getAccountId(
        (request.headers as any).authorization,
      );
      return await this.service.customCreateMany(dto, { accountId });
    } catch (err) {
      throw new HttpException(
        err.message || JSON.stringify(err),
        err.status || err.statusCode || 500,
      );
    }
  }

  @Override()
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: PaySlip,
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
    @ParsedBody() dto: PaySlip,
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

  @Put('/custom/bulkUpdate')
  async updateMany(@Req() request: Request) {
    try {
      const accountId = await getAccountId(
        (request.headers as any).authorization,
      );
      return await this.service.customUpdateMany(request.body, { accountId });
    } catch (err) {
      throw new HttpException(
        err.message || JSON.stringify(err),
        err.status || err.statusCode || 500,
      );
    }
  }

  @Get('/custom/getOutcomeReport')
  async getOutcomeReport(@Query() query: QueryOutcomeReport) {
    try {
      const res = await this.service.getOutcomeReport(query);
      return {
        ...res,
        report: [],
      };
    } catch (err) {
      throw new HttpException(
        err.message || JSON.stringify(err),
        err.status || err.statusCode || 500,
      );
    }
  }

  @Get('/custom/getTotalOutcomeReport')
  async getTotalOutcomeReport(@Query() query: QueryOutcomeReport) {
    try {
      const res = await this.service.getTotalOutcomeReport(query);
      return {
        ...res,
      };
    } catch (err) {
      throw new HttpException(
        err.message || JSON.stringify(err),
        err.status || err.statusCode || 500,
      );
    }
  }

  @Get('/custom/getOvertimeReport')
  async getOvertimeReport(@Query() query: QueryOutcomeReport) {
    try {
      const res = await this.service.getOvertimeReport(query);
      return {
        ...res,
      };
    } catch (err) {
      throw new HttpException(
        err.message || JSON.stringify(err),
        err.status || err.statusCode || 500,
      );
    }
  }

  @Get('/custom/getTotalOvertimeReport')
  async getTotalOvertimeReport(@Query() query: QueryOutcomeReport) {
    try {
      const res = await this.service.getTotalOvertimeReport(query);
      return {
        ...res,
      };
    } catch (err) {
      throw new HttpException(
        err.message || JSON.stringify(err),
        err.status || err.statusCode || 500,
      );
    }
  }
}
