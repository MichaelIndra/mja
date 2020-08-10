import {
  Controller,
  Req,
  Request,
  Get,
  HttpException,
  Param,
  UseGuards,
  Post,
} from '@nestjs/common';
import { Loan } from './loan.entity';
import { LoanService } from './loan.service';
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
import { RolesGuard } from '../auth/role/roles.guard';
import { Roles } from '../auth/role/role.decorator';
import { ROLES } from '../auth/auth.constant';

@Crud({
  model: {
    type: Loan,
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
    },
  },
})
@ApiUseTags('Loans')
@Controller('loans')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class LoanController implements CrudController<Loan> {
  constructor(public service: LoanService) {}

  get base(): CrudController<Loan> {
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

  @Roles(ROLES.ADMIN, ROLES.GENERAL_HR_PAYROLL, ROLES.OWNER)
  @Override('createOneBase')
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Loan,
    @Req() request: Request,
  ) {
    try {
      const accountId = await getAccountId(
        (request.headers as any).authorization,
      );
      return await this.service.customCreateOne(req, dto, { accountId });
    } catch (err) {
      throw new HttpException(
        err.message || err.response || JSON.stringify(err),
        err.statusCode || err.status || 500,
      );
    }
  }

  @Override()
  async createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Loan>,
    @Req() request: Request,
  ) {
    try {
      const accountId = await getAccountId(
        (request.headers as any).authorization,
      );
      dto.bulk = await dto.bulk.map((item: any) => {
        return {
          ...item,
          created_by_id: accountId,
        };
      });
      return await this.base.createManyBase(req, dto);
    } catch (err) {
      throw new HttpException(
        err.message || err.response || JSON.stringify(err),
        err.statusCode || err.status || 500,
      );
    }
  }

  @Override()
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Loan,
    @Req() request: Request,
  ) {
    try {
      const accountId = await getAccountId(
        (request.headers as any).authorization,
      );
      return await this.service.customUpdateOne(req, dto, { accountId });
    } catch (err) {
      throw new HttpException(
        err.message || err.response || JSON.stringify(err),
        err.statusCode || err.status || 500,
      );
    }
  }

  @Override()
  async replaceOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Loan,
    @Req() request: Request,
  ) {
    try {
      const accountId = await getAccountId(
        (request.headers as any).authorization,
      );
      return await this.service.customReplaceOne(req, dto, { accountId });
    } catch (err) {
      throw new HttpException(
        err.message || err.response || JSON.stringify(err),
        err.statusCode || err.status || 500,
      );
    }
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest, @Req() request: Request) {
    try {
      const accountId = await getAccountId(
        (request.headers as any).authorization,
      );
      return await this.service.customDeleteOne(req, { accountId });
    } catch (err) {
      throw new HttpException(
        err.message || err.response || JSON.stringify(err),
        err.statusCode || err.status || 500,
      );
    }
  }

  @Get('current-loan/:employee_id')
  async getCurrentLoan(@Param('employee_id') employeeId: string) {
    try {
      return await this.service.getCurrentLoanDetail(employeeId);
    } catch (err) {
      throw new HttpException(
        err.message || err.response || JSON.stringify(err),
        err.statusCode || err.status || 500,
      );
    }
  }

  @Get('custom/totalLoanByDepartment')
  async getTotalLoan() {
    try {
      return await this.service.getTotalLoanByDepartment();
    } catch (err) {
      throw new HttpException(
        err.message || err.response || JSON.stringify(err),
        err.statusCode || err.status || 500,
      );
    }
  }
}
