import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaySlip } from '../paySlip/paySlip.entity';
import { Attendance } from '../attendance/attendance.entity';
import { Outcome } from '../outcome/outcome.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaySlip, Attendance, Outcome])],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
