import { Controller, Query, Get, HttpException } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiUseTags } from '@nestjs/swagger';
import {
  QueryReportCost,
  QueryEmployeeLateWeekly,
  QueryEmployeeLateMonthly,
} from './query.dto';

@ApiUseTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(public service: ReportService) {}
  @Get('cost-per-month')
  async getTotalCost(@Query() query: QueryReportCost): Promise<any> {
    try {
      return this.service.getTotalCost(query);
    } catch (err) {
      throw new HttpException(
        err.message || JSON.stringify(err),
        err.statusCode || err.status || 500,
      );
    }
  }

  @Get('report-most-late-employee-weekly')
  async getMostLateWeekly(
    @Query() query: QueryEmployeeLateWeekly,
  ): Promise<any> {
    try {
      return this.service.getMostLateEmployeeWeekly(query);
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }

  @Get('report-most-late-employee-monthly')
  async getMostLateMonthly(
    @Query() query: QueryEmployeeLateMonthly,
  ): Promise<any> {
    try {
      return this.service.getMostLateEmployeeMonthly(query);
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }

  @Get('report-most-diligent-employee-monthly')
  async getMostDiligentEmployeeMonthly(
    @Query() query: QueryEmployeeLateMonthly,
  ): Promise<any> {
    try {
      return this.service.getMostDiligentEmployeeMonthly(query);
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }
}
