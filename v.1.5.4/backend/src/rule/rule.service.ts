import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from './rule.entity';

@Injectable()
export class RuleService extends TypeOrmCrudService<Rule> {
  constructor(@InjectRepository(Rule) repo) {
    super(repo);
  }
}
