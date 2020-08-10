import {
  Controller,
  UseGuards,
  HttpException,
  Request,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto,
} from '@nestjsx/crud';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { OutcomeService } from './outcome.service';
import { Outcome } from './outcome.entity';
import { RolesGuard } from '../auth/role/roles.guard';
import { getUserRole } from '../utils/auth';

@Crud({
  model: {
    type: Outcome,
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
      department: {
        exclude: [],
      },
    },
  },
})
@ApiUseTags('Outcomes')
@Controller('outcomes')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class OutcomeController implements CrudController<Outcome> {
  constructor(public service: OutcomeService) {}

  get base(): CrudController<Outcome> {
    return this;
  }

  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  // @Override('getOneBase')
  // getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
  //   return this.base.getOneBase(req);
  // }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: any,
    @Req() request: Request,
  ) {
    try {
      // return this.base.createOneBase(req, dto);
      const userRole = await getUserRole(
        (request.headers as any).authorization,
      );
      return this.service.customCreateOutcome(dto, userRole);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error, when try get data outcomes.',
          data: {
            // loans: isLoanExists,
          },
        },
        500,
      );
    }
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Outcome>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  // @Override('updateOneBase')
  // coolFunction(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Outcome) {
  //   return this.base.updateOneBase(req, dto);
  // }

  // @Override('replaceOneBase')
  // awesomePUT(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Outcome) {
  //   return this.base.replaceOneBase(req, dto);
  // }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }

  @Get('custom/getOutcomePerDepartment')
  async getTotalLoan(@Query() query: any) {
    try {
      return await this.service.getOutcomePerDepartment(query);
    } catch (err) {
      throw new HttpException(
        err.message || err.response || JSON.stringify(err),
        err.statusCode || err.status || 500,
      );
    }
  }
}
