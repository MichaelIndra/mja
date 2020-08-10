import { Module } from '@nestjs/common';
import { LeaveService} from './leave.service';
import { LeaveController } from './leave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leave} from './leave.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Leave])],
  providers: [LeaveService],
  controllers: [LeaveController],
})
export class LeaveModule { }
