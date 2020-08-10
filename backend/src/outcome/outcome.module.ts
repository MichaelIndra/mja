import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutcomeController } from './outcome.controller';
import { OutcomeService } from './outcome.service';
import { Outcome } from './outcome.entity';
import { Department } from '../department/department.entity';
import { DepartmentService } from '../department/department.service';
import {Employee} from '../employee/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Outcome, Employee, Department])],
  providers: [OutcomeService, DepartmentService],
  controllers: [OutcomeController],
})
export class OutcomeModule {}
