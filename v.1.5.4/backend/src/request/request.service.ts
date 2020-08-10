import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './request.entity';

@Injectable()
export class RequestService extends TypeOrmCrudService<Request> {
  constructor(@InjectRepository(Request) repo) {
    super(repo);
  }
}
