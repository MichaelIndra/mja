import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestModule { }
